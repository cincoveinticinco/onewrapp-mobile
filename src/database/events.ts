/**
 * Sistema de eventos tipado para comunicación entre database y UI
 */

import { DatabaseEventType, DatabaseEventCallback, DatabaseEventMap } from './types';

export class DatabaseEvents {
  private listeners: Map<DatabaseEventType, Set<DatabaseEventCallback<any>>> = new Map();

  /**
   * Suscribirse a un evento
   */
  on<T extends DatabaseEventType>(event: T, callback: DatabaseEventCallback<T>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    
    this.listeners.get(event)!.add(callback);

    // Retornar función de cleanup
    return () => this.off(event, callback);
  }

  /**
   * Desuscribirse de un evento
   */
  off<T extends DatabaseEventType>(event: T, callback: DatabaseEventCallback<T>): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.delete(callback);
    }
  }

  /**
   * Emitir un evento
   */
  emit<T extends DatabaseEventType>(event: T, data: DatabaseEventMap[T]): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Limpiar todos los listeners
   */
  removeAllListeners(event?: DatabaseEventType): void {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }

  /**
   * Suscribirse a un evento solo una vez
   */
  once<T extends DatabaseEventType>(event: T, callback: DatabaseEventCallback<T>): void {
    const onceWrapper: DatabaseEventCallback<T> = (data) => {
      callback(data);
      this.off(event, onceWrapper);
    };
    
    this.on(event, onceWrapper);
  }
}

// Singleton
export const dbEvents = new DatabaseEvents();
