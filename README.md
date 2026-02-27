# alertaCosibFront

## Desarrollo con SSL en red local

1) Generar certificado autofirmado (si no existe):

```bash
npm run generate-ssl
```

2) Iniciar el servidor en HTTPS y accesible en la red:

```bash
npm start
```

Notas:
- El certificado se genera en `ssl/cert.pem` y la clave en `ssl/key.pem`.
- Si cambias de red o de IP, vuelve a ejecutar `npm run generate-ssl` para regenerar el certificado.
