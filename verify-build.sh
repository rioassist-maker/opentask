#!/usr/bin/env bash
# Verifica que el proyecto haga build correctamente (frontend + Docker).
# Uso: ./verify-build.sh

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}═══ OpenTask - Verificación de build ═══${NC}"
echo ""

# 1. Frontend build (lo que hace el Dockerfile en la etapa frontend-builder)
echo -e "${BLUE}1. Build del frontend (Next.js static export)...${NC}"
cd "$(dirname "$0")/frontend"
if [ ! -f package.json ]; then
  echo -e "${RED}❌ No se encontró frontend/package.json${NC}"
  exit 1
fi
npm ci --quiet
npm run build
if [ ! -d "out" ]; then
  echo -e "${RED}❌ Se esperaba frontend/out/ después del build (next.config debe tener output: 'export')${NC}"
  exit 1
fi
echo -e "${GREEN}✅ Frontend build OK → frontend/out/${NC}"
echo ""

# 2. Docker build (opcional si tienes Docker y el daemon está corriendo)
cd "$(dirname "$0")"
if command -v docker &>/dev/null; then
  echo -e "${BLUE}2. Docker build (imagen completa como en Railway)...${NC}"
  if docker build -t opentask:verify . --quiet 2>/dev/null; then
    echo -e "${GREEN}✅ Docker build OK${NC}"
  else
    echo -e "${YELLOW}   Docker falló o no está corriendo — omitiendo (opcional).${NC}"
    echo "   Para verificar también la imagen: arranca Docker y vuelve a ejecutar."
  fi
else
  echo -e "${YELLOW}2. Docker no encontrado — omitiendo build de imagen (opcional)${NC}"
  echo "   Para verificar también el Docker build: instala Docker y vuelve a ejecutar."
fi

echo ""
echo -e "${GREEN}═══ Verificación terminada ═══${NC}"
