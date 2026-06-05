# Product Backlog - Estabilización Aplicación Offline
**Proyecto**: OneWrap Mobile  
**Fecha**: 7 de enero de 2026  
**Objetivo**: Estabilizar la funcionalidad offline, especialmente el módulo de planes diarios, y preparar la aplicación para producción

---

## Resumen Ejecutivo

| Métrica | Valor |
|---------|-------|
| **Total Story Points** | 89 SP |
| **Sprints Estimados** | 4-5 sprints (6-7 semanas) |
| **Épicas** | 5 |
| **User Stories** | 18 |
| **Riesgo Técnico** | Alto en Épica 1 y 2 |

### Velocity Estimada
- **Velocity conservadora**: 15-18 SP/sprint (2 semanas)
- **Duración total**: 5-7 sprints considerando QA y correcciones

---

## Épica 1: Desacoplamiento de Lógica de Replicación
**Prioridad**: CRÍTICA  
**Total SP**: 21 SP  
**Riesgo**: Alto - Afecta toda la arquitectura de sincronización  
**Dependencias**: Ninguna - Debe hacerse PRIMERO

### US-001: Crear capa de servicio para replicación
**SP**: 8  
**Prioridad**: Crítica  

**Como** desarrollador  
**Quiero** extraer la lógica de replicación del contexto de React a una capa de servicio independiente  
**Para** reducir el acoplamiento, facilitar testing y evitar efectos secundarios no controlados

**Descripción Técnica**:
- Actualmente hay 800 líneas en `Database.context.tsx` mezclando lógica de UI y sincronización
- 11 referencias globales (`resyncScenes.current`, `resyncShootings.current`, etc.)
- Replicación acoplada a ciclo de vida de React (useEffect)

**Criterios de Aceptación**:
- [ ] Crear clase/servicio `ReplicationService` independiente de React
- [ ] Mover todas las funciones `initialize*Replication()` al servicio
- [ ] Eliminar las 11 referencias `useRef` para replicadores del contexto
- [ ] El servicio debe ser singleton y manejable desde cualquier parte de la app
- [ ] Implementar patrón Observer/EventEmitter para comunicar estado al UI
- [ ] Database.context.tsx debe reducirse a <400 líneas
- [ ] Tests unitarios del servicio (cobertura mínima 80%)

**Notas Técnicas**:
```typescript
// Estructura propuesta
class ReplicationService {
  private replicators: Map<string, HttpReplicator>
  private database: RxDatabase
  
  async initializeReplication(collectionName: string, config: ReplicationConfig)
  async stopReplication(collectionName: string)
  async stopAllReplications()
  getReplicationStatus(collectionName: string): ReplicationStatus
}
```

**Definición de Done**:
- Código en repositorio con PR aprobado
- Tests pasando (unit + integration)
- Documentación de arquitectura actualizada
- Code review completado
- No hay regresiones en funcionalidad existente

---

### US-002: Implementar estado de máquina finita para sincronización
**SP**: 5  
**Prioridad**: Alta  
**Dependencias**: US-001

**Como** desarrollador  
**Quiero** implementar una máquina de estados para controlar el flujo de replicación  
**Para** prevenir race conditions y tener control explícito del estado de sincronización

**Descripción Técnica**:
- Problema actual: `initializeAllReplications()` puede ejecutarse mientras otra está en curso
- No hay prevención clara de estados inválidos
- Difícil debuggear problemas de sincronización

**Criterios de Aceptación**:
- [ ] Implementar estados: `IDLE`, `SYNCING`, `PAUSED`, `ERROR`, `SUCCESS`
- [ ] Solo permitir transiciones válidas (ej: IDLE → SYNCING, no SYNCING → SYNCING)
- [ ] Emitir eventos en cada cambio de estado
- [ ] Logging detallado de transiciones
- [ ] UI debe reflejar estado actual claramente
- [ ] Prevenir inicio de nueva replicación si estado !== IDLE

**Estados y Transiciones**:
```
IDLE → SYNCING (start replication)
SYNCING → SUCCESS (all replications complete)
SYNCING → ERROR (any replication fails)
SYNCING → PAUSED (user pause or no network)
ERROR → IDLE (after retry/reset)
PAUSED → SYNCING (network restored/user resume)
```

