import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterUserDTO } from '@dtos/security/register-user-dto';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private controllerUrl = 'users';
    constructor(private http: HttpClient) { }

    public AddUser(userRegister: RegisterUserDTO): Observable<number> {
        return this.http.post<number>(this.controllerUrl, userRegister);
    }
}