import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DatabaseEvents } from '../events';
import type { DatabaseEventMap } from '../types';

describe('DatabaseEvents', () => {
  let events: DatabaseEvents;

  beforeEach(() => {
    events = new DatabaseEvents();
  });

  describe('on / emit', () => {
    it('should call the listener when event is emitted', () => {
      const callback = vi.fn();
      events.on('database:ready', callback);

      const fakeDb = { collections: {} };
      events.emit('database:ready', fakeDb);

      expect(callback).toHaveBeenCalledOnce();
      expect(callback).toHaveBeenCalledWith(fakeDb);
    });

    it('should support multiple listeners for the same event', () => {
      const cb1 = vi.fn();
      const cb2 = vi.fn();
      events.on('database:ready', cb1);
      events.on('database:ready', cb2);

      events.emit('database:ready', {} as any);

      expect(cb1).toHaveBeenCalledOnce();
      expect(cb2).toHaveBeenCalledOnce();
    });

    it('should not call listeners for other events', () => {
      const readyCb = vi.fn();
      const errorCb = vi.fn();
      events.on('database:ready', readyCb);
      events.on('database:error', errorCb);

      events.emit('database:ready', {} as any);

      expect(readyCb).toHaveBeenCalledOnce();
      expect(errorCb).not.toHaveBeenCalled();
    });

    it('should pass correct typed data for replication:progress', () => {
      const callback = vi.fn();
      events.on('replication:progress', callback);

      const progress: DatabaseEventMap['replication:progress'] = {
        percentage: 50,
        status: 'Replicating scenes...',
        currentStep: 'scenes',
      };
      events.emit('replication:progress', progress);

      expect(callback).toHaveBeenCalledWith(progress);
    });

    it('should not throw when emitting an event with no listeners', () => {
      expect(() => {
        events.emit('database:ready', {} as any);
      }).not.toThrow();
    });
  });

  describe('on (cleanup function)', () => {
    it('should return an unsubscribe function', () => {
      const callback = vi.fn();
      const unsubscribe = events.on('database:ready', callback);

      expect(typeof unsubscribe).toBe('function');
    });

    it('should remove listener when unsubscribe is called', () => {
      const callback = vi.fn();
      const unsubscribe = events.on('database:ready', callback);

      unsubscribe();
      events.emit('database:ready', {} as any);

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('off', () => {
    it('should remove a specific listener', () => {
      const cb1 = vi.fn();
      const cb2 = vi.fn();
      events.on('database:ready', cb1);
      events.on('database:ready', cb2);

      events.off('database:ready', cb1);
      events.emit('database:ready', {} as any);

      expect(cb1).not.toHaveBeenCalled();
      expect(cb2).toHaveBeenCalledOnce();
    });

    it('should not throw when removing a non-existent listener', () => {
      const callback = vi.fn();
      expect(() => {
        events.off('database:ready', callback);
      }).not.toThrow();
    });
  });

  describe('once', () => {
    it('should call the listener only once', () => {
      const callback = vi.fn();
      events.once('database:ready', callback);

      events.emit('database:ready', {} as any);
      events.emit('database:ready', {} as any);
      events.emit('database:ready', {} as any);

      expect(callback).toHaveBeenCalledOnce();
    });

    it('should pass correct data to the once listener', () => {
      const callback = vi.fn();
      events.once('replication:complete', callback);

      const data = { projectId: 42 };
      events.emit('replication:complete', data);

      expect(callback).toHaveBeenCalledWith(data);
    });
  });

  describe('removeAllListeners', () => {
    it('should remove all listeners for a specific event', () => {
      const cb1 = vi.fn();
      const cb2 = vi.fn();
      const errorCb = vi.fn();
      events.on('database:ready', cb1);
      events.on('database:ready', cb2);
      events.on('database:error', errorCb);

      events.removeAllListeners('database:ready');

      events.emit('database:ready', {} as any);
      events.emit('database:error', new Error('test'));

      expect(cb1).not.toHaveBeenCalled();
      expect(cb2).not.toHaveBeenCalled();
      expect(errorCb).toHaveBeenCalledOnce();
    });

    it('should remove ALL listeners when called without arguments', () => {
      const readyCb = vi.fn();
      const errorCb = vi.fn();
      const progressCb = vi.fn();
      events.on('database:ready', readyCb);
      events.on('database:error', errorCb);
      events.on('replication:progress', progressCb);

      events.removeAllListeners();

      events.emit('database:ready', {} as any);
      events.emit('database:error', new Error('test'));
      events.emit('replication:progress', { percentage: 50, status: 'test' });

      expect(readyCb).not.toHaveBeenCalled();
      expect(errorCb).not.toHaveBeenCalled();
      expect(progressCb).not.toHaveBeenCalled();
    });
  });

  describe('error handling in listeners', () => {
    it('should catch errors in listeners and continue with other listeners', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const failingCb = vi.fn(() => {
        throw new Error('Listener error');
      });
      const successCb = vi.fn();

      events.on('database:ready', failingCb);
      events.on('database:ready', successCb);

      events.emit('database:ready', {} as any);

      expect(failingCb).toHaveBeenCalledOnce();
      expect(successCb).toHaveBeenCalledOnce();
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error in event listener'),
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });
});
