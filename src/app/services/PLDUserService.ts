import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import axios from 'axios';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class PLDUserService {
  private controllerUrl = 'PLDUser';

  constructor(private http: HttpClient) { }
  
  GetExamns(data: any): Promise<any> {

    return axios.get(environment.apiUrl + this.controllerUrl, {
      params: data
    })
      .then(({ data }: any) => {
        return data;
      })
      .catch(({ response }: any) => {

        const { data } = response

        throw data;
      });
  }
  async SendTestPLD(data: any): Promise<any> {

    return axios.post(environment.apiUrl +this.controllerUrl+  "/saveAnswerPLD", data)
      .then(({ data }: any) => {
        
        return data;
      })
      .catch(({ response }: any) => {

        const { data } = response
      
        throw data;
      });
  }
  GetDetail(data: any,id:number): Promise<any> {

    return axios.get(environment.apiUrl + this.controllerUrl+"/"+id ,{
      params: data
    })
      .then(({ data }: any) => {
        return data;
      })
      .catch(({ response }: any) => {

        const { data } = response

        throw data;
      });
  }

}



