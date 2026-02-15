# OpenTask

**Human-Agent Task Board** — Gestión de tareas colaborativa para humanos y agentes de IA.

## Stack

- **Backend + Frontend:** PocketBase (SQLite + real-time) + Next.js (static), todo en **Railway**
- **Integración:** Skill OpenClaw para agentes

## Quick start (local)

```bash
# Terminal 1: PocketBase (API en :8090)
./pocketbase serve

# Terminal 2: Frontend
cd frontend && npm run dev
# http://localhost:3000
```

Para que el frontend hable con PocketBase en local, crea `frontend/.env.local` con:
`NEXT_PUBLIC_POCKETBASE_URL=http://localhost:8090`

## Verificar build

```bash
./verify-build.sh
```

Comprueba que el frontend construye y, si tienes Docker, que la imagen completa (como en Railway) hace build.

## Documentación

**Toda la documentación está en [docs/README.md](./docs/README.md):**

- Visión y proyecto
- Schema y API
- Deploy (Railway, todo en uno)
- Setup multi-agente
- Frontend, Kanban, Projects
- Troubleshooting

---

**Estado:** MVP en uso
