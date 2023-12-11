import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { GeneralConstant } from '@utils/general-constant';
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  constructor( public router: Router) { }
   canActivate(){
if(Number(localStorage.getItem("user_id"))==96||Number(localStorage.getItem("user_id"))==95||Number(localStorage.getItem("user_id"))==67||Number(localStorage.getItem("user_id"))==16)
{
    return true;
}
  else{
    return false;
  }
  }
}