**Definición de Done**:
- Implementación de FSM (preferiblemente con librería como XState o implementación custom)
- Tests de todas las transiciones
- No se puede iniciar replicación duplicada
- Logs verificables en consola

---

### US-003: Implementar debouncing en intervalo de replicación periódica
**SP**: 3  
**Prioridad**: Alta  
**Dependencias**: US-001, US-002

**Como** desarrollador  
**Quiero** prevenir que replicaciones periódicas se acumulen si una toma más de 30 segundos  
**Para** evitar memory leaks, race conditions y duplicación de datos

**Descripción Técnica**:
```typescript
// Problema actual (línea 488)
const intervalId = setInterval(() => {
  replicatePeriodically(); // Sin verificar si la anterior terminó
}, 30000);
```

**Criterios de Aceptación**:
- [ ] Verificar estado antes de iniciar nueva replicación periódica
- [ ] Si replicación anterior aún corre, skip el ciclo actual
- [ ] Implementar timeout máximo (ej: 2 minutos)
- [ ] Logging cuando se skippea un ciclo
- [ ] Métrica de tiempo promedio de replicación
- [ ] En caso de timeout, cancelar y notificar error

**Definición de Done**:
- Replicaciones no se acumulan
- Test que simule replicación lenta (>30s)
- Memory profiling sin leaks después de 100 ciclos
- Logs verificables

---

### US-004: Refactorizar cleanup de replicadores al cambiar proyecto
**SP**: 5  
**Prioridad**: Alta  
**Dependencias**: US-001

**Como** desarrollador  
**Quiero** asegurar cleanup correcto de replicadores al cambiar de proyecto  
**Para** prevenir memory leaks y sincronización de datos incorrectos

**Descripción Técnica**:
- Problema: `cleanupReplicators()` tiene timeouts arbitrarios (100ms)
- No hay garantía de que cancelación complete antes de iniciar nueva replicación

**Criterios de Aceptación**:
- [ ] Reemplazar timeouts por promesas que resuelvan cuando replicación cancele
- [ ] Verificar que RXDB `replicationState.canceled$` emita correctamente
- [ ] Implementar patrón "dispose" explícito
- [ ] Tests que verifiquen no hay replicadores huérfanos
- [ ] Agregar finalizer/cleanup automático si componente desmonta
- [ ] Logging de cada replicador cancelado con timestamp

**Definición de Done**:
- Test de cambio de proyecto 10 veces consecutivas sin leaks
- Memory profiling antes/después
- Replicaciones viejas canceladas confirmadamente
- Code review aprobado

---

## Épica 2: Implementación de Borrado Lógico Universal
**Prioridad**: CRÍTICA  
**Total SP**: 21 SP  
**Riesgo**: Alto - Requiere cambios en backend y frontend  
**Dependencias**: Épica 1 (idealmente)

### US-005: Implementar `_deleted` en todas las colecciones locales
**SP**: 8  
**Prioridad**: Crítica  

**Como** desarrollador  
**Quiero** agregar el campo `_deleted: boolean` a todos los schemas de RXDB  
**Para** alinearnos con las mejores prácticas de RXDB y prevenir borrados físicos

**Descripción Técnica**:
- Actualmente solo `service_matrices` tiene `_deleted`
- Necesario en: scenes, shootings, talents, crew, units, paragraphs, etc.

**Criterios de Aceptación**:
- [ ] Agregar campo `_deleted: { type: 'boolean' }` a todos los schemas
- [ ] Incrementar versión de schemas (migración de datos)
- [ ] Agregar `deletedField: '_deleted'` en config de replicación
- [ ] Implementar migration strategy para agregar `_deleted: false` a docs existentes
- [ ] Actualizar queries para filtrar `_deleted !== true` por default
- [ ] Helper function para "soft delete": `doc.update({ _deleted: true })`
- [ ] Tests de migración con datos existentes

**Schemas a Actualizar**:
- ✅ service_matrices (ya implementado)
- scenes.schema.ts
- shootings.schema.ts
- talents.schema.ts
- crew.schema.ts
- units.schema.ts
- paragraphs.schema.ts
- projWeeks.schema.ts
- stripboard.schema.ts

