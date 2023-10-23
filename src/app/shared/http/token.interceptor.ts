import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { GeneralConstant } from '@utils/general-constant';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MensajeService } from './mensaje.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    public mensajeService: MensajeService,
    private router: Router
  ) {}

  private readonly mensajeError = 'Ocurrió un error inesperado, favor de contactar al administrador del sistema.';

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token = null;
    localStorage.getItem(GeneralConstant.TOKEN_KEY);
    let newRequest = null;

    if (request.url === 'login/authenticate') {
      newRequest = request.clone({
        url: environment.apiUrl + request.url
      });
    }
    else {
      newRequest = request.clone({
        url: environment.apiUrl + request.url,
        setHeaders: {
          'Content-Type': 'application/json, text/plain',
          'Access-Control-Allow-Origin':"*"
        }
      });
    }

    return next.handle(newRequest).pipe(
      catchError((error) => {
        // Excepciones controladas por el backend
        if (error.status === 409) {
          if (error.error instanceof Blob) {
            var reader = new FileReader();

            reader.onload = (params) => {
              if (reader.result){
                this.mensajeService.error(reader.result.toString());
              }
            }

            reader.readAsText(error.error);
          }
          else {
            this.mensajeService.error(error.error);
          }
        }
        // Mantenimiento
        else if (error.status === 503) {
          window.location.reload();
        }
        // Unauthorized
        else if (error.status === 401) {
          if (this.router.url.includes('administrador')) {
            localStorage.removeItem(GeneralConstant.TOKEN_KEY);
            this.router.navigate(['/login']);
          }
        }
        // Errores inesperados
        else if (error.status === 500) {
          this.mensajeService.error(this.mensajeError);
        }

        if (!environment.production) {
          console.error(error);
        }

        return throwError(() => error);
      })
    );
  }
}
