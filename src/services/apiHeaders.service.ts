import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from, switchMap } from 'rxjs';
import { AppStateService } from './app-state.service';

@Injectable()
export class HeaderService implements HttpInterceptor {
  private _token: string = '';
  private _idTransaccion: string = '';
  constructor(private readonly appStateService: AppStateService) {
    this.init();
  }
  private async init() {
    let token = await this.appStateService.getBearerToken();
    if (!token) {
      return;
    }
    this._token = token;
  }
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    let modifiedReq = req.clone({
      headers: req.headers.set('x-id-transaccion', req.url),
    });
    return from(this.init()).pipe(
      switchMap(() => {
        //obtengo la url que se esta llamando
        let url = req.url;
        let idSolicitud: string = url.split('/').pop() || '';
        this._idTransaccion += '.' + idSolicitud;
        modifiedReq = modifiedReq.clone({
          headers: modifiedReq.headers,
        });
        if (!this._token) {
          return next.handle(modifiedReq);
        }
        modifiedReq = modifiedReq.clone({
          headers: modifiedReq.headers.set(
            'Authorization',
            `Bearer ${this._token}`,
          ),
        });
        return next.handle(modifiedReq);
      }),
    );
  }
}
