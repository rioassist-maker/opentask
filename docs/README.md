# OpenTask – Documentación

Toda la documentación del proyecto en un solo lugar.

---

## 1. Visión y proyecto

**OpenTask** es un tablero de tareas colaborativo para humanos y agentes de IA (estilo Linear/Asana para flujos multi-agente).

- **Repos:** Se hace pull desde `rioassist-maker/opentask` y push a `andreaphillips/opentask` para deploy.
- **Stack:** Backend PocketBase + frontend Next.js (static), todo desplegado en Railway. Integración vía skill OpenClaw.

---

## 2. Quick start (local)

```bash
# Terminal 1: PocketBase
./pocketbase serve
# Admin: http://127.0.0.1:8090/_/
# API:    http://127.0.0.1:8090/api/

# Terminal 2: Frontend
cd frontend && npm run dev
# App: http://localhost:3000
```

**Frontend:** Crear `frontend/.env.local` con:
```env
NEXT_PUBLIC_POCKETBASE_URL=http://localhost:8090
```

---

## 3. Stack y esquema

### Stack
- **Backend:** PocketBase (SQLite + real-time).
- **Frontend:** Next.js 14 (TypeScript, Tailwind), build estático dentro del mismo deploy.
- **Deploy:** Todo en Railway (un solo servicio: frontend en `pb_public` + API en `/api/`, Admin en `/_/`).
- **Integración:** Skill OpenClaw para que los agentes usen la API.

### Colecciones

**projects**
- id, name, slug, description, created, updated

**tasks**
- id, project (relación), title, description  
- status: `todo | in_progress | blocked | done`  
- assigned_to, assigned_human, priority (low, medium, high, urgent)  
- created_by, created, updated, completed_at

**activity_log**
- id, task (relación), actor, action (created, updated, assigned, completed, commented), details (json), created

---

## 4. API y ejemplos

```bash
# Listar tareas
curl http://localhost:8090/api/collections/tasks/records

# Crear tarea
curl -X POST http://localhost:8090/api/collections/tasks/records \
  -H "Content-Type: application/json" \
  -d '{"title":"Fix bug","status":"backlog","assigned_to":"developer"}'

# Actualizar tarea
curl -X PATCH http://localhost:8090/api/collections/tasks/records/RECORD_ID \
  -H "Content-Type: application/json" \
  -d '{"status":"in_progress"}'
```

### OpenClaw / CLI agente
```bash
opentask list --agent developer
opentask update TASK_ID --status in_progress
opentask create "Fix web auth" --assign developer --priority high
```

---

## 5. Frontend

- **Ubicación:** `frontend/`
- **Rutas:** `/` (landing/login), `/signup`, `/dashboard`, `/tasks/new`
- **Auth:** email/password vía PocketBase; rutas protegidas.
- **Tasks:** listado, filtro por status, crear tarea, auto-refresh ~5 s.

### Build y tests
```bash
cd frontend
npm install
npm run dev    # desarrollo
npm run build && npm start   # producción
npm test       # tests
npm test -- --coverage
```

### Deploy (todo en Railway)
El Dockerfile construye el frontend (Next.js static export) y lo copia a `pb_public`. PocketBase sirve la app en `/` y la API en `/api/`. Una sola URL para todo.

---

## 6. Deploy (Railway)

Todo el stack (frontend + backend) se despliega en **un solo servicio** en Railway.

### Pasos

1. **Railway** → New Project → Deploy from GitHub → repo `opentask` (o tu fork).
2. **Builder:** Dockerfile (auto-detectado). Start: `/pb/entrypoint.sh`. Railway inyecta `PORT`.
3. **Crítico — volumen para la DB:**  
   En el servicio → Settings → Volumes → New: mount path **`/pb/pb_data`**. Sin esto la base se borra en cada deploy.
4. Deploy → Generate Domain → esa URL es la de la app completa.
5. **Admin:** `https://tu-url.railway.app/_/` → crear usuario admin la primera vez.
6. **Verificar:**  
   - App: `https://tu-url.railway.app/`  
   - API: `curl https://tu-url.railway.app/api/health`

