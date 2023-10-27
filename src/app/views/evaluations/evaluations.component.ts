import { TablePersonalModule } from './../TablePersonal/TablePersonal.module';
import { Component, OnInit ,ViewChild} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { HttpClient } from '@angular/common/http';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {animate, state, style, transition, trigger} from '@angular/animations';
import{TablesModule} from '../Tables/Tables.module';
import { Router } from '@angular/router';
import { MensajeService } from '@http/mensaje.service';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';


@Component({
  selector: 'app-evaluations',
  
  standalone:true,
  imports: [
    CommonModule, FormsModule,CdkTableModule,AgGridModule,MatIconModule,TablesModule,TablePersonalModule,MatTableModule],
  templateUrl: './evaluations.component.html',
  styleUrls: ['./evaluations.component.scss'],
 
})

export class EvaluationsComponent implements OnInit {
protected  isChecked: boolean = true;

constructor(private http: HttpClient,private router: Router,public message:MensajeService) {}



  ngOnInit() {
   
  }
  getUser() {
    var user=localStorage.getItem("email");
    if(user=="")
    {
      this.router.navigate(['/login']);
      this.message.error("Tienes que iniciar sesion");

    }

    return user;
  }
  enviarFormulario(form: NgForm){
    this.onSwitchChange() 
  }
  onSwitchChange() {
    // Acciones a realizar cuando cambia el estado del switch
    this.isChecked=!this.isChecked;
    console.log(this.isChecked)
  }
}
