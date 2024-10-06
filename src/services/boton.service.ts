import { Injectable } from '@angular/core';
import { AppStateService } from 'src/app-state.service';

@Injectable({
  providedIn: 'root',
})
export class BotonService {
  constructor(private appStateService: AppStateService) {}

  sendAlert() {
    this.appStateService.startLoading();
    if (this.appStateService.getAlertStatus()) {
      this.appStateService.stopAlert();
      return;
    }
    this.appStateService.startAlert();
    console.log('BotonService');
  }
  async checarComunicacion(): Promise<boolean> {
    console.log('Checar Comunicación');
    return true;
  }
}