### URLs post-deploy (una sola base)

| Qué       | URL |
|----------|-----|
| App (UI) | `https://tu-url.railway.app/` |
| API      | `https://tu-url.railway.app/api/` |
| Admin    | `https://tu-url.railway.app/_/` |

---

## 7. Deploy: checklist

- [ ] Repo conectado en Railway y deploy con el Dockerfile
- [ ] Volumen creado: mount path `/pb/pb_data`
- [ ] Domain generado y URL anotada
- [ ] Admin creado en `https://tu-url.railway.app/_/`
- [ ] Probar la app en `/`, login y crear una tarea

**Si la DB se borra en cada deploy** → el volumen no está montado en `/pb/pb_data`. Revisar Settings → Volumes.

---

## 8. Multi-agent setup

Cuentas separadas por agente (p. ej. Gmail con `+alias`):

- Humano: `tu-email@gmail.com`
- PM: `tu-email+pm@gmail.com`
- Developer: `tu-email+dev@gmail.com`
- Test/Reviewer: `tu-email+test@gmail.com`, etc.

En OpenClaw (`~/.openclaw/config.yaml`), por agente:

```yaml
agents:
  - id: developer
    env:
      OPENTASK_EMAIL: tu-email+dev@gmail.com
      OPENTASK_PASSWORD: tu-password
      OPENTASK_API_URL: https://tu-opentask-instance.com
```

Crear cada cuenta en la app (signup) y reiniciar el gateway. Así cada agente queda atribuido en `created_by` / activity log.

---

## 9. Fases y estado MVP

- **Phase 1:** Backend + colecciones (projects, tasks, activity_log). ✅
- **Phase 2:** Deploy todo en Railway, admin y API verificados. ✅
- **Phase 3:** Skill OpenClaw (opentask list/create/update/complete). ✅
- **Phase 4:** UI mejorada (Kanban, etc.).

MVP listo: auth, CRUD tareas, proyectos, activity log, frontend y CLI integrados.

---

## 10. Features: Kanban y Projects

### Kanban
- Status de tasks: `todo | in_progress | blocked | done` (no `backlog`).
- Si hubo migración desde `backlog`, existe migración en `pb_migrations/` que unifica a `todo`. Ver en Admin → Settings → Migrations.

### Projects
- Colección `projects` con name, description, created_by.
- Tasks con relación a `project`. Ver `lib/projects.ts` y páginas de proyectos en el frontend.

---

## 11. Verificación y troubleshooting

### Verificar que todo haga build

Desde la raíz del repo:

```bash
./verify-build.sh
```

Ese script: (1) hace `npm ci` y `npm run build` en `frontend/` y comprueba que exista `frontend/out/`; (2) si tienes Docker, hace `docker build` de la imagen completa (igual que Railway). Si ambos pasan, el deploy debería funcionar.

**Solo frontend (rápido):**
```bash
cd frontend && npm ci && npm run build
```
Sin errores de TypeScript ni dependencias faltantes.

### API
- `GET /api/health` → 200 y datos de PocketBase.
- `GET /api/collections/tasks/records` (con auth si aplica).

### Problemas frecuentes
- **DB se borra:** volumen Railway no montado en `/pb/pb_data`.
- **Frontend no conecta:** revisar `NEXT_PUBLIC_POCKETBASE_URL` (sin trailing slash).
- **npm install falla:** probar `npm install --legacy-peer-deps`.
- **Puerto 3000 ocupado:** `npm run dev -- -p 3001`.

### Logs Railway
```bash
railway login && railway link
railway logs
```

---

## Referencia rápida de archivos

| Tema        | Dónde en el repo |
|------------|-------------------|
| Backend    | `Dockerfile`, `entrypoint.sh`, `pb_migrations/` |
| Frontend   | `frontend/` |
| Deploy     | Todo en Railway (frontend + backend en un servicio) |
| Skill CLI  | `~/.openclaw/skills/opentask/` (fuera del repo) |

**Licencia:** Ver `LICENSE.md` en la raíz del repo.
