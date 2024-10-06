import { Injectable } from '@angular/core';
import { AppStateService } from 'src/app-state.service';

@Injectable({
  providedIn: 'root',
})
class BotonService {
  constructor(private appStateService: AppStateService) {}

  sendAlert() {
    console.log('BotonService');
  }
  async checarComunicacion(): Promise<boolean> {
    console.log('Checar Comunicación');
    return true;
  }
}
