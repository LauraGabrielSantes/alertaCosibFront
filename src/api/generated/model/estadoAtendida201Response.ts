/**
 * Botón API
 * API para el envío de alertas, mensajes, fotos, audios, videos, reportes, comunicación WebSocket, y gestión de conversaciones a través de un servicio de Telegram.
 *
 * The version of the OpenAPI document: 1.0.0-oas3.1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface EstadoAtendida201Response { 
    Tipo?: EstadoAtendida201Response.TipoEnum;
}
export namespace EstadoAtendida201Response {
    export type TipoEnum = 'ATENDIDA' | 'PENDIENTE' | 'RECHAZADA' | 'OTRA';
    export const TipoEnum = {
        Atendida: 'ATENDIDA' as TipoEnum,
        Pendiente: 'PENDIENTE' as TipoEnum,
        Rechazada: 'RECHAZADA' as TipoEnum,
        Otra: 'OTRA' as TipoEnum
    };
}


