# OpenTask - frontend contra producción (Railway)

.PHONY: dev help

# Levanta solo el frontend. Usa NEXT_PUBLIC_POCKETBASE_URL de frontend/.env.local (prod = Railway).
dev:
	@echo "Levantando frontend (conectado a producción)..."
	cd frontend && npm run dev

help:
	@echo "OpenTask - comandos:"
	@echo "  make dev  - Levanta frontend (:3000), usa backend en Railway (frontend/.env.local)"
	@echo "  make help - Esta ayuda"