**Definición de Done**:
- Todos los schemas actualizados
- Migración exitosa en ambiente de desarrollo
- Tests de regresión pasando
- Documentación de migración

---

### US-006: Implementar paranoia en backend con gema Paranoia
**SP**: 5  
**Prioridad**: Crítica  
**Dependencias**: US-005

**Como** desarrollador backend  
**Quiero** usar la gema Paranoia en Rails para implementar soft deletes  
**Para** mantener coherencia entre frontend y backend

**Criterios de Aceptación**:
- [ ] Instalar y configurar gema `paranoia`
- [ ] Agregar columna `deleted_at` a tablas relevantes
- [ ] Actualizar modelos con `acts_as_paranoid`
- [ ] Modificar endpoints de eliminación para usar `destroy` (soft delete)
- [ ] Crear scope `with_deleted` para queries de auditoría
- [ ] Actualizar endpoints de sincronización para incluir `deleted_at`
- [ ] Tests de integración backend

**Modelos a Actualizar**:
- Scene
- Shooting
- Talent
- Crew
- Unit
- Paragraph
- ProjWeek
- Stripboard
- ServiceMatrix (verificar implementación actual)

**Definición de Done**:
- Gema instalada y configurada
- Migraciones ejecutadas
- Tests de soft delete en cada modelo
- Endpoints actualizados y documentados

---

### US-007: Solucionar problema de re-creación con mismo ID
**SP**: 8  
**Prioridad**: Crítica  
**Dependencias**: US-005, US-006

**Como** usuario  
**Quiero** poder eliminar y recrear un shooting en el mismo día sin que se borre automáticamente  
**Para** tener flexibilidad en la planificación sin perder datos

**Descripción del Problema**:
```
1. Usuario crea shooting: 2024-10-21_63
2. Usuario lo elimina (va a tabla de auditoría)
3. Usuario lo vuelve a crear con mismo ID
4. Sincronización trae lista de eliminados: [2024-10-21_63]
5. App local elimina el nuevo shooting (BUG)
```

**Solución Propuesta**:
- Usar `createdAtBack` como segundo criterio de identificación
- Solo eliminar si coinciden `id` Y `createdAtBack`

**Criterios de Aceptación**:
- [ ] Agregar campo `createdAtBack` a todos los schemas (timestamp del backend)
- [ ] Backend: incluir `created_at` en respuesta de `get_deleted_*` endpoints
- [ ] Frontend: actualizar `handleDeletedRecords()` para validar ambos campos
- [ ] Crear índice compuesto en RXDB: `['id', 'createdAtBack']`
- [ ] Test automatizado del escenario descrito
- [ ] Verificar que RXDB no sobrescriba `createdAtBack`

**Test de Aceptación**:
```typescript
// Test automático
1. Crear shooting con id X en día Y
2. Sincronizar (debe subir al backend)
3. Eliminar shooting desde web
4. Sincronizar (debe eliminarse en local)
5. Crear nuevo shooting con mismo id X en día Y
6. Sincronizar (NO debe eliminarse)
7. Verificar que shooting existe y es el nuevo
```

**Definición de Done**:
- Test automático pasando
- Prueba manual exitosa
- Documentación del fix
- Backend devuelve `created_at` en deleted records
- Code review aprobado

---

## Épica 3: Auditoría y Estabilización de Planes Diarios (Shootings)
**Prioridad**: ALTA  
**Total SP**: 26 SP  
**Riesgo**: Alto - Módulo más complejo con más anidamiento  
**Dependencias**: Épica 1, Épica 2

### US-008: Auditar sincronización de shootings y detectar duplicados
**SP**: 5  
**Prioridad**: Alta  

**Como** desarrollador  
**Quiero** identificar todos los puntos donde se pueden generar duplicados en shootings  
**Para** crear un plan de corrección específico

