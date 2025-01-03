import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router,RouterStateSnapshot } from '@angular/router';
//mport { AuthService } from './auth.service';
import { MensajeService } from './/mensaje.service';
@Injectable({
  providedIn: 'root'
})
export class AuthSecondGuardService implements CanActivate {

  constructor(public router: Router,public message:MensajeService) { }

  public async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean>{
 try{
  if(localStorage.getItem("user_id")=="")
  {
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });

    this.message.warning("No tienes acceso a esta pagina");

    return false;
  }
  else
  return true;
 }
  catch(error)
  {
    console.error('Error en la sesion:', error);
    // Realizar la acción adicional, como redirigir a una página de error o mostrar un mensaje de error
    this.message.error("Ocurrió un error al verificar tu acceso");
    this.router.navigate(['login ']);
    return false;
  }
 
  }
}
