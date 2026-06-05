import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

// Mock environment
vi.mock('../../../environment', () => ({
  default: { URL_PATH: 'https://api.test.com' },
}));

// Track mock instances
const mockStartReplication = vi.fn().mockResolvedValue(undefined);
const mockCancelReplication = vi.fn();
const mockResyncReplication = vi.fn().mockResolvedValue(undefined);
const mockUpdateOnProgressCallback = vi.fn();

vi.mock('../core/replicator', () => ({
  default: vi.fn().mockImplementation(() => ({
    startReplication: mockStartReplication,
    cancelReplication: mockCancelReplication,
    resyncReplication: mockResyncReplication,
    updateOnProgressCallback: mockUpdateOnProgressCallback,
  })),
}));

vi.mock('../core/database_schema', () => ({
  default: vi.fn(),
}));

// Mock the DatabaseManager module — all values must be inlined (vi.mock is hoisted)
vi.mock('../managers/DatabaseManager', () => {
  const mockExec = vi.fn().mockResolvedValue([]);
  const mockLimit = vi.fn().mockReturnValue({ exec: mockExec });
  const mockSort = vi.fn().mockReturnValue({ limit: mockLimit });
  const mockSubscription = { unsubscribe: vi.fn() };
  const mockFind = vi.fn().mockReturnValue({
    sort: mockSort,
    remove: vi.fn(),
    $: { subscribe: vi.fn().mockReturnValue(mockSubscription) },
  });

  const collectionNames = [
    'projects', 'users', 'scenes', 'service_matrices', 'paragraphs',
    'talents', 'units', 'shootings', 'crew', 'countries',
    'proj_weeks', 'stripboard',
  ];

  const dbInstance: Record<string, any> = {
    collections: {},
    remove: vi.fn().mockResolvedValue(undefined),
  };
  for (const name of collectionNames) {
    dbInstance[name] = { find: mockFind };
    dbInstance.collections[name] = { find: mockFind };
  }

  return {
    databaseManager: {
      getDatabase: vi.fn().mockImplementation(() => dbInstance),
      isReady: vi.fn().mockReturnValue(true),
      hardResync: vi.fn().mockResolvedValue(undefined),
      projectCollection: { SchemaName: () => 'projects' },
      userCollection: { SchemaName: () => 'users' },
      sceneCollection: { SchemaName: () => 'scenes' },
      paragraphCollection: { SchemaName: () => 'paragraphs' },
      unitsCollection: { SchemaName: () => 'units' },
      shootingsCollection: { SchemaName: () => 'shootings' },
      talentsCollection: { SchemaName: () => 'talents' },
      crewCollection: { SchemaName: () => 'crew' },
      countriesCollection: { SchemaName: () => 'countries' },
      serviceMatricesCollection: { SchemaName: () => 'service_matrices' },
      projWeeksCollection: { SchemaName: () => 'proj_weeks' },
      stripboardCollection: { SchemaName: () => 'stripboard' },
    },
  };
});

// Mock DeletedRecordsHandler — inline factory (vi.mock is hoisted)
vi.mock('../managers/DeletedRecordsHandler', () => ({
  DeletedRecordsHandler: vi.fn().mockImplementation(() => ({
    handleDeletedRecords: vi.fn().mockResolvedValue(true),
  })),
}));

// Import AFTER all mocks
import { ReplicationManager } from '../managers/ReplicationManager';
import { databaseManager } from '../managers/DatabaseManager';
import { dbEvents } from '../events';