**Criterios de Aceptación**:
- [ ] Análisis completo del flujo pull/push de shootings
- [ ] Identificar queries que puedan retornar duplicados
- [ ] Revisar lógica de merge en `handleDeletedRecords()`
- [ ] Documentar escenarios de conflicto
- [ ] Crear suite de tests que reproduzcan cada escenario
- [ ] Proponer índices únicos en RXDB para prevenir duplicados
- [ ] Documento técnico con hallazgos y plan de acción

**Áreas a Auditar**:
- Creación de shooting offline → sync online
- Modificación de shooting en web → sync mobile
- Eliminación desde web → propagación a mobile
- Conflict resolution en push
- Lógica de locaciones anidadas
- Llamados (castCalls, extraCalls, crewCalls, etc.)
- Comidas (meals)

**Definición de Done**:
- Documento técnico de auditoría (min 5 páginas)
- Suite de tests de escenarios de conflicto
- Lista priorizada de bugs encontrados
- Estimación de correcciones

---

### US-009: Corregir sincronización de locaciones en shootings
**SP**: 8  
**Prioridad**: Alta  
**Dependencias**: US-008

**Como** usuario  
**Quiero** que las locaciones de mis shootings se sincronicen correctamente  
**Para** evitar pérdida de datos y duplicados

**Criterios de Aceptación**:
- [ ] Identificar estructura actual de locaciones en shooting schema
- [ ] Validar que IDs de locaciones sean consistentes entre backend/frontend
- [ ] Implementar validación de integridad en pull
- [ ] Agregar logging detallado en sincronización de locaciones
- [ ] Tests de sincronización bidireccional
- [ ] Manejo de conflictos cuando locación cambia offline y online
- [ ] Verificar que no se dupliquen locaciones en array

**Definición de Done**:
- Tests de sincronización pasando
- Pruebas manuales con casos edge
- No se generan duplicados en 10 sync consecutivos
- Logging verificable

---

### US-010: Corregir sincronización de llamados (calls)
**SP**: 8  
**Prioridad**: Alta  
**Dependencias**: US-008

**Como** usuario  
**Quiero** que los llamados (cast, crew, extras, etc.) se sincronicen sin duplicarse  
**Para** mantener la integridad del call sheet

**Descripción Técnica**:
- El schema de shootings tiene arrays anidados: castCalls, crewCalls, extraCalls, otherCalls, pictureCars
- Cada tipo tiene su propia estructura y reglas

**Criterios de Aceptación**:
- [ ] Auditar lógica de merge de cada tipo de call
- [ ] Implementar validación de unicidad por ID en arrays
- [ ] Agregar índices para queries rápidas de calls
- [ ] Tests de creación/edición/eliminación de cada tipo
- [ ] Manejo de conflictos en edición simultánea
- [ ] Verificar que position se mantenga correctamente
- [ ] Performance: queries de calls optimizadas

**Tipos de Calls**:
```typescript
- CastCalls (Character + Talent + Times)
- CrewCalls (CrewMember + Times)
- ExtraCalls (Description + Quantity)
- OtherCalls (Description + Notes)
- PictureCars (Vehicle info)
```

**Definición de Done**:
- Test por cada tipo de call
- Pruebas de concurrencia
- Performance <100ms para queries
- Code review aprobado

---

### US-011: Implementar validación de integridad en shootings
**SP**: 5  
**Prioridad**: Media  
**Dependencias**: US-008, US-009, US-010

**Como** desarrollador  
**Quiero** validar integridad de datos en shootings antes de sync  
**Para** prevenir datos corruptos en el servidor

**Criterios de Aceptación**:
- [ ] Validar que todos los IDs referenciados existan (sceneId, unitId, etc.)
- [ ] Validar rangos de fechas/horarios (generalCall < firstShoot < wrap)
- [ ] Validar estructura de arrays anidados
- [ ] Implementar schema validation con zod o joi
- [ ] Rechazar sync si validación falla
- [ ] Logging de errores de validación
- [ ] UI muestra errores de validación al usuario

**Definición de Done**:
- Schema de validación implementado
- Tests de casos inválidos
- Usuario recibe feedback claro
- Logs de validación

---

## Épica 4: Finalización de Edición y Corrección de Errores en UI
**Prioridad**: MEDIA  
**Total SP**: 13 SP  
**Riesgo**: Medio  
**Dependencias**: Épica 3

