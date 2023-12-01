import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import axios from 'axios';
import { environment } from 'src/environments/environment';
import { UserPldGridDTO } from '@dtos/security/user-grid-dto';
@Injectable({
    providedIn: 'root',
})
export class UsersService {
    private controllerUrl = 'user';

    constructor(private http: HttpClient) { }

    public GetUserGridDTO(): Promise<UserPldGridDTO[]> {
        let data = {
            user_id: Number(localStorage.getItem('user_id')),
            collaborators_id: [],
            evaluations_id: [],
        };
        return axios
            .get(environment.apiUrl + this.controllerUrl, {
                params: data,
            })
            .then((response) => {
                return response.data.users;
            })
            .catch(function (error: any) {
                return error;
            });
    }
}
