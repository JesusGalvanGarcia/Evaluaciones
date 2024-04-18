import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import axios from 'axios';
import { environment } from 'src/environments/environment';


@Injectable({
    providedIn: 'root',
})
export class ToolService {
    private controllerUrl = 'tools';

    constructor(private http: HttpClient) { }

    public getTools(user:any): Promise<any> {
        let data = {
            user_id: Number(user),
        };
        return axios
            .get(environment.apiUrl + this.controllerUrl+"/roles/getMenu", {
                params: data,
            })
            .then((response) => {
                return response.data.access;
            })
            .catch(function (error: any) {
                throw error;
            });
    }
    public hasAccess(user:any,keys:any): Promise<any> {
        let data = {
            user_id: Number(user),
            permission: keys,
        };
        return axios
            .post(environment.apiUrl + this.controllerUrl+"/permissions/checkGuard", data
            )
            .then((response) => {
                return response.data.access;
            })
            .catch(function (error: any) {
                throw error;
            });
    }
    public getLinks(user:any): Promise<any> {
        let data = {
            user_id: Number(user),
        
        };
        return axios
            .get(environment.apiUrl + this.controllerUrl+"/getLinks", {
                params: data,
            })
            .then((response) => {
                return response.data.access;
            })
            .catch(function (error: any) {
                return error;
            });
    }
}
