import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { DeletedRecordsHandler } from '../managers/DeletedRecordsHandler';

// Mock environment
vi.mock('../../../environment', () => ({
  default: {
    URL_PATH: 'https://api.test.com',
  },
}));

describe('DeletedRecordsHandler', () => {
  let handler: DeletedRecordsHandler;
  let mockDb: any;
  let mockGetToken: () => Promise<string>;

  const createMockDb = (findResults: any[] = [], collectionName = 'scenes') => {
    const mockRemove = vi.fn().mockResolvedValue(undefined);
    const mockExec = vi.fn();
    const mockLimit = vi.fn().mockReturnValue({ exec: mockExec });
    const mockSort = vi.fn().mockReturnValue({ limit: mockLimit });
    const mockFind = vi.fn().mockReturnValue({ sort: mockSort });

    const mockWaitForLeadership = vi.fn().mockResolvedValue(undefined);

    return {
      [collectionName]: {
        find: mockFind,
        database: {
          waitForLeadership: mockWaitForLeadership,
        },
      },
      // Expose internals for assertions
      _mocks: { mockFind, mockSort, mockLimit, mockExec, mockRemove, mockWaitForLeadership },
    };
  };

  beforeEach(() => {
    mockGetToken = vi.fn<[], Promise<string>>().mockResolvedValue('test-token-123');
    mockDb = createMockDb();
    handler = new DeletedRecordsHandler(mockDb, mockGetToken);
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('handleDeletedRecords', () => {
    it('should fetch deleted records from the API with correct params', async () => {
      // Setup: DB returns a last updated item
      mockDb._mocks.mockExec
        .mockResolvedValueOnce([{ updatedAt: '2025-01-15T10:00:00.000Z' }]) // sort query
        .mockResolvedValueOnce([]); // No matching local items to delete

      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true,
        json: async () => ({ scenes: [] }),
      } as Response);

      await handler.handleDeletedRecords('scenes', 'get_deleted_scenes', '42');

      expect(fetchSpy).toHaveBeenCalledOnce();
      const calledUrl = fetchSpy.mock.calls[0][0] as string;
      expect(calledUrl).toContain('https://api.test.com/get_deleted_scenes');
      expect(calledUrl).toContain('project_id=42');
      expect(calledUrl).toContain('last_item_updated_at=');

      const options = fetchSpy.mock.calls[0][1] as RequestInit;
      expect(options.headers).toEqual(
        expect.objectContaining({
          Owsession: 'test-token-123',
          'Content-Type': 'application/json',
        })
      );

      fetchSpy.mockRestore();
    });

    it('should use epoch date when no items exist in collection', async () => {
      mockDb._mocks.mockExec.mockResolvedValueOnce([]); // No items in DB

      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true,
        json: async () => ({ scenes: [] }),
      } as Response);

      await handler.handleDeletedRecords('scenes', 'get_deleted_scenes', '42');

      const calledUrl = fetchSpy.mock.calls[0][0] as string;
      expect(calledUrl).toContain('last_item_updated_at=1970-01-01T00%3A00%3A00.000Z');

      fetchSpy.mockRestore();
    });

    it('should delete local items that match deleted records by id AND createdAt', async () => {
      const mockRemove = vi.fn().mockResolvedValue(undefined);
      const localItem = { remove: mockRemove };

      // First call: get last updated (sort query)
      // Second call: find matching items for deletion
      const mockExec = vi.fn()
        .mockResolvedValueOnce([{ updatedAt: '2025-01-15T10:00:00.000Z' }])
        .mockResolvedValueOnce([localItem]);

      mockDb.scenes.find = vi.fn().mockReturnValue({
        sort: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            exec: mockExec,
          }),
        }),
        exec: mockExec,
      });

      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true,
        json: async () => ({
          scenes: [{ id: 'scene-1', createdAt: '2025-01-10T00:00:00.000Z' }],
        }),
      } as Response);

      await handler.handleDeletedRecords('scenes', 'get_deleted_scenes', '42');

      // Verify it searched for the item with both id and createdAtBack
      const findCalls = mockDb.scenes.find.mock.calls;
      const deletionQuery = findCalls.find(
        (call: any[]) => call[0]?.selector?.id === 'scene-1'
      );
      expect(deletionQuery).toBeTruthy();
      expect(deletionQuery[0].selector.createdAtBack).toBe('2025-01-10T00:00:00.000Z');

      expect(mockRemove).toHaveBeenCalledOnce();

      fetchSpy.mockRestore();
    });

    it('should return true when no deleted records are returned', async () => {
      mockDb._mocks.mockExec.mockResolvedValueOnce([]);

      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true,
        json: async () => ({ scenes: [] }),
      } as Response);

      const result = await handler.handleDeletedRecords('scenes', 'get_deleted_scenes', '42');
      expect(result).toBe(true);

      fetchSpy.mockRestore();
    });

    it('should return true when API returns null/undefined for collection', async () => {
      mockDb._mocks.mockExec.mockResolvedValueOnce([]);

      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true,
        json: async () => ({}),
      } as Response);

      const result = await handler.handleDeletedRecords('scenes', 'get_deleted_scenes', '42');
      expect(result).toBe(true);

      fetchSpy.mockRestore();
    });

    it('should throw when API returns non-ok response', async () => {
      mockDb._mocks.mockExec.mockResolvedValueOnce([]);

      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: false,
        status: 500,
      } as Response);

      await expect(
        handler.handleDeletedRecords('scenes', 'get_deleted_scenes', '42')
      ).rejects.toThrow('HTTP error! status: 500');

      fetchSpy.mockRestore();
    });

    it('should throw when fetch fails entirely', async () => {
      mockDb._mocks.mockExec.mockResolvedValueOnce([]);

      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockRejectedValue(
        new Error('Network error')
      );

      await expect(
        handler.handleDeletedRecords('scenes', 'get_deleted_scenes', '42')
      ).rejects.toThrow('Network error');

      fetchSpy.mockRestore();
    });

    it('should handle multiple deleted records', async () => {
      const mockRemove1 = vi.fn().mockResolvedValue(undefined);
      const mockRemove2 = vi.fn().mockResolvedValue(undefined);

      let execCallCount = 0;
      const mockExec = vi.fn().mockImplementation(() => {
        execCallCount++;
        if (execCallCount === 1) return Promise.resolve([{ updatedAt: '2025-01-15T10:00:00.000Z' }]);
        if (execCallCount === 2) return Promise.resolve([{ remove: mockRemove1 }]);
        if (execCallCount === 3) return Promise.resolve([{ remove: mockRemove2 }]);
        return Promise.resolve([]);
      });

      mockDb.scenes.find = vi.fn().mockReturnValue({
        sort: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({ exec: mockExec }),
        }),
        exec: mockExec,
      });

      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true,
        json: async () => ({
          scenes: [
            { id: 'scene-1', createdAt: '2025-01-10T00:00:00.000Z' },
            { id: 'scene-2', createdAt: '2025-01-11T00:00:00.000Z' },
          ],
        }),
      } as Response);

      const result = await handler.handleDeletedRecords('scenes', 'get_deleted_scenes', '42');
      expect(result).toBe(true);
      expect(mockRemove1).toHaveBeenCalled();
      expect(mockRemove2).toHaveBeenCalled();

      fetchSpy.mockRestore();
    });

    it('should skip null deleted items gracefully', async () => {
      mockDb._mocks.mockExec.mockResolvedValueOnce([{ updatedAt: '2025-01-15T10:00:00.000Z' }]);

      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true,
        json: async () => ({
          scenes: [null, undefined, { id: 'scene-1', createdAt: '2025-01-10T00:00:00.000Z' }],
        }),
      } as Response);

      // For the valid item, return no local matches
      mockDb.scenes.find = vi.fn().mockReturnValue({
        sort: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            exec: vi.fn().mockResolvedValue([{ updatedAt: '2025-01-15T10:00:00.000Z' }]),
          }),
        }),
        exec: vi.fn().mockResolvedValue([]),
      });

      const result = await handler.handleDeletedRecords('scenes', 'get_deleted_scenes', '42');
      expect(result).toBe(true);

      fetchSpy.mockRestore();
    });
  });
});
