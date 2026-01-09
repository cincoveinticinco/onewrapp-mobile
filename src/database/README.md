# Database Module

Módulo independiente de base de datos para OneWrApp Mobile. Desacoplado de React, consumible como API.

## 📁 Estructura

```
src/database/
├── index.ts                      # API pública
├── types.ts                      # Tipos TypeScript
├── events.ts                     # Sistema de eventos tipado
├── core/                         # Infraestructura RxDB
│   ├── database.ts               # Clase base RxDB
│   ├── database_schema.ts        # Schema base
│   └── replicator.ts             # HTTP Replicator
├── schemas/                      # Definiciones de colecciones
│   ├── scenes.schema.ts
│   ├── projects.schema.ts
│   ├── shootings.schema.ts
│   └── ... (12 schemas totales)
└── managers/                     # Lógica de negocio
    ├── DatabaseManager.ts        # Singleton de RxDB
    ├── ReplicationManager.ts     # Orquestador de replicaciones
    └── DeletedRecordsHandler.ts  # Manejo de registros eliminados
```

## 🚀 Uso

### Inicialización

```typescript
import { db, dbEvents, replicationManager } from '@/database';

// Inicializar base de datos
await db.initialize(isOnline, getToken);

// Escuchar cuando esté lista
dbEvents.on('database:ready', (database) => {
  console.log('Database initialized!', database);
});
```

### Replicación

```typescript
// Replicación inicial de proyecto con progress tracking
await replicationManager.initialProjectReplication();

// Replicación de todas las colecciones
await replicationManager.initializeAllReplications();

// Replicación solo de proyectos y usuarios
await replicationManager.initializeProjectsUserReplication();
```

### Eventos

```typescript
import { dbEvents } from '@/database';

// Progress de replicación
dbEvents.on('replication:progress', ({ percentage, status, currentStep }) => {
  console.log(`${status}: ${percentage}%`);
});

// Replicación completada
dbEvents.on('replication:complete', ({ projectId }) => {
  console.log(`Project ${projectId} replication complete`);
});

// Errores
dbEvents.on('replication:error', ({ error, step }) => {
  console.error(`Error in ${step}:`, error);
});
```

### Configuración

```typescript
// Configurar manager de replicación
replicationManager.configure(isOnline, getToken);

// Establecer proyecto activo
replicationManager.setProjectId(projectId);
```

### Operaciones de mantenimiento

```typescript
// Hard reset (borra todo y recarga app)
await db.hardAppReset();

// Hard resync (limpia colecciones y resincroniza)
await replicationManager.hardResync();
```

## 🏗️ Arquitectura

### DatabaseManager

Singleton que maneja el ciclo de vida de RxDB:

- ✅ Inicialización idempotente (solo se crea una vez)
- ✅ Creación de colecciones
- ✅ Replicación inicial de proyectos/usuarios
- ✅ Gestión del estado de la base de datos

### ReplicationManager

Orquesta todas las replicaciones:

- ✅ 11 funciones de replicación por colección
- ✅ Tracking de progreso para UI
- ✅ Manejo de replicadores (antes eran refs en React)
- ✅ Limpieza automática al cambiar proyecto

### DeletedRecordsHandler

Maneja eliminaciones basadas en auditoría del backend:

- ✅ Consulta tabla de auditoría
- ✅ Verifica coincidencia de ID + createdAtBack
- ✅ Evita borrar registros recreados

### EventEmitter

Sistema tipado de eventos para comunicación con UI:

- ✅ Type-safe subscriptions
- ✅ Cleanup automático
- ✅ Desacoplamiento total de React

## 🔄 Migración desde DatabaseContext

### Antes (800 líneas, acoplado a React)

```typescript
const { oneWrapDb, initialProjectReplication } = useContext(DatabaseContext);

// Base de datos atada al ciclo de vida de React
useEffect(() => {
  initializeDatabase();
}, []);
```

### Después (233 líneas, bridge ligero)

```typescript
import { db, replicationManager } from '@/database';

// Base de datos independiente de React
await db.initialize(isOnline, getToken);
await replicationManager.initialProjectReplication();

// O desde React (opcional)
const { oneWrapDb } = useContext(DatabaseContext);
```

## ✅ Ventajas

1. **Desacoplado de React**: Funciona sin componentes, hooks ni efectos
2. **Singleton verdadero**: Una sola instancia, controlada explícitamente
3. **Testeable**: No requiere montar componentes para probar
4. **Reutilizable**: Usa en workers, service workers, scripts, etc.
5. **Type-safe**: Eventos y APIs completamente tipados
6. **Fácil debugging**: Lógica clara sin ciclo de vida de React

## 📊 Métricas

- **Original**: 799 líneas en contexto
- **Nuevo contexto**: 233 líneas (71% reducción)
- **Módulo database**: 1094 líneas (lógica extraída)
- **Total**: Mismo código, mejor organizado

## 🧪 Testing

```typescript
import { db, replicationManager, dbEvents } from '@/database';

describe('Database Module', () => {
  it('should initialize only once', async () => {
    const db1 = await db.initialize(true, getToken);
    const db2 = await db.initialize(true, getToken);
    expect(db1).toBe(db2); // Mismo singleton
  });

  it('should emit events', (done) => {
    dbEvents.on('database:ready', (database) => {
      expect(database).toBeDefined();
      done();
    });
    db.initialize(true, getToken);
  });
});
```

## 📝 Notas

- El contexto (`Database.context.tsx`) ahora es solo un **bridge** para React
- Toda la lógica de negocio está en `src/database/`
- Los eventos permiten comunicación unidireccional: database → UI
- El módulo NO depende de React en absoluto
