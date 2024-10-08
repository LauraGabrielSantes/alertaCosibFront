import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import {
  DefaultService,
  EnviarAlertaPost200Response,
  EnviarAlertaPostRequest,
  EnviarAlertaPostRequestLocalizacion,
  EnviarMensajePostRequest,
  EstadoAtendida201Response,
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
    private readonly appBotonServices: DefaultService,
  ) {}

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

    const ubicacion: EnviarAlertaPostRequestLocalizacion = {
      accuracy: localizacion.accuracy,
      longitude: localizacion.longitude,
      latitude: localizacion.latitude,
      altitude: localizacion.altitude ?? undefined,
      altitudeAccuracy: localizacion.altitudeAccuracy ?? undefined,
      heading: localizacion.heading ?? undefined,
      speed: localizacion.speed ?? undefined,
    };
    const id_dispositivo = await this.appStateService.getIdDispositivo();
    const datosAEnviar: EnviarAlertaPostRequest = {
      idDispositivo: id_dispositivo,
      localizacion: ubicacion,
      correoElectronico: datosUsuario?.correoElectronico,
      matricula: datosUsuario?.matricula,
      numeroTelefono: datosUsuario?.numeroTelefono,
      nombreCompleto: datosUsuario?.nombreCompleto,
    };
    const respuesta: EnviarAlertaPost200Response = await lastValueFrom(
      this.appBotonServices.enviarAlertaPost(datosAEnviar),
    ).catch((error) => {
      //envio alerta
      this.appStateService.sendMessageModal({
        title: 'Error de comunicacion vuelve a intentarlo. ',
        message: 'llama<a href="tel:911">llamar al 911</a>' + error,
      });
      throw new Error(error);
    });
    console.log('Respuesta: ', respuesta);
    this.appStateService.setInUam(respuesta.uam === true);
    if (respuesta.uam !== true) {
      this.appStateService.stopLoading();
      this.appStateService.saveBearerToken(respuesta.token!);
      this.appStateService.startAlert(false);
      throw new Error('No se genero la alerta.');
    }

    if (!respuesta.token || !respuesta.horaEnvio) {
      this.appStateService.sendMessageModal({
        title: 'Error',
        message: 'Error al servidor llama<a href="tel:911">llamar al 911</a>',
      });
      throw new Error('El token no se genero');
    }
    const fecha = new Date(respuesta.horaEnvio);
    // Extraer la hora y los minutos
    const hora = fecha.getHours().toString().padStart(2, '0'); // Asegurar que tenga 2 dígitos
    const minutos = fecha.getMinutes().toString().padStart(2, '0'); // Asegurar que tenga 2 dígitos

    // Formatear como "hora:minuto"
    const horaMinuto = `${hora}:${minutos}`;
    this.appStateService.saveHoraAlerta(horaMinuto);
    this.router.navigate(['/selecciona']);
    this.appStateService.stopLoading();
  }

  async checarComunicacion(): Promise<boolean> {
    return await lastValueFrom(this.appBotonServices.checarComunicacionGet())
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
      const contenido: EnviarMensajePostRequest = {
        contenido: `El usuario selecciona el tipo de alerta: ${tipo}`,
      };
      lastValueFrom(
        this.appBotonServices.enviarMensajePost(bearerToken, contenido),
      ).catch((error) => {
        this.appStateService.sendMessageModal({
          title: 'Error',
          message:
            'Error al seleccionar el tipo de alerta, vuelve a intentarlo. ' +
            error,
        });
      });
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

    await lastValueFrom(
      this.appBotonServices.enviarFotoPost(bearerToken, blobFoto),
    ).catch((error) => {
      this.appStateService.sendMessageModal({
        title: 'Error',
        message: 'Error al enviar la foto, vuelve a intentarlo. ' + error,
      });
      throw new Error(error);
    });

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
    const id_dispositivo = await this.appStateService.getIdDispositivo();
    if (!this.appStateService.getIsActiveAlert() || !bearerToken) {
      return null;
    }
    const status: EstadoAtendida201Response = await lastValueFrom(
      this.appBotonServices.estadoAtendida(id_dispositivo),
    ).catch((error) => {
      this.appStateService.sendMessageModal({
        title: 'Error al comunicarse con el servidor',
        message: '<a href="tel:911">Llamar al 911</a>',
      });
      throw new Error(error);
    });

    var statusAlerta: StatusAlerta;
    console.log('Status: ', status.tipo);
    switch (status.tipo) {
      case EstadoAtendida201Response.TipoEnum.Atendida:
        statusAlerta = StatusAlerta.ATENDIDA;
        break;
      case EstadoAtendida201Response.TipoEnum.Rechazada:
        statusAlerta = StatusAlerta.RECHAZADA;
        break;
      case EstadoAtendida201Response.TipoEnum.Otra:
        statusAlerta = StatusAlerta.TerminadaPorTiempo;
        break;
      case EstadoAtendida201Response.TipoEnum.Pendiente:
        statusAlerta = StatusAlerta.PENDIENTE;
        break;
      default:
        statusAlerta = StatusAlerta.ERROR;
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
      const contenido: EnviarMensajePostRequest = {
        contenido: `El usuario manda su ubicación:
        Lugar: ${selectedLugar}
        Especificación: ${ubicacionEspecificacion}`,
      };
      await lastValueFrom(
        this.appBotonServices.enviarMensajePost(bearerToken, contenido),
      ).catch((error) => {
        this.appStateService.sendMessageModal({
          title: 'Error',
          message:
            'Error al enviar la ubicación, vuelve a intentarlo. ' + error,
        });
      });
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

  terminarPorTiempo() {
    const bearerToken = this.appStateService.getBearerToken();
    if (this.appStateService.getIsActiveAlert() && bearerToken) {
      const contenido: EnviarMensajePostRequest = {
        contenido: 'Mansaje automático: Alerta terminada por tiempo',
      };
      lastValueFrom(
        this.appBotonServices.enviarMensajePost(bearerToken, contenido),
      );
    }
    this.appStateService.saveStatusAlerta(StatusAlerta.TerminadaPorTiempo);
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
      const contenido: EnviarMensajePostRequest = {
        contenido: `El usuario manda más información:
        ${textoMasInfo}`,
      };
      await lastValueFrom(
        this.appBotonServices.enviarMensajePost(bearerToken, contenido),
      ).catch((error) => {
        this.appStateService.sendMessageModal({
          title: 'Error',
          message:
            'Error al enviar la información, vuelve a intentarlo. ' + error,
        });
      });
    }
    this.appStateService.stopLoading();
    this.router.navigate(['/send-more-info']);
  }
  cancelarAlerta() {
    this.appStateService.startLoading();
    const bearerToken = this.appStateService.getBearerToken();
    if (this.appStateService.getIsActiveAlert() && bearerToken) {
      const contenido: EnviarMensajePostRequest = {
        contenido: `El usuario Solicita cancelar la alerta`,
      };
      lastValueFrom(
        this.appBotonServices.enviarMensajePost(bearerToken, contenido),
      ).catch((error) => {
        this.appStateService.sendMessageModal({
          title: 'Error',
          message: 'Error al cancelar la alerta, vuelve a intentarlo. ' + error,
        });
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
      const contenido: EnviarMensajePostRequest = {
        contenido: `El usuario manda sus datos:
            Nombre: ${datosUsuario.nombreCompleto}
            Matricula: ${datosUsuario.matricula}
        Telefono: ${datosUsuario.numeroTelefono}
        Correo: ${datosUsuario.correoElectronico}`,
      };
      await lastValueFrom(
        this.appBotonServices.enviarMensajePost(bearerToken, contenido),
      );
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
