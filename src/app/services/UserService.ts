import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import axios from 'axios';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private controllerUrl = 'login';

  constructor(private http: HttpClient) { }
  
  PostLogin(data: any): Promise<any> {

    return axios.post(environment.apiUrl + this.controllerUrl, data
    )
      .then(({ data }: any) => {
        return data;
      })
      .catch(({ response }: any) => {

        const { data } = response

        throw data;
      });
  }

}


