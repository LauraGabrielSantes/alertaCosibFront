import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppStateService } from 'src/app-state.service';

@Injectable({
  providedIn: 'root',
})
export class BotonService {
  constructor(
    private readonly appStateService: AppStateService,
    private readonly router: Router,
  ) {}

  sendAlert() {
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
}
