# OO-36: Soft Delete — Prevenir Pérdida Catastrófica de Datos

**Épica:** [OO-36](https://carreraprogrammer.atlassian.net/browse/OO-36)  
**Estado:** En progreso — OO-55 y OO-57 completados

## Contexto

RxDB requiere soft delete en el backend. Cuando RxDB empuja cambios, los documentos borrados localmente llevan `_deleted: true` en el payload. Si el backend hace un hard delete, los datos se pierden permanentemente.

**Incidente real (staging):** Un componente React montó antes de que la base de datos local cargara, RxDB empujó 0 escenas con `_deleted: true`, y el backend ejecutó `destroy_all` borrando 2000 escenas. La épica OO-34 reduce la probabilidad de que esto ocurra; OO-36 es la red de seguridad.

---

## Tickets

| Ticket | Descripción | Estado |
|--------|-------------|--------|
| [OO-55](https://carreraprogrammer.atlassian.net/browse/OO-55) | Soft delete en backend (scenes, shootings, crew) | ✅ Completado |
| [OO-57](https://carreraprogrammer.atlassian.net/browse/OO-57) | Identificar registros borrados por id + createdAtBack | ✅ Completado (DeletedRecordsHandler.ts) |
| [OO-53](https://carreraprogrammer.atlassian.net/browse/OO-53) | Estandarizar schemas RxDB a `deletedField: '_deleted'` | ⏸ Diferido |

---

## OO-55 — Soft Delete en Backend ✅

**Commit:** `1095c650` en `ow-api-new-version`

### Qué se hizo

**Sync services** — cambio de hard delete a soft delete:
- `SceneSyncService`: `destroy_all` → `update_all(deleted_at: Time.current, updated_at: Time.current)`
- `ShootingSyncService`: `shooting.destroy` → `shooting.update!(deleted_at: Time.current)`
- `CrewSyncService`: `proj_crew.destroy` → `proj_crew.update!(deleted_at: Time.current)`

**Listing services** — excluir registros soft-deleted:
- `SceneListingService`: agrega `WHERE scenes.deleted_at IS NULL`
- `ShootingListingService`: agrega `WHERE shootings.deleted_at IS NULL`
- `CrewListingService`: agrega `WHERE proj_crews.deleted_at IS NULL`

**Deleted-record services** — cambiados de audit trail a consulta directa:
- `DeletedScenesService`: `Audited::Audit` → `Scene.where(deleted_at IS NOT NULL)`
- `DeletedShootingsService`: `Audited::Audit` → `Shooting.where(deleted_at IS NOT NULL)`
- `DeletedCrewService`: `Audited::Audit` → `ProjCrew.where(deleted_at IS NOT NULL)`

**Migraciones** (pendiente de ejecutar con `rails db:migrate`):
- `20260427173501_add_deleted_at_to_scenes.rb`
- `20260427173502_add_deleted_at_to_shootings.rb`
- `20260427173503_add_deleted_at_to_proj_crews.rb`

---

## OO-57 — Identificación por id + createdAtBack ✅

Ya implementado en `src/database/managers/DeletedRecordsHandler.ts`.
El handler busca registros locales con selector `{ id, createdAtBack }` antes de hacer `.remove()`.

---

## OO-53 — Estandarizar deletedField (diferido) ⏸

**Por qué se difirió:** `deletedField` solo afecta el almacenamiento local de RxDB. El protocolo de replicación siempre usa `_deleted` en el wire format independientemente del valor de `deletedField`. Por tanto, OO-55 ya soluciona el problema real sin necesidad de migrar 11 schemas.

**Si se implementa en el futuro:**
1. Agregar `_deleted: { type: 'boolean' }` a las `properties` de cada schema
2. Incrementar `version` de 0 → 1 en cada schema
3. Agregar estrategias de migración en `DatabaseManager`
4. Verificar que documentos existentes no pierdan su estado de borrado

---

## Qué falta (backend)

- Ejecutar `rails db:migrate` en staging/producción
- Verificar que los endpoints de listado no devuelvan registros soft-deleted
- Verificar que `get_deleted_scenes/shootings/crew` devuelvan registros con `deleted_at IS NOT NULL`
