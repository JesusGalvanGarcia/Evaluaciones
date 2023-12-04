import { Injectable } from '@angular/core';
import { TestPldGridDTO } from '@dtos/catalog/test-pld-grid-dto';
import { TestFormDTO } from '@dtos/catalog/tests-form-dto';
import axios from 'axios';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class TestsService {
    private controllerUrl = 'test/';
    private api_conect: any;

    constructor() {
        this.api_conect = axios.create({
            baseURL: environment.apiUrl,
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': 'Bearer ' + this.token
            },
        })
     }

    public getPldGridDTO(): Promise<TestPldGridDTO[]> {
        let data = {
            user_id: Number(localStorage.getItem('user_id')),
        };
        return axios
            .get(environment.apiUrl + this.controllerUrl + 'pld', {
                params: data,
            })
            .then((response) => {
                return response.data.tests;
            })
            .catch(function (error: any) {
                return error;
            });
    }

    public getPldFormDTO(idPldTest: number): Promise<{test: TestFormDTO, assigned_users: string[]}> {
        let data = {
            user_id: Number(localStorage.getItem('user_id')),
        };
        return axios
            .get(environment.apiUrl + this.controllerUrl + `pldForm/${idPldTest}`, {
                params: data,
            })
            .then((response) => {
                return response.data;
            })
            .catch(function (error: any) {
                return error;
            });
    }

    public postPldTest(formDTO: TestFormDTO): Promise<any> {
        let data = {
            user_id: Number(localStorage.getItem('user_id')),
            test: formDTO,
            assigned_users: formDTO.assigned_users,
        };
        return axios.post(environment.apiUrl+this.controllerUrl + 'pld', data)
        .then((response) => {
            return response.data.tests;
        })      
        .catch(function (error: any) {
            return error;
        });
    }
    public putPldTest(formDTO: TestFormDTO): Promise<any> {
        let data = {
            user_id: Number(localStorage.getItem('user_id')),
            test: formDTO,
            assigned_users: formDTO.assigned_users,
        };
        return axios.put(environment.apiUrl+this.controllerUrl + `pldForm/${formDTO.id}`, data)
        .then((response) => {
            return response.data.tests;
        })
        .catch(function (error: any) {
            throw error;
        });
    }

    public delete(id: number): Promise<any> {
        let data = {
            user_id: Number(localStorage.getItem('user_id')),
        };
        return this.api_conect.delete(this.controllerUrl + 'pld/' + id, data)
        .then(({ data }: any) => {
            return data;
        })
        .catch(({ response }: any) => {

            const { data } = response
            
            throw data;
        });
    }
}