### US-012: Completar edición en tabla general de shootings
**SP**: 5  
**Prioridad**: Media  

**Como** usuario  
**Quiero** poder editar shootings directamente desde la tabla general  
**Para** agilizar la gestión de planes diarios

**Criterios de Aceptación**:
- [ ] Identificar campos editables en la tabla
- [ ] Implementar edición inline o modal
- [ ] Validación en tiempo real
- [ ] Guardar cambios localmente (offline-first)
- [ ] Sincronizar cambios cuando haya conexión
- [ ] Feedback visual de estado de sync
- [ ] Tests de edición offline → online

**Definición de Done**:
- Funcionalidad completa y probada
- UX aprobada
- Tests E2E
- Documentación de usuario

---

### US-013: Corregir errores en tarjetas de llamados
**SP**: 5  
**Prioridad**: Media  

**Como** usuario  
**Quiero** que las tarjetas de llamados muestren información correcta y actualizada  
**Para** tomar decisiones basadas en datos precisos

**Criterios de Aceptación**:
- [ ] Lista específica de errores reportados (solicitar a QA/usuarios)
- [ ] Reproducir cada error en ambiente de desarrollo
- [ ] Corregir errores identificados
- [ ] Tests de regresión
- [ ] Verificar cálculos de tiempos
- [ ] Verificar actualización en tiempo real

**Definición de Done**:
- Todos los errores listados corregidos
- Tests de regresión pasando
- Validación con usuario final
- No hay regresiones

---

### US-014: Implementar manejo de errores y mensajes de usuario
**SP**: 3  
**Prioridad**: Media  

**Como** usuario  
**Quiero** recibir mensajes claros cuando algo falla  
**Para** entender qué pasó y cómo solucionarlo

**Criterios de Aceptación**:
- [ ] Catálogo de mensajes de error user-friendly
- [ ] Toast notifications para errores comunes
- [ ] Modal con detalles para errores críticos
- [ ] Logging de errores para debugging
- [ ] Botón "Reportar error" con context
- [ ] Traducciones ES/EN
- [ ] Tests de cada tipo de error

**Definición de Done**:
- Sistema de mensajes implementado
- Catálogo documentado
- Tests de UX
- Aprobación de stakeholders

---

## Épica 5: Preparación para App Store y Optimización
**Prioridad**: BAJA (pero necesaria para release)  
**Total SP**: 8 SP  
**Riesgo**: Bajo  
**Dependencias**: Todas las épicas anteriores

### US-015: Preparar metadata y assets para App Store
**SP**: 3  
**Prioridad**: Baja  

**Como** product owner  
**Quiero** tener todos los assets y metadata listos para el App Store  
**Para** enviar la app a revisión de Apple

**Criterios de Aceptación**:
- [ ] Screenshots en todas las resoluciones requeridas
- [ ] Ícono de app en todos los tamaños
- [ ] Descripción de la app (ES/EN)
- [ ] Keywords para búsqueda
- [ ] Política de privacidad publicada
- [ ] Términos de servicio publicados
- [ ] Video preview (opcional pero recomendado)
- [ ] Categoría y clasificación de edad

**Definición de Done**:
- Todos los assets creados
- Metadata revisada y aprobada
- Links de políticas activos
- Checklist de App Store completado

---

### US-016: Generar build de producción y enviarlo a TestFlight
**SP**: 3  
**Prioridad**: Baja  
**Dependencias**: US-015

**Como** desarrollador  
**Quiero** generar un build de producción optimizado  
**Para** hacer testing beta con TestFlight

**Criterios de Aceptación**:
- [ ] Configurar variables de entorno de producción
- [ ] Configurar código de firma (provisioning profiles)
- [ ] Generar build con Xcode/Capacitor
- [ ] Subir build a App Store Connect
- [ ] Configurar grupo de beta testers
- [ ] Enviar a TestFlight
- [ ] Verificar que instale correctamente
- [ ] Recopilar feedback inicial

**Definición de Done**:
- Build en TestFlight
- 5+ testers instalaron exitosamente
- No crashes en primer uso
- Feedback documentado

---

