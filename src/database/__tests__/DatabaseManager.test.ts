import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

// Mock all external dependencies BEFORE importing the module under test
vi.mock('../core/database', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      getDatabaseInstance: vi.fn().mockResolvedValue({
        collections: {},
        remove: vi.fn().mockResolvedValue(undefined),
      }),
    })),
  };
});

vi.mock('../core/replicator', () => ({
  default: vi.fn().mockImplementation(() => ({
    startReplication: vi.fn().mockResolvedValue(undefined),
    cancelReplication: vi.fn(),
    resyncReplication: vi.fn().mockResolvedValue(undefined),
  })),
}));

// Mock all schemas explicitly (each must be inlined due to vi.mock hoisting)
vi.mock('../schemas/scenes.schema', () => ({ default: vi.fn().mockImplementation(() => ({ SchemaName: () => 'scenes' })) }));
vi.mock('../schemas/paragraphs.schema', () => ({ default: vi.fn().mockImplementation(() => ({ SchemaName: () => 'paragraphs' })) }));
vi.mock('../schemas/projects.schema', () => ({ default: vi.fn().mockImplementation(() => ({ SchemaName: () => 'projects' })) }));
vi.mock('../schemas/units.schema', () => ({ default: vi.fn().mockImplementation(() => ({ SchemaName: () => 'units' })) }));
vi.mock('../schemas/shootings.schema', () => ({ default: vi.fn().mockImplementation(() => ({ SchemaName: () => 'shootings' })) }));
vi.mock('../schemas/talents.schema', () => ({ default: vi.fn().mockImplementation(() => ({ SchemaName: () => 'talents' })) }));
vi.mock('../schemas/crew.schema', () => ({ default: vi.fn().mockImplementation(() => ({ SchemaName: () => 'crew' })) }));
vi.mock('../schemas/country.schema', () => ({ default: vi.fn().mockImplementation(() => ({ SchemaName: () => 'countries' })) }));
vi.mock('../schemas/serviceMatrices.schema', () => ({ default: vi.fn().mockImplementation(() => ({ SchemaName: () => 'service_matrices' })) }));
vi.mock('../schemas/user.schema', () => ({ default: vi.fn().mockImplementation(() => ({ SchemaName: () => 'users' })) }));
vi.mock('../schemas/projWeeks.schema', () => ({ default: vi.fn().mockImplementation(() => ({ SchemaName: () => 'proj_weeks' })) }));
vi.mock('../schemas/stripboard.schema', () => ({ default: vi.fn().mockImplementation(() => ({ SchemaName: () => 'stripboard' })) }));

