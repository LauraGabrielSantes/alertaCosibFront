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

  currentTitle = this.titleSource.asObservable();
  currentBackgroundClass = this.backgroundClassSource.asObservable();

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
}