### US-017: Responder a feedback de revisión de Apple
**SP**: 2  
**Prioridad**: Baja  
**Dependencias**: US-016

**Como** desarrollador  
**Quiero** estar preparado para responder al feedback de Apple  
**Para** lograr la aprobación de la app

**Criterios de Aceptación**:
- [ ] Monitorear status de revisión diariamente
- [ ] Responder a feedback en <24h
- [ ] Corregir issues reportados
- [ ] Re-enviar build si es necesario
- [ ] Documentar todos los cambios solicitados

**Notas**:
- El tiempo de revisión es variable (2-7 días típicamente)
- Puede haber múltiples rondas de feedback
- Considerar 1-2 semanas para este proceso completo

**Definición de Done**:
- App aprobada por Apple
- Status "Ready for Sale"
- Publicación programada

---

## Épica 6: Separación Progresiva de Contexto Global
**Prioridad**: MEDIA-BAJA (mejora técnica)  
**Total SP**: ∞ (trabajo continuo)  
**Riesgo**: Bajo - No bloquea funcionalidad  

### US-018: Extraer contexto de planes diarios
**SP**: 13  
**Prioridad**: Media  

**Como** desarrollador  
**Quiero** separar la lógica de planes diarios del contexto global  
**Para** mejorar escalabilidad y reducir complejidad

**Descripción Técnica**:
- Database.context.tsx tiene lógica mezclada de múltiples módulos
- Crear contextos específicos por módulo

**Criterios de Aceptación**:
- [ ] Crear `ShootingsContext` independiente
- [ ] Mover lógica de shootings del Database.context
- [ ] Implementar provider composition
- [ ] Reducir re-renders innecesarios
- [ ] Tests de integración de contextos
- [ ] Performance: reducir tiempo de render 30%
- [ ] Documentar patrón para otros módulos

**Definición de Done**:
- ShootingsContext funcional
- No hay regresiones
- Performance mejorado
- Documentación de patrón

---

## Planificación de Sprints (Sugerida)

### Sprint 1 (2 semanas) - 18 SP
**Objetivo**: Desacoplar lógica de replicación
- US-001: Crear capa de servicio (8 SP)
- US-002: Estado de máquina finita (5 SP)
- US-003: Debouncing (3 SP)
- US-004: Cleanup de replicadores (5 SP) - **EXTRA si hay capacidad**

**Riesgo**: Alto - Cambios arquitectónicos profundos  
**Mitigación**: Code review continuo, tests exhaustivos

---

### Sprint 2 (2 semanas) - 21 SP
**Objetivo**: Implementar borrado lógico
- US-004: Cleanup (si no se completó) (5 SP)
- US-005: `_deleted` en schemas (8 SP)
- US-006: Paranoia en backend (5 SP)
- US-007: Fix re-creación con mismo ID (8 SP) - **EXTRA si hay capacidad**

**Riesgo**: Alto - Requiere coordinación backend/frontend  
**Mitigación**: Testing en ambiente staging

---

### Sprint 3 (2 semanas) - 18 SP
**Objetivo**: Auditar y estabilizar shootings
- US-007: Fix re-creación (si no se completó) (8 SP)
- US-008: Auditoría de shootings (5 SP)
- US-009: Fix locaciones (8 SP) - **PARCIAL**

**Riesgo**: Medio - Módulo complejo  
**Mitigación**: Tests automatizados extensivos

---

### Sprint 4 (2 semanas) - 18 SP
**Objetivo**: Completar estabilización de shootings
- US-009: Fix locaciones (resto) (8 SP)
- US-010: Fix llamados (8 SP)
- US-014: Manejo de errores (3 SP) - **EXTRA**

**Riesgo**: Medio  
**Mitigación**: QA manual intensivo

---

### Sprint 5 (2 semanas) - 13 SP
**Objetivo**: Pulir UI y preparar release
- US-011: Validación de integridad (5 SP)
- US-012: Edición en tabla (5 SP)
- US-013: Errores en tarjetas (5 SP) - **PARCIAL**
- US-014: Manejo de errores (si no se completó) (3 SP)

**Riesgo**: Bajo  

---

