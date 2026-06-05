# OO-34: Desacoplamiento de Lógica de Replicación — COMPLETADA ✅

**Épica:** [OO-34](https://carreraprogrammer.atlassian.net/browse/OO-34)  
**Cerrada:** 27 de abril de 2026

## Resumen final

| Ticket | Descripción | Jira | Decisión |
|--------|-------------|------|----------|
| [OO-45](https://carreraprogrammer.atlassian.net/browse/OO-45) | Crear módulo database independiente | ✅ Finalizada | Implementado — módulo completo + 64 tests pasando |
| [OO-47](https://carreraprogrammer.atlassian.net/browse/OO-47) | Implementar FSM de estados | ✅ Finalizada | Descartada — sobre-ingeniería. Los race conditions eran síntoma del acoplamiento React (resuelto en OO-45), no un problema de estados. El guard `allReplicationsInCourse` es suficiente. |
| [OO-49](https://carreraprogrammer.atlassian.net/browse/OO-49) | Control de replicación periódica | ✅ Finalizada | Guard ya existía (`allReplicationsInCourse`). Se mejoró el log: `[DB][REPLICATION] Cycle skipped - previous still running`. |
| [OO-51](https://carreraprogrammer.atlassian.net/browse/OO-51) | Migrar suscripciones al módulo | ✅ Finalizada | Los dos `.subscribe()` de RxDB removidos del contexto. Suscripciones viven en DatabaseManager y ReplicationManager, expuestas via `dbEvents`. |

---

## OO-45 [US-001][P0] — Crear módulo database independiente

**Estado Jira:** ✅ Finalizada  
**Estado en código:** ✅ Implementado, pendiente de commitear los tests

### Qué se hizo

El módulo `src/database/` está completo:

```
src/database/
├── index.ts                          # API pública: db, dbEvents, replicationManager
├── types.ts                          # Tipos compartidos
├── events.ts                         # EventEmitter tipado (75 líneas)
├── core/
│   ├── database.ts
│   ├── database_schema.ts
│   └── replicator.ts
├── schemas/                          # 12 schemas de colecciones
├── managers/
│   ├── DatabaseManager.ts            # Singleton RxDB (245 líneas)
│   ├── ReplicationManager.ts         # Orquestador de replicaciones (688 líneas)
│   └── DeletedRecordsHandler.ts
└── __tests__/                        # SIN COMMITEAR
    ├── DatabaseManager.test.ts       (220 líneas)
    ├── DeletedRecordsHandler.test.ts (257 líneas)
    ├── events.test.ts                (196 líneas)
    └── ReplicationManager.test.ts    (419 líneas)
```

### Pendiente de commitear (no subir `coverage/`)
- `src/database/__tests__/` — 4 archivos, ~1,092 líneas de tests con Vitest
- `package.json` — agrega `@vitest/coverage-v8`
- `vite.config.ts` — alias `@` → `src/`
- `tsconfig.json` — `paths` para el alias `@/*`

### DoD checklist
- [x] Estructura src/database/ con API exportable
- [x] `initializeDatabase()` movido a DatabaseManager
- [x] 11 funciones `initialize*Replication()` en ReplicationManager
- [x] Eliminar 11 useRef de replicadores del contexto
- [x] EventEmitter tipado implementado
- [x] Módulo consumible via `import { db } from '@/database'`
- [x] Tests unitarios creados
- [ ] Commitear tests + config de Vitest
- [ ] Verificar cobertura >= 80%

---

## OO-47 [US-002][P1] — Implementar FSM de estados

**Estado Jira:** ⬜ Por hacer  
**Dependencias:** OO-45 ✅  
**Estado en código:** ❌ No implementado

No existe `src/database/StateMachine.ts`. Los estados del flujo de replicación no están modelados.

### Estados requeridos

```
IDLE ──► INITIALIZING ──► SYNCING ──► SUCCESS
  ▲            │               │          │
  │            ▼               ▼          │
  └────────── ERROR ◄──────────┴──────────┘
                                │
                                ▼
                             PAUSED
```

### DoD checklist
- [ ] Crear `src/database/StateMachine.ts`
- [ ] Estados: IDLE, INITIALIZING, SYNCING, PAUSED, ERROR, SUCCESS
- [ ] Solo transiciones válidas (definidas explícitamente)
- [ ] Emitir evento `db:state:change` en cada transición
- [ ] Prevenir inicio de replicación si estado != IDLE
- [ ] Logging formato `[DB][STATE] IDLE -> SYNCING`
- [ ] Tests de todas las transiciones válidas e inválidas
- [ ] UI refleja estado actual via suscripción a eventos

---

## OO-49 [US-003][P1] — Control de replicación periódica

**Estado Jira:** ⬜ Por hacer  
**Dependencias:** OO-47 (FSM necesaria para verificar estado antes del ciclo)  
**Estado en código:** ⚠️ Parcial

El `setInterval` ya no está en el contexto React. Falta implementar el ciclo en el módulo.

### DoD checklist
- [x] No hay setInterval en código React (ya removido del contexto)
- [ ] Ciclo periódico vive en ReplicationManager
- [ ] Verifica estado FSM antes de iniciar (solo si IDLE o SUCCESS)
- [ ] Si ejecución anterior sigue activa → skipear ciclo y loggear
- [ ] Timeout máximo por ejecución: 2 minutos
- [ ] Exponer `db.replication.pause()` y `db.replication.resume()`
- [ ] Test con ejecución simulada lenta (>30s) que no cause superposición
- [ ] Log verificable: `[DB][REPLICATION] Cycle skipped - previous still running`

---

## OO-51 [US-004][P1] — Migrar suscripciones de colecciones al módulo

**Estado Jira:** ⬜ Por hacer  
**Dependencias:** OO-45 ✅ (ya done, desbloqueado)  
**Estado en código:** ⚠️ Parcial

`Database.context.tsx` todavía tiene dos suscripciones RxDB directas:
- **Línea ~173:** `.$.subscribe()` — escucha cambios en colección local (local document)
- **Línea ~202:** `.$.subscribe()` — escucha otra colección local

Ambas deben moverse al módulo y exponerse via `dbEvents`.

### DoD checklist
- [ ] Ningún `.subscribe()` de RxDB directo en Database.context.tsx
- [ ] Datos expuestos via `dbEvents.on('collection:...')`
- [ ] Cleanup automático de suscripciones en `db.destroy()`
- [ ] Tests de suscripción y desuscripción
- [ ] Contexto < 200 líneas (actualmente 270)

---

## Qué commitear

- `src/database/` — módulo completo (managers, schemas, events, types, index)
- `src/database/__tests__/` — 64 tests, todos pasando
- `src/context/Database/Database.context.tsx` — eliminados `.subscribe()` directos de RxDB
- `package.json`, `vite.config.ts`, `tsconfig.json` — config de Vitest + alias `@`
- `docs/` — documentación organizada
- **NO commitear** `coverage/` (output generado)
