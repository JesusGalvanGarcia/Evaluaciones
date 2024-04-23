import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
//mport { AuthService } from './auth.service';
import { GeneralConstant } from '@utils/general-constant';
import { MensajeService } from '@http/mensaje.service';
import {ToolService} from '@services/tools.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(public tools :ToolService,public router: Router,public message:MensajeService) { }

  public async canActivate(route: ActivatedRouteSnapshot): Promise<boolean>{
    const requiredPermission = route.data['permission'];
 try{
  const hasAccess = await this.tools.hasAccess(Number(localStorage.getItem("user_id")),requiredPermission);
  if(!hasAccess)
  {
    this.message.warning("No tienes acceso a esta pagina");
    this.router.navigate(['home']);

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