### Sprint 6 (1 semana) - 8 SP
**Objetivo**: App Store
- US-013: Errores en tarjetas (resto)
- US-015: Metadata App Store (3 SP)
- US-016: Build y TestFlight (3 SP)
- US-017: Revisión Apple (2 SP)

**Nota**: Sprint 6 puede extenderse debido a tiempos de Apple (fuera de nuestro control)

---

## Métricas de Éxito

### Técnicas
- [ ] 0 memory leaks en 1000 ciclos de replicación
- [ ] <100ms de query time en shootings
- [ ] 90%+ cobertura de tests en módulo de replicación
- [ ] 0 duplicados en 100 sincronizaciones consecutivas
- [ ] Database.context.tsx <400 líneas

### Funcionales
- [ ] Usuario puede trabajar 100% offline por 7 días
- [ ] Sincronización exitosa al reconectar
- [ ] 0 pérdida de datos en escenarios de conflicto
- [ ] Tiempo de primera sincronización <2 minutos

### Negocio
- [ ] App aprobada en App Store
- [ ] <5% crash rate en producción
- [ ] Feedback de usuarios >4.0/5.0

---

## Riesgos y Mitigación

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Regresiones en replicación al refactorizar | Alta | Crítico | Tests exhaustivos, feature flags, rollback plan |
| Backend no disponible para cambios de paranoia | Media | Alto | Coordinar temprano, planificar alternativas |
| Apple rechaza app en revisión | Media | Alto | Seguir guidelines estrictamente, TestFlight previo |
| Subestimación de complejidad en shootings | Alta | Alto | Buffer del 30% en estimaciones, revisión continua |
| Cambio de prioridades del negocio | Media | Medio | Sprints cortos, valor entregable cada sprint |

---

## Notas para Presentación al Jefe

### Puntos Clave a Comunicar

1. **Tiempo realista**: 6-7 semanas de desarrollo + 1 semana para App Store = **7-8 semanas totales**

2. **Inversión técnica necesaria**: Las épicas 1 y 2 son "deuda técnica" que DEBE pagarse para que la app sea mantenible a largo plazo

3. **Riesgo alto en estatus actual**: 
   - Race conditions pueden causar pérdida de datos
   - Memory leaks afectan performance
   - Borrado físico puede eliminar datos permanentemente

4. **ROI de la refactorización**:
   - Reducción de bugs futuros en 70%+
   - Tiempo de desarrollo de features nuevas reducido 40%
   - Estabilidad y confianza del usuario

5. **Enfoque ágil**: Cada sprint entrega valor, puede pausarse si hay emergencias

### Preguntas Anticipadas

**P: ¿Por qué no podemos solo "arreglar los bugs" sin refactorizar?**  
R: Los bugs son síntomas de problemas arquitectónicos. Arreglarlos sin refactorizar es como poner cinta adhesiva en una tubería rota - el problema reaparecerá.

**P: ¿Podemos lanzar sin completar todo el backlog?**  
R: Épicas 1, 2 y 3 son CRÍTICAS. Épica 4 y 5 son necesarias para App Store. Épica 6 es mejora continua.

**P: ¿Qué pasa si tenemos menos tiempo?**  
R: Podemos priorizar shootings sobre otros módulos, pero mínimo necesitamos 5 semanas para épicas 1-3.

**P: ¿Necesitamos más recursos?**  
R: Un segundo desarrollador podría reducir tiempo a 4-5 semanas, pero requiere coordinación y puede agregar overhead inicial.

---

## Glosario Técnico

- **SP (Story Points)**: Unidad de estimación de complejidad (1 SP ≈ 0.5-1 día de trabajo)
- **RXDB**: Base de datos offline-first con sincronización
- **Soft Delete**: Marcar como eliminado sin borrar físicamente
- **Race Condition**: Error cuando múltiples operaciones compiten por el mismo recurso
- **Memory Leak**: Memoria que no se libera, degradando performance
- **FSM (Finite State Machine)**: Patrón de diseño para controlar estados
- **Debouncing**: Técnica para limitar frecuencia de ejecución

---

**Última actualización**: 7 de enero de 2026  
**Autor**: Daniel Carrera  
**Revisión**: Pendiente
