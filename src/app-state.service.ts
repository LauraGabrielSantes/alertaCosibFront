import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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

  currentTitle = this.titleSource.asObservable();
  currentBackgroundClass = this.backgroundClassSource.asObservable();
  isLoading = this.isLoadingSource.asObservable();
  isActiveAlert = this.isActiveAlertSource.asObservable();

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

  startAlert() {
    this.isActiveAlertSource.next(true);
    localStorage.setItem('isActiveAlert', 'true');
  }

  stopAlert() {
    this.isActiveAlertSource.next(false);
    localStorage.setItem('isActiveAlert', 'false');
  }
  getAlertStatus(): boolean {
    return this.isActiveAlertSource.value || false;
  }
}
