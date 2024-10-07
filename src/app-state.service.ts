import { Injectable } from '@angular/core';
import { Device } from '@capacitor/device';
import { BehaviorSubject } from 'rxjs';
import { TipoAlerta } from './app/domain/tipo-alerta';

@Injectable({
  providedIn: 'root',
})
export class AppStateService {
  private readonly titleSource = new BehaviorSubject<string>(''); // Título inicial
  private readonly backgroundClassSource = new BehaviorSubject<string>(
    'background-default',
  );
  private readonly isLoadingSource = new BehaviorSubject<boolean>(false);
  private readonly isActiveAlertSource: BehaviorSubject<boolean | null> =
    new BehaviorSubject<boolean | null>(null);
  private readonly isUamSource = new BehaviorSubject<boolean | null>(null);
  private readonly tipoAlertaSource = new BehaviorSubject<TipoAlerta | null>(
    null,
  );
  currentTitle = this.titleSource.asObservable();
  currentBackgroundClass = this.backgroundClassSource.asObservable();
  isLoading = this.isLoadingSource.asObservable();
  isActiveAlert = this.isActiveAlertSource.asObservable();
  isUam = this.isUamSource.asObservable();
  tipoAlerta = this.tipoAlertaSource.asObservable();
  constructor() {
    const storedAlertStatus = localStorage.getItem('isActiveAlert');
    const initialAlertStatus =
      storedAlertStatus !== null ? JSON.parse(storedAlertStatus) : false;
    this.isActiveAlertSource.next(initialAlertStatus);
  }

  changeTitle(title: string) {
    this.titleSource.next(title);
  }

  defaultBackground() {
    this.backgroundClassSource.next('background-default');
  }

  changeBackgroundDanger() {
    this.backgroundClassSource.next('background-danger');
  }

  changeBackgroundAzul() {
    this.backgroundClassSource.next('background-blue');
  }

  changeBackgroundGris() {
    this.backgroundClassSource.next('background-gray');
  }

  startLoading() {
    this.isLoadingSource.next(true);
  }

  stopLoading() {
    this.isLoadingSource.next(false);
  }

  startAlert(isUam: boolean | null = false) {
    this.setInUam(isUam);
    this.isActiveAlertSource.next(true);
    localStorage.setItem('isActiveAlert', 'true');
  }

  stopAlert() {
    this.isActiveAlertSource.next(false);
    this.setInUam(null);
    this.isUamSource.next(null);
    localStorage.setItem('isActiveAlert', 'false');
  }
  getAlertStatus(): boolean {
    return this.isActiveAlertSource.value || false;
  }

  // Guarda el ID del dispositivo en localStorage
  saveIdDevice(id: string) {
    localStorage.setItem('id_dispositivo', id);
  }

  // Obtiene el ID del dispositivo desde localStorage
  getIdDevice(): string | null {
    return localStorage.getItem('id_dispositivo');
  }

  // Guarda la localización en localStorage
  saveLocation(location: GeolocationCoordinates) {
    //guardo la hora y el dia en que se guardo la localizacion\
    const date = new Date();
    //la guardo
    localStorage.setItem('date', date + '');
    localStorage.setItem('localizacion', JSON.stringify(location));
  }

  getLocation(): GeolocationCoordinates | null {
    const dateString = localStorage.getItem('date');
    const location = localStorage.getItem('localizacion');
    if (!location) {
      return null;
    }
    if (!dateString) {
      localStorage.removeItem('localizacion');
      return null;
    }
    const date = new Date(dateString);
    const now = new Date();
    if (now.getTime() - date.getTime() > 3600000) {
      localStorage.removeItem('localizacion');
      localStorage.removeItem('date');
      return null;
    }
    return JSON.parse(location);
  }

  // Obtiene la localización actual del dispositivo
  public async getLocalizacion(): Promise<GeolocationCoordinates> {
    if (!navigator.geolocation) {
      throw new Error('Geolocalización no es compatible con este navegador.');
    }
    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        },
      );
      return position.coords;
    } catch (error) {
      console.error('Error al obtener la localización:', error);
      const savedLocation = this.getLocation();
      if (savedLocation) {
        return savedLocation;
      } else {
        throw new Error(
          'No se pudo obtener la localización y no hay una localización guardada.',
        );
      }
    }
  }
  public async getIdDispositivo(): Promise<string> {
    try {
      let id = this.getIdDevice();
      if (id) {
        return id;
      }
      const device = await Device.getId();
      this.saveIdDevice(device.identifier);
      return device.identifier;
    } catch (error) {
      console.error('Error al obtener el ID del dispositivo:', error);
      const savedId = this.getIdDevice();
      if (savedId) {
        return savedId;
      } else {
        throw new Error(
          'No se pudo obtener el ID del dispositivo y no hay un ID guardado.',
        );
      }
    }
  }

  setInUam(isUam: boolean | null) {
    this.isUamSource.next(isUam);
    if (isUam === null) {
      localStorage.removeItem('isUam');
    } else {
      localStorage.setItem('isUam', isUam.toString());
    }
  }

  getIsUam(): boolean | PromiseLike<boolean | null> | null {
    const isUam = localStorage.getItem('isUam');
    if (isUam === null) {
      this.isUamSource.next(null);
      return null;
    }
    this.isUamSource.next(isUam === 'true');
    return isUam === 'true';
  }
  guardarTipoAlerta(tipo: TipoAlerta | null) {
    this.tipoAlertaSource.next(tipo);
    if (tipo === null) {
      localStorage.removeItem('tipoAlerta');
    } else {
      localStorage.setItem('tipoAlerta', tipo);
    }
  }
  getTipoAlerta(): TipoAlerta | null {
    const tipo = localStorage.getItem('tipoAlerta');
    if (tipo === null) {
      this.tipoAlertaSource.next(null);
      return null;
    }
    this.tipoAlertaSource.next(tipo as TipoAlerta);
    return tipo as TipoAlerta;
  }
}
