import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import {
  AlertasService,
  Configuration,
  Localizacion,
  Mensaje,
  MensajesService,
  MultimediaService,
  Respuesta,
  SaludService,
  Solicitud,
} from 'src/api/generated';
import {
  DatosUsuario,
  Enviado,
  EnviarTipo,
  StatusAlerta,
  TipoAlerta,
} from 'src/domain/alerta';
import { AppStateService } from './app-state.service';
import { FilesFunctions } from './FilesFunctions';

@Injectable({
  providedIn: 'root',
})
export class BotonService {
  constructor(
    private readonly appStateService: AppStateService,
    private readonly router: Router,
    private readonly alertasService: AlertasService,
    private readonly mensajesService: MensajesService,
    private readonly multimediaService: MultimediaService,
    private readonly saludService: SaludService,
    private readonly globalConfig: Configuration,
  ) {
    // Configurar autenticación dinámica manteniendo basePath de la configuración global
    globalConfig.credentials = {
      bearerAuth: () => this.appStateService.getBearerToken() || '',
    };

    // Aplicar configuración global a todos los servicios
    this.alertasService.configuration = globalConfig;
    this.mensajesService.configuration = globalConfig;
    this.multimediaService.configuration = globalConfig;
    this.saludService.configuration = globalConfig;
  }

  async sendAlert(): Promise<void> {
    this.appStateService.startLoading();
    const localizacion = await this.appStateService
      .getLocalizacion()
      .catch((e) => {
        console.error(e);
        return null;
      });

    if (localizacion === null) {
      this.appStateService.stopLoading();
      this.appStateService.sendMessageModal({
        title: 'Error',
        message:
          '<p>No se pudo obtener la <b>ubicación<b></p> <p>Intente de nuevo habilitando la ubicación <a href="tel:911">llamar al 911</a></p>',
      });
      throw new Error('No se pudo obtener la ubicación');
    }
    const datosUsuario = this.appStateService.getDatosUsuario();

    const ubicacion: Localizacion = {
      accuracy: localizacion.accuracy,
      longitude: localizacion.longitude,
      latitude: localizacion.latitude,
      altitude: localizacion.altitude ?? undefined,
      altitudeAccuracy: localizacion.altitudeAccuracy ?? undefined,
      heading: localizacion.heading ?? undefined,
      speed: localizacion.speed ?? undefined,
    };
    const id_dispositivo = await this.appStateService.getIdDispositivo();
    const datosAEnviar: Solicitud = {
      idDispositivo: id_dispositivo,
      localizacion: ubicacion,
      correoElectronico: datosUsuario?.correoElectronico,
      matricula: datosUsuario?.matricula,
      numeroTelefono: datosUsuario?.numeroTelefono,
      nombreCompleto: datosUsuario?.nombreCompleto,
    };
    const respuesta: Respuesta = await lastValueFrom(
      this.alertasService.enviarAlerta(datosAEnviar),
    ).catch((error) => {
      if (error.status === 429) {
        this.appStateService.sendMessageModal({
          title: 'Error',
          message:
            'Demasiadas solicitudes, vuelve a intentarlo en unos minutos. <a href="tel:911">llamar al 911</a>',
        });
        this.appStateService.stopLoading();
        throw new Error(error);
      }

      //envio alerta
      this.appStateService.sendMessageModal({
        title: 'Error de comunicacion vuelve a intentarlo. ',
        message: 'o llama<a href="tel:911">llamar al 911</a>' + error,
      });
      throw new Error(error);
    });

    if (!respuesta.token || !respuesta.horaEnvio) {
      this.appStateService.sendMessageModal({
        title: 'Error',
        message: 'Error al servidor llama<a href="tel:911">llamar al 911</a>',
      });
      throw new Error('El token no se genero');
    }
    this.appStateService.saveBearerToken(respuesta.token);

    const fecha = new Date(respuesta.horaEnvio);
    // Extraer la hora y los minutos
    const hora = fecha.getHours().toString().padStart(2, '0'); // Asegurar que tenga 2 dígitos
    const minutos = fecha.getMinutes().toString().padStart(2, '0'); // Asegurar que tenga 2 dígitos
    // Formatear como "hora:minuto"
    const horaMinuto = `${hora}:${minutos}`;
    this.appStateService.saveHoraAlerta(horaMinuto);
    this.appStateService.startAlert(respuesta.enZonaPermitida ?? true);
    if (respuesta.enZonaPermitida) this.router.navigate(['/selecciona']);
    this.appStateService.stopLoading();
  }

