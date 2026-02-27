# Notas de Migración - API Botón de Pánico

## Resumen de Cambios

Se actualizó el cliente TypeScript/Angular generado desde la especificación OpenAPI `Boton-Api.yaml` (versión 1.0.0).

### Fecha de Actualización

27 de febrero de 2026

## Cambios Principales en la API

### 1. Servicios Separados por Tag

**Antes:**

- Un solo `DefaultService` con todos los métodos

**Ahora:**

- `AlertasService` - Operaciones de alertas
- `MensajesService` - Envío y consulta de mensajes
- `MultimediaService` - Envío de archivos (foto, video, audio)
- `SaludService` - Health checks y ping
- `ConversacionesService` - Consulta de conversaciones
- `ReportesService` - Reportes del sistema
- `DocumentacinService` - Descargas de documentación OpenAPI

### 2. Cambios en Modelos

| Modelo Anterior                       | Modelo Nuevo   | Cambios Notables                                |
| ------------------------------------- | -------------- | ----------------------------------------------- |
| `EnviarAlertaPostRequest`             | `Solicitud`    | Mismo estructura                                |
| `EnviarAlertaPost200Response`         | `Respuesta`    | Campo `uam` → `enZonaPermitida`                 |
| `EnviarAlertaPostRequestLocalizacion` | `Localizacion` | Mismo estructura                                |
| `EnviarMensajePostRequest`            | `Mensaje`      | Solo contiene `contenido` y `idMensaje`         |
| `EstadoAtendida201Response`           | `string`       | Ahora retorna string directo en lugar de objeto |

### 3. Autenticación

**Antes:**

```typescript
// Token pasado como parámetro
await this.appBotonServices.enviarMensajePost(bearerToken, contenido);
```

**Ahora:**

```typescript
// Token configurado en Configuration, se inyecta automáticamente
await this.mensajesService.enviarMensaje(mensaje);
```

La autenticación ahora usa el patrón `Configuration.credentials['bearerAuth']` que inyecta automáticamente el header `Authorization: Bearer <token>`.

## Cambios en boton.service.ts

### Servicios Inyectados

```typescript
// Antes
constructor(
  private readonly appBotonServices: DefaultService,
)

// Ahora
constructor(
  private readonly alertasService: AlertasService,
  private readonly mensajesService: MensajesService,
  private readonly multimediaService: MultimediaService,
  private readonly saludService: SaludService,
)
```

### Configuración Dinámica de Token

Se configuró `Configuration` con función lambda para obtener el token dinámicamente:

```typescript
this.apiConfig = new Configuration({
  credentials: {
    bearerAuth: () => this.appStateService.getBearerToken() || "",
  },
});
```

### Mapeo de Métodos

| Operación              | Método Anterior                       | Método Nuevo                             |
| ---------------------- | ------------------------------------- | ---------------------------------------- |
| Enviar alerta          | `enviarAlertaPost(datos)`             | `alertasService.enviarAlerta(solicitud)` |
| Verificar comunicación | `checarComunicacionGet()`             | `saludService.verificarComunicacion()`   |
| Enviar mensaje         | `enviarMensajePost(token, contenido)` | `mensajesService.enviarMensaje(mensaje)` |
| Enviar foto            | `enviarFotoPost(token, blob)`         | `multimediaService.enviarFoto(blob)`     |
| Obtener estado         | `estadoAtendida(token)`               | `alertasService.obtenerEstadoAlerta()`   |
| Cancelar alerta        | `cancelar()`                          | `alertasService.cancelarAlerta()`        |

### Estados de Alerta

El método `obtenerEstadoAlerta()` ahora retorna un `string` con valores:

- `"ACTIVA"` / `"ENVIADA"` → `StatusAlerta.ENVIADA`
- `"ESPERANDO_RESPUESTA"` → `StatusAlerta.ESPERANDO_RESPUESTA`
- `"EN_ATENCION"` → `StatusAlerta.EN_ATENCION`
- `"ATENDIDA"` → `StatusAlerta.ATENDIDA`
- `"FINALIZADA"` → `StatusAlerta.FINALIZADA`
- `"CANCELADA"` → `StatusAlerta.CANCELADA`
- `"RECHAZADA"` → `StatusAlerta.RECHAZADA`

El mapeo se hace usando `switch(statusString.toUpperCase())` que es más robusto ante variaciones.

## Endpoints Nuevos

Según la especificación OpenAPI actualizada, se agregaron:

### Conversaciones

- `GET /boton/conversaciones/todas` - Listar todas las conversaciones
- `GET /boton/conversaciones` - Obtener conversaciones por dispositivo
- `GET /boton/conversaciones/mensajes` - Obtener mensajes de conversación
- `GET /boton/conversaciones/mias` - Mis conversaciones (por token)
- `GET /boton/conversaciones/completa` - Conversación completa

