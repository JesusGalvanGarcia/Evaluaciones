import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'intranet-app';
  constructor(public router: Router) {}
  isLoginPage(): boolean {
    const loginRoutes = ['/login', '/sendEmail'];
    const currentUrl = this.router.url;
  
    // Verificar rutas exactas
    if (loginRoutes.includes(currentUrl)) {
      return true;
    }
  
    // Verificar ruta con parámetros dinámicos
    const resetPasswordRouteRegex = /^\/resetPassword\/[^/]+$/;
    if (resetPasswordRouteRegex.test(currentUrl)) {
      return true;
    }
  
    return false;
  }
}
