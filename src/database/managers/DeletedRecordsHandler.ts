/**
 * DeletedRecordsHandler - Maneja la lógica de eliminación de registros
 * basándose en la tabla de auditoría del backend
 */

import environment from '../../../environment';
import { DatabaseInstance } from '../types';

export class DeletedRecordsHandler {
  constructor(
    private dbInstance: DatabaseInstance,
    private getToken: () => Promise<string>
  ) {}

  /**
   * Maneja registros eliminados para una colección específica
   * 
   * Nota sobre la lógica:
   * El problema es que si un shooting se borra y se vuelve a crear el mismo día,
   * la tabla de auditoría seguirá retornando el ID del registro borrado durante 3 días.
   * 
   * Solución: Usar createdAtBack para verificar que coincidan tanto el ID como la fecha
   * de creación en backend, evitando borrar registros que fueron recreados.
   */
  public async handleDeletedRecords(
    collectionName: string,
    apiEndpoint: string,
    projectId: string
  ): Promise<boolean> {
    try {
      // Obtener el último registro actualizado
      const lastData = await this.dbInstance[collectionName]
        .find({
          selector: {
            projectId: parseInt(projectId, 10),
          },
        })
        .sort({
          updatedAt: 'desc',
        })
        .limit(1)
        .exec();

      const last_updated_at = lastData[0]?.updatedAt
        ? new Date(lastData[0]?.updatedAt).toISOString()
        : '1970-01-01T00:00:00.000Z';

      // Configurar los parámetros de la URL
      const params = new URLSearchParams({
        project_id: projectId.toString(),
        last_item_updated_at: last_updated_at,
      });

      const url = `${environment.URL_PATH}/${apiEndpoint}?${params.toString()}`;

      // Llamada a la API
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Owsession: `${await this.getToken()}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Si hay registros eliminados, procesarlos
      if (data[collectionName] && data[collectionName]?.length > 0) {
        const deletedItems = data[collectionName];

        // Procesar las eliminaciones usando una transacción de RxDB
        await this.dbInstance[collectionName].database.waitForLeadership();

        for (const deletedItem of deletedItems) {
          if (deletedItem) {
            const query = this.dbInstance[collectionName].find({
              selector: {
                id: deletedItem.id,
                createdAtBack: deletedItem.createdAt,
              },
            });

            const localItems = await query.exec();
            if (localItems?.length > 0) {
              await Promise.all(
                localItems.map(async (item: any) => {
                  await item.remove();
                })
              );
            }
          }
        }
      }

      return true;
    } catch (error) {
      console.error(`Error in handling deleted records for ${collectionName}:`, error);
      throw error;
    }
  }
}