  async checarComunicacion(): Promise<boolean> {
    return await lastValueFrom(this.saludService.verificarComunicacion())
      .then(() => {
        return true;
      })
      .catch((error) => {
        console.error(error);
        return false;
      });
  }
  seleccionarTipoAlerta(tipo: TipoAlerta) {
    this.appStateService.startLoading();
    const bearerToken = this.appStateService.getBearerToken();
    if (this.appStateService.getIsActiveAlert() && bearerToken) {
      const mensaje: Mensaje = {
        contenido: `El usuario selecciona el tipo de alerta: ${tipo}`,
      };
      lastValueFrom(this.mensajesService.enviarMensaje(mensaje)).catch(
        (error) => {
          this.appStateService.sendMessageModal({
            title: 'Error',
            message:
              'Error al seleccionar el tipo de alerta, vuelve a intentarlo. ' +
              error,
          });
        },
      );
    }
    this.appStateService.guardarTipoAlerta(tipo);
    this.appStateService.stopLoading();
    this.router.navigate(['/send-more-info']);
  }

  async sendFoto(blobFoto: Blob) {
    this.appStateService.startLoading();
    blobFoto = await FilesFunctions.comprimirImagen(blobFoto);
    const bearerToken = this.appStateService.getBearerToken();
    if (!bearerToken) {
      throw new Error('No se ha generado el token');
    }

    await lastValueFrom(this.multimediaService.enviarFoto(blobFoto)).catch(
      (error) => {
        this.appStateService.sendMessageModal({
          title: 'Error',
          message: 'Error al enviar la foto, vuelve a intentarlo. ' + error,
        });
        throw new Error(error);
      },
    );

    const fotoBase64 = await this.blobToBase64(blobFoto);
    const enviado: Enviado = {
      tipo: EnviarTipo.FOTOGRAFIA,
      foto: fotoBase64,
    };
    this.appStateService.saveEnviado(enviado);
    this.appStateService.stopLoading();
  }

  async getStatusAlerta(): Promise<StatusAlerta | null> {
    const bearerToken = this.appStateService.getBearerToken();
    if (!bearerToken) {
      return null;
    }
    const statusString: string | null = await lastValueFrom(
      this.alertasService.obtenerEstadoAlerta(),
    ).catch((error) => {
      //si el error es 401 entonces terminar la alerta
      if (error.status === 401) {
        this.appStateService.stopAlert();
        this.router.navigate(['']);
        this.appStateService.sendMessageModal({
          title: 'Aviso',
          message: 'La alerta ha sido terminada',
        });
        return null;
      }

      this.appStateService.sendMessageModal({
        title: 'Error al comunicarse con el servidor',
        message: '<a href="tel:911">Llamar al 911</a>',
      });
      throw new Error(error);
    });

    var statusAlerta: StatusAlerta;

    if (!statusString) {
      return null;
    }
    console.log('Status: ', statusString);

    // Mapear string del API a enum StatusAlerta
    switch (statusString.toUpperCase()) {
      case 'EN_ATENCION':
      case 'ENATENCION':
        statusAlerta = StatusAlerta.EN_ATENCION;
        break;
      case 'FINALIZADA':
        statusAlerta = StatusAlerta.FINALIZADA;
        break;
      case 'CANCELADA':
        statusAlerta = StatusAlerta.CANCELADA;
        break;
      case 'RECHAZADA':
        statusAlerta = StatusAlerta.RECHAZADA;
        break;
      case 'ESPERANDO_RESPUESTA':
      case 'ESPERANDORESPUESTA':
        statusAlerta = StatusAlerta.ESPERANDO_RESPUESTA;
        break;
      case 'ENVIADA':
      case 'ACTIVA':
        statusAlerta = StatusAlerta.ENVIADA;
        break;
      case 'ATENDIDA':
        statusAlerta = StatusAlerta.ATENDIDA;
        break;
      default:
        statusAlerta = StatusAlerta.NO_DEFINIDO;
        break;
    }
    this.appStateService.saveStatusAlerta(statusAlerta);
    return statusAlerta;
  }

