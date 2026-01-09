/**
 * Database Module - API pública
 * 
 * Punto de entrada único para toda la funcionalidad de base de datos.
 * Consumible desde cualquier parte de la aplicación sin depender de React.
 * 
 * @example
 * ```typescript
 * import { db, dbEvents, replicationManager } from '@/database';
 * 
 * // Inicializar DB
 * await db.initialize(isOnline, getToken);
 * 
 * // Escuchar eventos
 * dbEvents.on('database:ready', (database) => {
 *   console.log('Database ready!');
 * });
 * 
 * // Ejecutar replicación
 * await replicationManager.initialProjectReplication();
 * ```
 */

import { databaseManager } from './managers/DatabaseManager';
import { replicationManager } from './managers/ReplicationManager';

export { databaseManager } from './managers/DatabaseManager';
export { replicationManager } from './managers/ReplicationManager';
export { dbEvents } from './events';
export { DeletedRecordsHandler } from './managers/DeletedRecordsHandler';

// Re-exportar tipos para facilitar uso
export * from './types';

// Aliases para API más limpia
export const db = databaseManager;
export const replication = replicationManager;
