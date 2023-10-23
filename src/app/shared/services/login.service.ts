import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginRequest } from '@models/login-request';
import { Observable } from 'rxjs';
import { LoginResponse } from '@models/login-response';
@Injectable()
export class LoginService {
  private controllerUrl = 'login';
  constructor(private http: HttpClient) { }

  public authenticate(loginRequest: LoginRequest): Observable<LoginResponse>{
    return this.http.post<LoginResponse>(this.controllerUrl + '/authenticate', loginRequest);
  }
}
