# Instrucciones de Despliegue y Prueba

## URLs de Producción

- **Frontend (Vercel):** https://front-bitewise-platform.vercel.app
- **Backend (Railway):** https://bitewise-platform-backend-production.up.railway.app

## Configuración del Backend

1. **CORS ya configurado:**
   - `CorsConfig.java` ya incluye `https://front-bitewise-platform.vercel.app`
   - Commit y push al repo del backend si hay cambios

2. **Backend desplegado en Railway:**
   - URL: `https://bitewise-platform-backend-production.up.railway.app`
   - Ya está configurado y funcionando

## Configuración del Frontend (Vercel)

1. **environment.production.ts ya configurado:**
   ```typescript
   export const environment = {
     production: true,
     apiBaseUrl: 'https://bitewise-platform-backend-production.up.railway.app/api'
   };
   ```

2. **Deploy en Vercel:**
   ```bash
   git add .
   git commit -m "Configurar producción"
   git push
   ```
   - Vercel hará deploy automático

## Pruebas Locales

### 1. Probar backend localmente:
```bash
cd bitewise-platform-backend
# Configurar variables de entorno
$env:SPRING_DATASOURCE_URL="jdbc:postgresql://aws-0-sa-east-1.pooler.supabase.com:6543/postgres?sslmode=require"
$env:SPRING_DATASOURCE_USERNAME="postgres.TU_PROJECT_REF"
$env:SPRING_DATASOURCE_PASSWORD="TU_PASSWORD"

# Ejecutar backend
& "C:\Program Files\JetBrains\IntelliJ IDEA 2026.1.1\plugins\maven\lib\maven3\bin\mvn.cmd" spring-boot:run
```

### 2. Probar frontend localmente:
```bash
cd bitewise-platform
npm install
npm start
```
- Frontend corre en `http://localhost:4200`
- Backend debe correr en `http://localhost:8080`

### 3. Probar conexión:
- Abre `http://localhost:4200` en el navegador
- Abre DevTools > Network
- Verifica que las llamadas a `/api/*` funcionen
- Deberías ver respuestas del backend

## Pruebas en Producción

### 1. Verificar backend en producción:
```bash
curl https://bitewise-platform-backend-production.up.railway.app/api/patients
```

### 2. Verificar frontend en Vercel:
- Visita: https://front-bitewise-platform.vercel.app
- Abre DevTools > Console
- Verifica que no haya errores de CORS
- Abre DevTools > Network
- Verifica que las llamadas API funcionen

### 3. Prueba de integración:
1. Navega a una página que use servicios (ej: pacientes, recetas)
2. Verifica que los datos se carguen desde el backend
3. Prueba crear/editar recursos si la UI lo permite

## Solución de Problemas

### Error CORS:
- Verifica que `CorsConfig.java` incluya `https://front-bitewise-platform.vercel.app`
- Verifica que el backend esté deployado y accesible en Railway

### Error 404/500:
- Verifica que `apiBaseUrl` en environment.production.ts sea `https://bitewise-platform-backend-production.up.railway.app/api`
- Verifica que el backend esté corriendo en Railway
- Revisa los logs del backend en Railway

### Error de conexión:
- Verifica que el backend permita tráfico desde `https://front-bitewise-platform.vercel.app`
- Revisa los logs de Vercel
- Verifica que las variables de entorno estén configuradas
