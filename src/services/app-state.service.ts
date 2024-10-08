import { Injectable } from '@angular/core';
import { Device } from '@capacitor/device';
import { BehaviorSubject } from 'rxjs';
import {
  Enviado,
  MessageModal,
  StatusAlerta,
  TipoAlerta,
} from 'src/domain/alerta';

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
  private readonly enviadosSource = new BehaviorSubject<Enviado[]>([]);
  private readonly statusAlertaSource =
    new BehaviorSubject<StatusAlerta | null>(null);
  private readonly MessageModalSource =
    new BehaviorSubject<MessageModal | null>(null);
  currentTitle = this.titleSource.asObservable();
  currentBackgroundClass = this.backgroundClassSource.asObservable();
  isLoading = this.isLoadingSource.asObservable();
  isActiveAlert = this.isActiveAlertSource.asObservable();
  isUam = this.isUamSource.asObservable();
  tipoAlerta = this.tipoAlertaSource.asObservable();
  enviados = this.enviadosSource.asObservable();
  statusAlerta = this.statusAlertaSource.asObservable();
  messageModal = this.MessageModalSource.asObservable();
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
    this.tipoAlertaSource.next(null);
    this.enviadosSource.next([]);
    this.statusAlertaSource.next(null);
    localStorage.removeItem('isUam');
    localStorage.removeItem('tipoAlerta');
    localStorage.removeItem('enviados');
    localStorage.removeItem('statusAlerta');
    localStorage.setItem('isActiveAlert', 'false');
  }
  getIsActiveAlert(): boolean {
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

  private getLocation(): GeolocationCoordinates | null {
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

  public setInUam(isUam: boolean | null) {
    this.isUamSource.next(isUam);
    if (isUam === null) {
      localStorage.removeItem('isUam');
    } else {
      localStorage.setItem('isUam', isUam.toString());
    }
  }

  public getIsUam(): boolean | PromiseLike<boolean | null> | null {
    const isUam = localStorage.getItem('isUam');
    if (isUam === null) {
      this.isUamSource.next(null);
      return null;
    }
    this.isUamSource.next(isUam === 'true');
    return isUam === 'true';
  }
  public guardarTipoAlerta(tipo: TipoAlerta | null) {
    this.tipoAlertaSource.next(tipo);
    if (tipo === null) {
      localStorage.removeItem('tipoAlerta');
    } else {
      localStorage.setItem('tipoAlerta', tipo);
    }
  }
  public getTipoAlerta(): TipoAlerta | null {
    const tipo = localStorage.getItem('tipoAlerta');
    if (tipo === null) {
      this.tipoAlertaSource.next(null);
      return null;
    }
    this.tipoAlertaSource.next(tipo as TipoAlerta);
    return tipo as TipoAlerta;
  }

  public saveEnviado(enviado: Enviado) {
    let enviadosStr = localStorage.getItem('enviados');
    let enviados: Enviado[];
    if (enviadosStr) {
      enviados = JSON.parse(enviadosStr);
    } else {
      enviados = [];
    }
    enviados.push(enviado);
    localStorage.setItem('enviados', JSON.stringify(enviados));
    this.enviadosSource.next(enviados);
  }

  public getEnviados(): Enviado[] {
    if (this.enviadosSource.value.length > 0) {
      return this.enviadosSource.value;
    }
    let enviadosStr = localStorage.getItem('enviados');
    if (!enviadosStr) {
      return [];
    }
    const enviados = JSON.parse(enviadosStr);
    this.enviadosSource.next(enviados);
    return enviados;
  }

  public saveStatusAlerta(status: StatusAlerta) {
    this.statusAlertaSource.next(status);
    localStorage.setItem('statusAlerta', status);
  }
  public getStatusAlerta(): StatusAlerta | null {
    const status = localStorage.getItem('statusAlerta');
    if (status === null) {
      this.statusAlertaSource.next(null);
      return null;
    }
    this.statusAlertaSource.next(status as StatusAlerta);
    return status as StatusAlerta;
  }
  public sendMessageModal(message: MessageModal) {
    this.MessageModalSource.next(message);
  }
  public getMessageModal(): MessageModal | null {
    return this.MessageModalSource.value;
  }
  public saveHoraAlerta(hora: string) {
    localStorage.setItem('horaAlerta', hora.toString());
  }
  public getHoraAlerta(): string {
    return localStorage.getItem('horaAlerta') ?? '';
  }
  public getBearerToken(): string | null {
    return localStorage.getItem('bearerToken');
  }
  public saveBearerToken(token: string) {
    localStorage.setItem('bearerToken', token);
  }
}