describe('DatabaseManager', () => {
  let databaseManager: any;

  beforeEach(async () => {
    // Reset modules to get a fresh singleton each test
    vi.resetModules();
    const mod = await import('../managers/DatabaseManager');
    databaseManager = mod.databaseManager;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('singleton pattern', () => {
    it('should always return the same instance via the export', async () => {
      const mod = await import('../managers/DatabaseManager');
      expect(mod.databaseManager).toBe(databaseManager);
    });
  });

  describe('pre-initialization state', () => {
    it('should return null from getDatabase before initialization', () => {
      expect(databaseManager.getDatabase()).toBeNull();
    });

    it('should return false from isReady before initialization', () => {
      expect(databaseManager.isReady()).toBe(false);
    });

    it('should return false from isInitializingDatabase initially', () => {
      expect(databaseManager.isInitializingDatabase()).toBe(false);
    });
  });

  describe('initializeDatabase', () => {
    it('should create database instance on first call', async () => {
      const db = await databaseManager.initializeDatabase();
      expect(db).toBeDefined();
      expect(db.collections).toBeDefined();
    });

    it('should return existing instance on subsequent calls (idempotent)', async () => {
      const db1 = await databaseManager.initializeDatabase();
      const db2 = await databaseManager.initializeDatabase();
      expect(db1).toBe(db2);
    });

    it('should set isReady to true after initialization', async () => {
      expect(databaseManager.isReady()).toBe(false);
      await databaseManager.initializeDatabase();
      expect(databaseManager.isReady()).toBe(true);
    });

    it('should emit database:ready event on success', async () => {
      vi.resetModules();
      const eventsModule = await import('../events');
      const emitSpy = vi.spyOn(eventsModule.dbEvents, 'emit');
      const mod = await import('../managers/DatabaseManager');

      await mod.databaseManager.initializeDatabase();

      expect(emitSpy).toHaveBeenCalledWith('database:ready', expect.anything());
      emitSpy.mockRestore();
    });

    it('should emit database:error event on failure', async () => {
      vi.resetModules();

      // Re-mock database to fail
      vi.doMock('../core/database', () => ({
        default: vi.fn().mockImplementation(() => ({
          getDatabaseInstance: vi.fn().mockRejectedValue(new Error('DB creation failed')),
        })),
      }));

      const eventsModule = await import('../events');
      const emitSpy = vi.spyOn(eventsModule.dbEvents, 'emit');
      const mod = await import('../managers/DatabaseManager');

      await expect(mod.databaseManager.initializeDatabase()).rejects.toThrow('DB creation failed');
      expect(emitSpy).toHaveBeenCalledWith('database:error', expect.any(Error));

      emitSpy.mockRestore();

      // Restore the original mock so subsequent tests are not contaminated
      vi.doMock('../core/database', () => ({
        default: vi.fn().mockImplementation(() => ({
          getDatabaseInstance: vi.fn().mockResolvedValue({
            collections: {},
            remove: vi.fn().mockResolvedValue(undefined),
          }),
        })),
      }));
    });

    it('should deduplicate concurrent initialization calls', async () => {
      vi.resetModules();
      const AppDataBaseMod = await import('../core/database');
      const mod = await import('../managers/DatabaseManager');

      const [db1, db2] = await Promise.all([
        mod.databaseManager.initializeDatabase(),
        mod.databaseManager.initializeDatabase(),
      ]);

      expect(db1).toBe(db2);
      expect(AppDataBaseMod.default).toHaveBeenCalledTimes(1);
    });

    it('should populate all 12 collection references after init', async () => {
      await databaseManager.initializeDatabase();

      const collections = [
        'sceneCollection', 'projectCollection', 'paragraphCollection',
        'unitsCollection', 'shootingsCollection', 'talentsCollection',
        'crewCollection', 'serviceMatricesCollection', 'userCollection',
        'projWeeksCollection', 'stripboardCollection', 'countriesCollection',
      ];

      for (const col of collections) {
        expect(databaseManager[col]).not.toBeNull();
      }
    });
  });

  describe('getDatabase after init', () => {
    it('should return db instance after initialization', async () => {
      await databaseManager.initializeDatabase();
      const db = databaseManager.getDatabase();
      expect(db).not.toBeNull();
      expect(db.collections).toBeDefined();
    });
  });

  describe('hardResync', () => {
    it('should throw if database is not initialized', async () => {
      await expect(databaseManager.hardResync()).rejects.toThrow('Database not initialized');
    });

    it('should clear all collections except projects and users', async () => {
      await databaseManager.initializeDatabase();
      const db = databaseManager.getDatabase();

      const mockRemove = vi.fn().mockResolvedValue(undefined);
      const mockFind = vi.fn().mockReturnValue({ remove: mockRemove });

      db.collections = {
        projects: { find: vi.fn().mockReturnValue({ remove: vi.fn() }) },
        users: { find: vi.fn().mockReturnValue({ remove: vi.fn() }) },
        scenes: { find: mockFind },
        shootings: { find: mockFind },
        crew: { find: mockFind },
      };

      await databaseManager.hardResync();

      // Only scenes, shootings, crew should be cleared (3 non-protected collections)
      expect(mockFind).toHaveBeenCalledTimes(3);
      expect(mockRemove).toHaveBeenCalledTimes(3);
    });
  });

  describe('hardAppReset', () => {
    it('should remove database, clear localStorage and reset state', async () => {
      await databaseManager.initializeDatabase();
      const db = databaseManager.getDatabase();

      // Mock localStorage and window.location since we're not in a browser env
      const mockClear = vi.fn();
      const mockReload = vi.fn();
      
      (globalThis as any).localStorage = { clear: mockClear };
      (globalThis as any).window = { location: { reload: mockReload } };

      await databaseManager.hardAppReset();

      expect(db.remove).toHaveBeenCalled();
      expect(mockClear).toHaveBeenCalled();
      expect(databaseManager.getDatabase()).toBeNull();
      expect(databaseManager.isReady()).toBe(false);
    });
  });
});
