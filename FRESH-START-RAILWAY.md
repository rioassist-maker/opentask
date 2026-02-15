# 🚂 OpenTask - Fresh Start on Railway

**Todo en un solo lugar:** Frontend + Backend + Base de datos persistente

---

## ⚠️ IMPORTANTE: Backup Primero

Antes de borrar nada, guardá:
- Railway project URL actual
- Cualquier dato importante que tengas

---

## Paso 1: Preparar el Código

Ya está listo! Los archivos nuevos:
- ✅ `Dockerfile.new` - Build frontend + backend juntos
- ✅ `entrypoint-full.sh` - Sirve frontend desde PocketBase
- ✅ `frontend/next.config.js` - Configurado para static export

**Aplicar los cambios:**

```bash
cd ~/code/opentask

# Reemplazar Dockerfile
mv Dockerfile Dockerfile.old
mv Dockerfile.new Dockerfile

# Reemplazar entrypoint
mv entrypoint.sh entrypoint.old.sh
mv entrypoint-full.sh entrypoint.sh
chmod +x entrypoint.sh

# Commit
git add -A
git commit -m "feat: Serve frontend + backend from Railway with persistent storage"
git push origin main
```

---

## Paso 2: Crear Proyecto Nuevo en Railway

### Opción A: Desde Railway Dashboard (Recomendado)

1. Ve a https://railway.app/dashboard
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Elige: `rioassist-maker/opentask`
5. Railway detectará el Dockerfile automáticamente

### Opción B: Desde Railway CLI

```bash
# Si no tenés Railway CLI
npm install -g @railway/cli

# Login
railway login

# Crear proyecto
railway init

# Seleccionar repo opentask
# Railway preguntará si querés deployar: di YES
```

---

## Paso 3: Configurar Volumen Persistente (CRÍTICO!)

**Esto evita que se borre la base de datos en cada deploy.**

### Desde Railway Dashboard:

1. Entra al proyecto recién creado
2. Click en el servicio
3. Pestaña **"Settings"**
4. Sección **"Volumes"** (scroll abajo si no lo ves)
5. Click **"New Volume"** o **"+ Add Volume"**
6. **Mount Path:** `/pb/pb_data`
7. **Name:** `opentask-data` (opcional)
8. Click **"Add"** o **"Create"**

### Desde Railway CLI:

```bash
# Link al proyecto
railway link

# Crear volumen
railway volumes create --name opentask-data --mount-path /pb/pb_data
```

**⚠️ SIN ESTE PASO, LA DB SE BORRARÁ EN CADA DEPLOY!**

---

## Paso 4: Verificar Variables de Entorno

En Railway → Settings → Variables, verificar que exista:

- `PORT` = `8080` (debería estar auto-configurado)

**Opcional (Railway lo setea automáticamente):**
- `RAILWAY_VOLUME_MOUNT_PATH` = `/pb/pb_data`

---

## Paso 5: Deploy

Railway ya debería haber iniciado el deployment automáticamente.

Si no:
```bash
railway up
```

O desde dashboard: click **"Deploy"**

**Esperá 2-3 minutos** para el build (tiene que compilar el frontend).

---

## Paso 6: Obtener URL Pública

1. En Railway dashboard → tu servicio
2. Pestaña **"Settings"**
3. Sección **"Networking"**
4. Click **"Generate Domain"**
5. Copiá la URL (ej: `opentask-production.up.railway.app`)

---

## Paso 7: Crear Usuario Admin

1. Ve a `https://tu-url.railway.app/_/`
2. Primera vez te pedirá crear cuenta admin
3. Email: `aphillipsr@gmail.com`
4. Password: `Eiscuer2012?` (o el que quieras)
5. Click **"Create"**

---

## Paso 8: Probar la App

1. Ve a `https://tu-url.railway.app/` 
2. Deberías ver el frontend de OpenTask
3. Login con el admin que creaste
4. Creá un task de prueba
5. **IMPORTANTE:** Hacé un cambio en el código y pusheá
6. Verificá que el task SIGA AHÍ después del redeploy

**Si el task desaparece → el volumen NO está configurado correctamente**

---

## Paso 9: Limpiar Vercel (Opcional)

Una vez que todo funcione en Railway:

1. Ve a https://vercel.com/dashboard
2. Borrá el proyecto `frontend`
3. Listo, no lo necesitás más

---

## Verificación Final

✅ Frontend carga en `https://tu-url.railway.app/`  
✅ Admin UI funciona en `https://tu-url.railway.app/_/`  
✅ API responde en `https://tu-url.railway.app/api/health`  
✅ Datos persisten después de redeploy  
✅ No hay Vercel en el flujo  

---

## Solución de Problemas

### "Frontend no carga, muestra error 404"
- Verificá que el build incluyó `pb_public/` en los logs
- El entrypoint debe mostrar "✅ Frontend static files found"

### "Base de datos se borra en cada deploy"
- **VOLUMEN NO CONFIGURADO**
- Volvé al Paso 3 y creá el volumen

### "Build falla en Railway"
- Verificá que `frontend/next.config.js` tenga `output: 'export'`
- Revisá los logs de Railway para ver el error exacto

### "API funciona pero frontend no"
- Posible problema con rutas de Next.js
- Verificá que `frontend/out/` se generó correctamente

---

## URLs Finales

- **App completa:** https://tu-url.railway.app
- **Admin:** https://tu-url.railway.app/_/
- **API:** https://tu-url.railway.app/api/

**Un solo servicio, todo persistente, sin Vercel.** 🚂✨

---

**Próximos pasos después del deploy:**

1. Actualizá OpenClaw config si es necesario
2. Creá los usuarios (Andrea + agentes)
3. Creá el proyecto Opentask
4. Recreá los tasks
5. **¡A trabajar sin miedo a que se borre todo!**
