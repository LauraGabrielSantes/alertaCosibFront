import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  Enviado,
  EnviarTipo,
  StatusAlerta,
  TipoAlerta,
} from 'src/domain/alerta';
import { AppStateService } from './app-state.service';

@Injectable({
  providedIn: 'root',
})
export class BotonService {
  constructor(
    private readonly appStateService: AppStateService,
    private readonly router: Router,
  ) {}

  async sendAlert() {
    this.appStateService.startLoading();
    this.appStateService.startAlert(true);
    this.router.navigate(['/selecciona']);
    this.appStateService.stopLoading();
  }

  cancelarAlerta() {
    this.appStateService.startLoading();
    this.appStateService.stopAlert();
    this.appStateService.stopLoading();
    this.router.navigate(['']);
  }

  async checarComunicacion(): Promise<boolean> {
    return true;
  }
  seleccionarTipoAlerta(tipo: TipoAlerta) {
    this.appStateService.startLoading();
    this.appStateService.guardarTipoAlerta(tipo);
    this.appStateService.stopLoading();
    this.router.navigate(['/send-more-info']);
  }

  async sendFoto(blobFoto: Blob) {
    this.appStateService.startLoading();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const fotoBase64 = await this.blobToBase64(blobFoto);
    const enviado: Enviado = {
      tipo: EnviarTipo.FOTOGRAFIA,
      foto: fotoBase64,
    };
    this.appStateService.saveEnviado(enviado);
    this.appStateService.stopLoading();
  }

  async sendUbicacion(selectedLugar: string, ubicacionEspecificacion: string) {
    this.appStateService.startLoading();
    console.log('Ubicación: ', selectedLugar, ubicacionEspecificacion);
    await new Promise((resolve) => setTimeout(resolve, 1000));
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

    await new Promise((resolve) => setTimeout(resolve, 1000));
    this.appStateService.stopLoading();
    this.router.navigate(['/send-more-info']);
  }

  async blobToBase64(blobFoto: Blob): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blobFoto);
    });
  }
  getStatusAlerta(): StatusAlerta | null {
    this.appStateService.saveStatusAlerta(StatusAlerta.ACTIVA);
    return StatusAlerta.ACTIVA;
  }
}
