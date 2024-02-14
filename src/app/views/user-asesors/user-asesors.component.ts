import { MensajeService } from '@http/mensaje.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import{Evaluation360Service} from '../../shared/services/evaluation360.service';
import { MatCardModule } from '@angular/material/card';
import { LoadingComponent } from '../loading/loading.component';
import { CommonModule } from '@angular/common';
import { GridModule } from '@sharedComponents/grid/grid.module';
import { GridActions } from '@utils/grid-action';
import { ColDef } from 'ag-grid-community';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AngularDualListBoxModule } from 'angular-dual-listbox';
import { FormsModule } from '@angular/forms';  // Asegúrate de importar FormsModule

@Component({
  selector: 'app-user-asesors',
  templateUrl: './user-asesors.component.html',
  styleUrls: ['./user-asesors.component.css'],
  standalone:true,
  imports:[CommonModule,MatCardModule, FormsModule, LoadingComponent,GridModule,AngularDualListBoxModule]

})
export class UserAsesorsComponent implements OnInit {

  evaluation_id:any;
  evaluationData: any;
  UsersData: any;
  isLoading: boolean = true;
  start:boolean=true;
  dualListForm: FormGroup;
  selectList: any[];
  selectedItems: any[] ;
  idUser:any;
  filterText: string = '';
  actualUser:string='Asignar Evaluacion  de asesores';
  filteredSource: any[];
  format = {
		add: 'Agregar',
		remove: 'Remover',
		all: 'Todos',
		none: 'Ninguno',
		direction: 'left-to-right',
		draggable: true,
		locale: undefined
	};
  constructor(private fb: FormBuilder,public message:MensajeService,public evaluation360:Evaluation360Service, public router:Router,   private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.evaluation_id = params['idEvaluation']; 
  
    });

   }
   public seeDetailButton:ColDef = Object.assign(
    {
      cellRendererSelector: (params: any) => {
        const component = { component: 'gridActionButton',
        params: { 
          action:  GridActions.Start,
          icon: 'fa-solid fa-arrow-right',
          title:'Ir'
        }
      };
      return component;
      }
    },
    GridActions.DEFAULT_COLUMN
  )
  protected columnDefsUsers: ColDef[] = [
    { headerName: 'Nombre', field: 'collaborator_name',  },
    this.seeDetailButton
  
  ]
  back()
  {
    this.start=true;
    this.actualUser="Asignar Evaluacion  de asesores"
  }
  ngOnInit() {
    let data = {
      user_id: Number(localStorage.getItem("user_id")),

    };
    this.getUsers(data);
  }
  onItemChange(selectedItems: any[]) {
    this.selectedItems = selectedItems;
    
  }
  send()
  {
  
    this.isLoading=true;
    let data = {
      user_id: Number(localStorage.getItem("user_id")),
      users:this.selectedItems,
      evaluation_id:this.evaluation_id,
      responsable_id:this.idUser
    };
    this.evaluation360.AssingAsesors(data)  //Cargar examen
    .then((response: any) => {
      this.message.success("Los usuarios se agregaron correctamente");
      this.isLoading=false;
      this.start=true;
   

    })
    .catch((error: any) => {
      this.isLoading=false;

      console.error('Error in the request:', error);
      this.message.error("No se pudieron cargar los usuarios "+error);
      // Handle errors here
    });
  }
  getUsers(data: any) {
 
   
    this.evaluation360.GetUsersAssing360(data)  //Cargar examen
      .then((response: any) => {
        this.UsersData = response.evaluations;
       
        this.isLoading=false;
      })
      .catch((error: any) => {
        this.isLoading=false;

        console.error('Error in the request:', error);
        this.message.error("No se pudieron cargar las evaluaciones "+error);
        // Handle errors here
      });
  }
  getUsersAssing(data: any) {
   
    this.evaluation360.GetAssing360(data)  //Cargar examen
      .then((response: any) => {
        this.isLoading=false;
        this.start=false;
        this.selectedItems = response.existingRecords.map((item :any)=> ({ ...item, id: Number(item.id) }));
      })
      .catch((error: any) => {
        this.isLoading=false;

        console.error('Error in the request:', error);
        this.message.error("No se pudieron cargar las evaluaciones "+error);
        // Handle errors here
      });
  }
  protected onActionEventUser(actionEvent: { action: string, data: any }) 
  {
    this.isLoading=true;
    this.actualUser=actionEvent.data.collaborator_name;
    this.idUser=actionEvent.data.id;
    let data = {
      user_id: Number(localStorage.getItem("user_id")),
      users:this.selectedItems,
      evaluation_id:this.evaluation_id,
      responsable_id:this.idUser
    };
    this.start=false;
    this.isLoading=false;
    this.selectedItems=[];
    //this.getUsersAssing(data);
  }


}
