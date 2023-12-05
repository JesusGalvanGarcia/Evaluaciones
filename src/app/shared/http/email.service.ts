import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EmailRequest } from '@models/email-request';
import { Observable } from 'rxjs';

@Injectable()
export class EmailService {
  private controllerUrl = 'users';
  constructor(private http: HttpClient) { }

  public sendEmail(loginRequest: EmailRequest): Observable<EmailRequest>{
    return this.http.post<EmailRequest>(this.controllerUrl + '/sendEmail', loginRequest);
  }
}
