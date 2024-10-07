import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppStateService } from 'src/app-state.service';
import { TipoAlerta } from 'src/app/domain/tipo-alerta';

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
    console.log('Checar Comunicación');
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
    //espero 1 segundo
    await new Promise((resolve) => setTimeout(resolve, 1000));
    this.appStateService.stopLoading();
  }
  async sendUbicacion(selectedLugar: string, ubicacionEspecifica: string) {
    this.appStateService.startLoading();
    console.log('Ubicación: ', selectedLugar, ubicacionEspecifica);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    this.appStateService.stopLoading();
    this.router.navigate(['/send-more-info']);
  }
  async sendMasInfo(textoMasInfo: string) {
    this.appStateService.startLoading();
    console.log('Más información: ', textoMasInfo);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    this.appStateService.stopLoading();
    this.router.navigate(['/send-more-info']);
  }
}
