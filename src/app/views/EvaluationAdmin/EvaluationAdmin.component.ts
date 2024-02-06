import { state } from '@angular/animations';
import { CommonModule, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { AnswerFormDTO } from '@dtos/catalog/answers-form-dto';
import { UserPldGridDTO } from '@dtos/security/user-grid-dto';
import { MensajeService } from '@http/mensaje.service';
import { GridModule } from '@sharedComponents/grid/grid.module';
import * as Utilities from '@utils/utilities';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent, IRowNode } from 'ag-grid-community';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TestsService } from '@services/test.service';
import { UsersService } from '@services/user.service';
import { QuestionFormDTO } from '../../shared/entities/dtos/catalog/question-form-dto';
import { TestFormDTO } from '../../shared/entities/dtos/catalog/tests-form-dto';
import { TestModuleFormDTO } from '@dtos/catalog/test-modules-form-dto';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { LoadingComponent } from 'src/app/views/loading/loading.component';
import { AG_GRID_LOCALE_ES } from 'src/locale.es';
import { ConfirmationModalComponent } from '@sharedComponents/confirmation-modal/confirmation-modal.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { GeneralConstant } from '@utils/general-constant';
import { GridActions } from '@utils/grid-action';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Module } from '@models/testDetails/module';
import { Evaluation } from '@models/evaluations/evaluations';
import{EvaluationTest} from '@models/testDetails/evaluationTest';
@Component({
  selector: 'app-EvaluationAdmin',
  templateUrl: './EvaluationAdmin.component.html',
  styleUrls: ['./EvaluationAdmin.component.css'],
  standalone:true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatInputModule,
    MatDatepickerModule,
    FormsModule,
    AccordionModule,
    MatRadioModule,
    MatCardModule,
    GridModule,
    AgGridModule,
    BsDatepickerModule,
    LoadingComponent
  ],
  
    providers:
    [
        BsModalService
    ]
})
export class EvaluationAdminComponent implements OnInit {
  protected accion: string = GridActions.ADD;
  protected selectedIndex: number = 0;
  protected moduls:Module[];
  protected modules:Module;
  evaluation: Evaluation = {
    id: 0,
    name: "",
    start_date: "",
    end_date: "",
    frequency_id: "Frequency.Daily",  // Asigna el valor predeterminado deseado
    type_id: "Type.DefaultType",  // Asigna el valor predeterminado deseado
    process_id: "Process.DefaultProcess",  // Asigna el valor predeterminado deseado
    status_id: "1",  // Asigna el valor predeterminado deseado
    created_by: "",
    updated_by: "",
    deleted_by: null,
    created_at: "",
    updated_at: "",
    deleted_at: null,
  };
  protected test:EvaluationTest;


  constructor(
      private testsService: TestsService,
      private usersService: UsersService,
      private mensajeService: MensajeService,
      private modalService: BsModalService,
      private activatedRoute: ActivatedRoute,
      private router: Router
  ) { }

  async ngOnInit() 
   {

    console.log(this.evaluation)
    console.log(this.modules)

   }
   
   protected goBack() {
    this.router.navigate(['/dashboard/exam/adminPld']);
}
protected addModule()
{
   this.moduls.push(this.modules);
}
protected removeModule(): void {
  if (this.moduls.length > 1) {
      this.moduls.pop();
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }
}
protected addQuestion(id:any):void{

}
protected removeQuestion(id:any):void{

}
protected previousStep() {
  if (this.selectedIndex != 0) {
      this.selectedIndex = this.selectedIndex - 1;
  }
}
protected nextStep(form: NgForm) {
     
  if (this.selectedIndex == 0) {
      this.selectedIndex = this.selectedIndex + 1;
  }
  else
  {
      if (form.invalid) {
          
          Utilities.validateRequiredFields(form);
           if(this.selectedIndex==1)
           this.mensajeService.error('Falta llenar campos de preguntas y respuestas.');
          return;
      }
      else
      {
          this.selectedIndex = this.selectedIndex + 1;

      }
  }
}
  /**
   * Gets the idPldTest from the route
   */
  
}