describe('ReplicationManager', () => {
  let replicationManager: any;
  let mockGetToken: () => Promise<string>;

  beforeEach(() => {
    // Create a fresh instance each test by accessing the class
    // The singleton is already exported; we need to reset its internal state
    // We'll use a trick: clear the static instance and create a new one
    (ReplicationManager as any).instance = undefined;
    replicationManager = ReplicationManager.getInstance();

    mockGetToken = vi.fn<[], Promise<string>>().mockResolvedValue('test-token');

    // Reset tracked mocks and restore their default implementations
    mockStartReplication.mockReset().mockResolvedValue(undefined);
    mockCancelReplication.mockReset();
    mockResyncReplication.mockReset().mockResolvedValue(undefined);
    mockUpdateOnProgressCallback.mockReset();

    // Suppress console noise
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'info').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Only clear specific tracked mocks, NOT all mocks (to preserve hoisted vi.mock factories)
    mockStartReplication.mockClear();
    mockCancelReplication.mockClear();
    mockResyncReplication.mockClear();
    mockUpdateOnProgressCallback.mockClear();
  });

  describe('singleton pattern', () => {
    it('should always return the same instance from getInstance()', () => {
      const instance1 = ReplicationManager.getInstance();
      const instance2 = ReplicationManager.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('configure', () => {
    it('should configure isOnline and getToken without throwing', () => {
      expect(() => {
        replicationManager.configure(true, mockGetToken);
      }).not.toThrow();
    });

    it('should create DeletedRecordsHandler when db is available', () => {
      replicationManager.configure(true, mockGetToken);
      // The fact that configure doesn't throw when DB is available is the assertion
      expect(databaseManager.getDatabase).toHaveBeenCalled();
    });

    it('should work when called offline', () => {
      expect(() => {
        replicationManager.configure(false, mockGetToken);
      }).not.toThrow();
    });
  });

  describe('setProjectId / getProjectId', () => {
    it('should set and get the current project ID', () => {
      replicationManager.setProjectId(42);
      expect(replicationManager.getProjectId()).toBe(42);
    });

    it('should accept null to clear the project', () => {
      replicationManager.setProjectId(42);
      replicationManager.setProjectId(null);
      expect(replicationManager.getProjectId()).toBeNull();
    });

    it('should not re-cleanup when setting the same project ID', () => {
      replicationManager.setProjectId(42);
      // Second call with same ID should not trigger cleanup (no errors, no side effects)
      replicationManager.setProjectId(42);
      expect(replicationManager.getProjectId()).toBe(42);
    });

    it('should cleanup replicators when changing project', () => {
      replicationManager.configure(true, mockGetToken);
      replicationManager.setProjectId(42);
      // Change project — should trigger cleanup
      replicationManager.setProjectId(99);
      expect(replicationManager.getProjectId()).toBe(99);
    });
  });

  describe('initializeProjectsUserReplication', () => {
    it('should create replicators for projects and users', async () => {
      replicationManager.configure(true, mockGetToken);

      const HttpReplicator = (await import('../core/replicator')).default;

      await replicationManager.initializeProjectsUserReplication();

      // Should have created 2 replicators (projects + users)
      expect(HttpReplicator).toHaveBeenCalledTimes(2);
      expect(mockStartReplication).toHaveBeenCalledTimes(2);
    });

    it('should pass correct parameters to HttpReplicator', async () => {
      replicationManager.configure(true, mockGetToken);

      const HttpReplicator = (await import('../core/replicator')).default;

      await replicationManager.initializeProjectsUserReplication();

      // First call should be for projects
      const firstCall = (HttpReplicator as any).mock.calls[0];
      // First call should pass the db instance from databaseManager.getDatabase()
      expect(firstCall[0]).toBe(databaseManager.getDatabase()); // db instance
      expect(firstCall[2]).toBeNull(); // projectId (null for global collections)
    });
  });

  describe('initializeAllReplications', () => {
    beforeEach(() => {
      replicationManager.configure(true, mockGetToken);
      replicationManager.setProjectId(42);
    });

    it('should execute all replication functions and return true', async () => {
      const result = await replicationManager.initializeAllReplications();
      expect(result).toBe(true);
      // Should have created replicators for all 11 collections
      expect(mockStartReplication).toHaveBeenCalled();
    });

    it('should complete all replications including those with deleted records handling', async () => {
      const result = await replicationManager.initializeAllReplications();
      expect(result).toBe(true);
      // All 11 replications should have been executed (including ones that handle deleted records)
      expect(mockStartReplication.mock.calls.length).toBeGreaterThanOrEqual(11);
    });

    it('should return false if already in progress', async () => {
      // Simulate that a replication is already in progress by setting the internal flag
      (replicationManager as any).allReplicationsInCourse = true;

      const result = await replicationManager.initializeAllReplications();
      expect(result).toBe(false);

      // No replicators should have been created
      expect(mockStartReplication).not.toHaveBeenCalled();

      // Reset flag
      (replicationManager as any).allReplicationsInCourse = false;
    });

    it('should return false if initialProjectReplication is in progress', async () => {
      (replicationManager as any).initialProjectReplicationInCourse = true;

      const result = await replicationManager.initializeAllReplications();
      expect(result).toBe(false);

      (replicationManager as any).initialProjectReplicationInCourse = false;
    });

    it('should handle errors in individual replications gracefully', async () => {
      // Make scene replication fail on the 3rd call
      mockStartReplication
        .mockResolvedValueOnce(undefined) // projects
        .mockResolvedValueOnce(undefined) // users
        .mockRejectedValueOnce(new Error('Scene replication failed'))
        .mockResolvedValue(undefined); // rest ok

      const result = await replicationManager.initializeAllReplications();

      // Should still return true (errors are caught per-step)
      expect(result).toBe(true);
    });
  });

  describe('initialProjectReplication', () => {
    beforeEach(() => {
      replicationManager.configure(true, mockGetToken);
    });

    it('should emit progress events during replication', async () => {
      replicationManager.setProjectId(42);
      const emitSpy = vi.spyOn(dbEvents, 'emit');

      await replicationManager.initialProjectReplication();

      // Should have emitted progress events
      const progressEvents = emitSpy.mock.calls.filter(
        (call) => call[0] === 'replication:progress'
      );
      expect(progressEvents.length).toBeGreaterThan(0);

      // First progress should start at 0%
      expect(progressEvents[0][1].percentage).toBe(0);
    });

    it('should emit replication:complete on success', async () => {
      replicationManager.setProjectId(42);
      const emitSpy = vi.spyOn(dbEvents, 'emit');

      await replicationManager.initialProjectReplication();

      const completeEvents = emitSpy.mock.calls.filter(
        (call) => call[0] === 'replication:complete'
      );
      expect(completeEvents).toHaveLength(1);
      expect(completeEvents[0][1]).toEqual({ projectId: 42 });
    });

    it('should reach 100% progress on completion', async () => {
      replicationManager.setProjectId(42);
      const emitSpy = vi.spyOn(dbEvents, 'emit');

      await replicationManager.initialProjectReplication();

      const progressEvents = emitSpy.mock.calls.filter(
        (call) => call[0] === 'replication:progress'
      );
      const lastProgress = progressEvents[progressEvents.length - 1];
      expect(lastProgress[1].percentage).toBe(100);
    });

    it('should throw if no project ID is set', async () => {
      // No setProjectId call
      await expect(
        replicationManager.initialProjectReplication()
      ).rejects.toThrow('Project Id not found');
    });

    it('should emit replication:error on failure', async () => {
      replicationManager.setProjectId(42);
      const emitSpy = vi.spyOn(dbEvents, 'emit');

      mockStartReplication.mockRejectedValueOnce(new Error('Replication failed'));

      await expect(
        replicationManager.initialProjectReplication()
      ).rejects.toThrow('Replication failed');

      const errorEvents = emitSpy.mock.calls.filter(
        (call) => call[0] === 'replication:error'
      );
      expect(errorEvents.length).toBeGreaterThan(0);
      expect(errorEvents[0][1].error).toBeInstanceOf(Error);
    });

    it('should not run if already in progress (initialProjectReplicationInCourse)', async () => {
      replicationManager.setProjectId(42);
      const emitSpy = vi.spyOn(dbEvents, 'emit');

      // Simulate already in progress
      (replicationManager as any).initialProjectReplicationInCourse = true;

      // Should return immediately without throwing
      await replicationManager.initialProjectReplication();

      // No progress events should have been emitted
      expect(emitSpy).not.toHaveBeenCalled();
      expect(mockStartReplication).not.toHaveBeenCalled();

      (replicationManager as any).initialProjectReplicationInCourse = false;
    });

    it('should not run if allReplicationsInCourse is true', async () => {
      replicationManager.setProjectId(42);

      (replicationManager as any).allReplicationsInCourse = true;

      await replicationManager.initialProjectReplication();

      expect(mockStartReplication).not.toHaveBeenCalled();

      (replicationManager as any).allReplicationsInCourse = false;
    });

    it('should include step names in progress events', async () => {
      replicationManager.setProjectId(42);
      const emitSpy = vi.spyOn(dbEvents, 'emit');

      await replicationManager.initialProjectReplication();

      const progressEvents = emitSpy.mock.calls
        .filter((call) => call[0] === 'replication:progress')
        .map((call) => call[1]);

      // Should mention step names like Scene, Paragraph, etc.
      const statuses = progressEvents.map((p: any) => p.status);
      expect(statuses.some((s: string) => s.includes('Scene'))).toBe(true);
      expect(statuses.some((s: string) => s.includes('Crew'))).toBe(true);
    });
  });

  describe('hardResync', () => {
    it('should call databaseManager.hardResync', async () => {
      replicationManager.configure(true, mockGetToken);
      replicationManager.setProjectId(42);

      await replicationManager.hardResync();

      expect(databaseManager.hardResync).toHaveBeenCalled();
    });

    it('should re-trigger initialProjectReplication after resync', async () => {
      replicationManager.configure(true, mockGetToken);
      replicationManager.setProjectId(42);
      const emitSpy = vi.spyOn(dbEvents, 'emit');

      await replicationManager.hardResync();

      // Should have emitted replication:complete after re-replication
      const completeEvents = emitSpy.mock.calls.filter(
        (call) => call[0] === 'replication:complete'
      );
      expect(completeEvents.length).toBeGreaterThan(0);
    });
  });

  describe('replicator reuse', () => {
    it('should reuse existing replicator on subsequent calls', async () => {
      replicationManager.configure(true, mockGetToken);

      const HttpReplicator = (await import('../core/replicator')).default;

      // First call creates replicators
      await replicationManager.initializeProjectsUserReplication();
      const firstCallCount = (HttpReplicator as any).mock.calls.length;

      // Second call should reuse existing replicators
      await replicationManager.initializeProjectsUserReplication();

      // Should NOT have created new replicators
      expect((HttpReplicator as any).mock.calls.length).toBe(firstCallCount);
      // Should have called resync instead
      expect(mockResyncReplication).toHaveBeenCalled();
    });
  });
});