### Multimedia

- `POST /boton/multimedia/video` - Enviar video
- `POST /boton/multimedia/foto` - Enviar foto
- `POST /boton/multimedia/audio` - Enviar audio

### Alertas

- `POST /boton/alertas/enviar` - Enviar alerta de pánico
- `POST /boton/alertas/cancelar` - Cancelar alerta activa
- `GET /boton/alertas/estado` - Obtener estado de alerta

### Mensajes

- `POST /boton/mensajes/enviar` - Enviar mensaje de texto
- `GET /boton/mensajes` - Obtener mensajes por dispositivo
- `GET /boton/mensajes/mios` - Mis mensajes por token

### Salud

- `GET /ping` - Ping simple
- `GET /boton/salud/comunicacion` - Verificar comunicación
- `GET /boton/salud/detailed` - Health check detallado

### Documentación

- `GET /api-docs.yml` - Descargar OpenAPI en YAML
- `GET /api-docs.yaml` - Descargar OpenAPI en YAML alternativo
- `GET /api-docs.json` - Descargar OpenAPI en JSON

### Reportes

- `GET /boton/reportes/listar` - Listar todos los reportes
- `GET /boton/reportes/{id}` - Obtener reporte por ID

## Testing Requerido

Para verificar que todos los endpoints funcionen correctamente:

### 1. Flujo Completo de Alerta

```typescript
// 1. Enviar alerta
const respuesta = await alertasService.enviarAlerta(solicitud);

// 2. Verificar token generado
console.log("Token:", respuesta.token);

// 3. Enviar mensaje
await mensajesService.enviarMensaje({ contenido: "Prueba" });

// 4. Enviar foto
await multimediaService.enviarFoto(blobFoto);

// 5. Obtener estado
const estado = await alertasService.obtenerEstadoAlerta();

// 6. Cancelar
await alertasService.cancelarAlerta();
```

### 2. Verificar Autenticación

```typescript
// Sin token - debe fallar
try {
  await mensajesService.enviarMensaje({ contenido: "Sin auth" });
} catch (error) {
  // Debe retornar 401 Unauthorized
}

// Con token - debe funcionar
appStateService.saveBearerToken("token_valido");
await mensajesService.enviarMensaje({ contenido: "Con auth" });
```

### 3. Validar Respuestas

- Verificar que `respuesta.enZonaPermitida` funciona correctamente
- Validar mapeo de estados de alerta
- Confirmar que los mensajes se envían con el token correcto

## Notas Importantes

### ⚠️ Breaking Changes

1. **Token ya no se pasa como parámetro** - Se configura globalmente en `Configuration`
2. **Campo `uam` cambió a `enZonaPermitida`** - Actualizar lógica que dependa de este campo
3. **Estados como string** - Ya no es enum `EstadoAtendida201Response.TipoEnum`

### 🔧 Configuración

- El `Configuration` se inicializa en el constructor de `BotonService`
- La función lambda `() => this.appStateService.getBearerToken()` obtiene el token dinámicamente
- No es necesario actualizar manualmente el token en los servicios

### 📝 Modelos Eliminados

- `DefaultService`
- `EnviarAlertaPost200Response`
- `EnviarAlertaPostRequest`
- `EnviarAlertaPostRequestLocalizacion`
- `EnviarMensajePostRequest`
- `EstadoAtendida201Response`

### ✅ Modelos Nuevos

- `Solicitud`
- `Respuesta`
- `Localizacion`
- `Mensaje`
- `PostAlerta`
- `Conversacion`, `Conversaciones`
- `Reporte`
- `HealthDetailedResponse`, `HealthComponents`
- `ErrorResponse`

## Próximos Pasos

1. ✅ Regenerar API client desde OpenAPI
2. ✅ Actualizar `boton.service.ts`
3. ⏳ Compilar proyecto y verificar errores
4. ⏳ Ejecutar pruebas unitarias
5. ⏳ Probar flujo completo en dev
6. ⏳ Probar en servidor SSL (0.0.0.0:4200)
7. ⏳ Validar con backend en producción

## Comandos Útiles

```bash
# Regenerar API client
npm run openapi:generate

# Compilar proyecto
npm run build

# Iniciar dev server con SSL
npm start

# Ver errores de TypeScript
npx tsc --noEmit
```

## Referencias

- Especificación OpenAPI: [`Boton-Api.yaml`](./Boton-Api.yaml)
- API generada: [`src/api/generated/`](./src/api/generated/)
- Servicio actualizado: [`src/services/boton.service.ts`](./src/services/boton.service.ts)
