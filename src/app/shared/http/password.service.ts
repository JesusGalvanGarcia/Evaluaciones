import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResetPasswordRequest } from '@models/resetPassword';
import { Observable } from 'rxjs';

@Injectable()
export class PassWordService {
  private controllerUrl = 'users';
  constructor(private http: HttpClient) { }

  public sendResetPass(pass: ResetPasswordRequest): Observable<ResetPasswordRequest>{
    return this.http.post<ResetPasswordRequest>(this.controllerUrl + '/resetPassWord', pass);
  }
}
