import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MensajeService } from '@http/mensaje.service';


import axios from 'axios';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AsesoresService {
  private controllerUrl = 'asesores';
  private api_conect: any;
  constructor(private http: HttpClient, public messageService: MensajeService) {
 
  }

  GetExam(data: any, id: number): Promise<any> {
  
    return axios.get(environment.apiUrl+this.controllerUrl+ "/"+ id,  {
      params: data
    })
    .then((data) => {
       
        return data;
      })
      .catch((response) => {

        const { data } = response
       
        throw data;
      });
  }
  AssingAsesors(data: any): Promise<any> {

    return axios.post(environment.apiUrl + this.controllerUrl+"/assignAsesors", data
    )
      .then(({ data }: any) => {
        return data;
      })
      .catch(({ response }: any) => {

        const { data } = response

        throw data;
      });
  }
  async SendTestEvaluation(data: any): Promise<any> {

    return axios.post(environment.apiUrl +this.controllerUrl+  "/saveAnswerAsesores", data)
      .then(({ data }: any) => {
        
        return data;
      })
      .catch(({ response }: any) => {

        const { data } = response
      
        throw data;
      });
  }
 


 

}