  async sendUbicacion(selectedLugar: string, ubicacionEspecificacion: string) {
    this.appStateService.startLoading();
    console.log('Ubicación: ', selectedLugar, '\n', ubicacionEspecificacion);

    const bearerToken = this.appStateService.getBearerToken();
    if (this.appStateService.getIsActiveAlert() && bearerToken) {
      const mensaje: Mensaje = {
        contenido: `El usuario manda su ubicación:
        Lugar: ${selectedLugar}
        Especificación: ${ubicacionEspecificacion}`,
      };
      await lastValueFrom(this.mensajesService.enviarMensaje(mensaje)).catch(
        (error) => {
          this.appStateService.sendMessageModal({
            title: 'Error',
            message:
              'Error al enviar la ubicación, vuelve a intentarlo. ' + error,
          });
        },
      );
    } else {
      this.appStateService.sendMessageModal({
        title: 'Error',
        message: 'Error al enviar la ubicación, vuelve a intentarlo. ',
      });
      throw new Error('No se ha generado el token');
    }

    const enviado: Enviado = {
      tipo: EnviarTipo.UBICACION,
      lugar: selectedLugar,
      ubicacionEspecificacion: ubicacionEspecificacion,
    };
    this.appStateService.saveEnviado(enviado);

    this.appStateService.stopLoading();
    this.router.navigate(['/send-more-info']);
  }

  async sendMasInfo(textoMasInfo: string) {
    this.appStateService.startLoading();
    console.log('Más información: ', textoMasInfo);
    const enviado: Enviado = {
      tipo: EnviarTipo.MAS_INFORMACION,
      informacion: textoMasInfo,
    };
    this.appStateService.saveEnviado(enviado);
    const bearerToken = this.appStateService.getBearerToken();
    if (this.appStateService.getIsActiveAlert() && bearerToken) {
      const mensaje: Mensaje = {
        contenido: `El usuario manda más información:
        ${textoMasInfo}`,
      };
      await lastValueFrom(this.mensajesService.enviarMensaje(mensaje)).catch(
        (error) => {
          this.appStateService.sendMessageModal({
            title: 'Error',
            message:
              'Error al enviar la información, vuelve a intentarlo. ' + error,
          });
        },
      );
    }
    this.appStateService.stopLoading();
    this.router.navigate(['/send-more-info']);
  }
  cancelarAlerta() {
    this.appStateService.startLoading();
    const bearerToken = this.appStateService.getBearerToken();
    if (bearerToken) {
      lastValueFrom(this.alertasService.cancelarAlerta()).catch((error) => {
        console.error('Error al cancelar alerta:', error);
      });
    }
    this.appStateService.stopAlert();
    this.appStateService.stopLoading();
    this.router.navigate(['']);
  }

  async saveDatosUsuario(datosUsuario: DatosUsuario) {
    this.appStateService.saveDatosUsuario(datosUsuario);
    const bearerToken = this.appStateService.getBearerToken();
    if (this.appStateService.getIsActiveAlert() && bearerToken) {
      const mensaje: Mensaje = {
        contenido: `El usuario manda sus datos:
            Nombre: ${datosUsuario.nombreCompleto}
            Matricula: ${datosUsuario.matricula}
        Telefono: ${datosUsuario.numeroTelefono}
        Correo: ${datosUsuario.correoElectronico}`,
      };
      await lastValueFrom(this.mensajesService.enviarMensaje(mensaje));
    }
  }

  private async blobToBase64(blobFoto: Blob): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blobFoto);
    });
  }
}
