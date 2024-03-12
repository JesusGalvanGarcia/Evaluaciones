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
import { TestsService } from '@services/Evaluations/Desempeño/test.service';
import { UsersService } from '@services/user.service';
import { QuestionFormDTO } from '../../../../shared/entities/dtos/catalog/question-form-dto';
import { TestFormDTO } from '../../../../shared/entities/dtos/catalog/tests-form-dto';
import { TestModuleFormDTO } from '@dtos/catalog/test-modules-form-dto';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { LoadingComponent } from 'src/app/views/app/loading/loading.component';
import { AG_GRID_LOCALE_ES } from 'src/locale.es';
import { ConfirmationModalComponent } from '@sharedComponents/confirmation-modal/confirmation-modal.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { GeneralConstant } from '@utils/general-constant';
import { GridActions } from '@utils/grid-action';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

// import { RowGroupingModule } from '@ag-grid-enterprise/row-grouping';

@Component({
    selector: 'app-pldForm',
    templateUrl: './pldForm.component.html',
    standalone: true,
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
        // RowGroupingModule
    ],
    providers:
    [
        BsModalService
    ]
})
export class PldFormComponent implements OnInit {
    private idPldTest: number;
    protected testFormDTO = new TestFormDTO();
    protected accion: string = GridActions.ADD;
    protected questions: QuestionFormDTO[] = [];
    protected assigned_users: string[] = [];
    protected disableSubmit: boolean = false;
    protected isLoading: boolean = false;
    protected disableMaxAttempts = false;

    public autoGroupColumnDef: ColDef = {
        headerName: 'Nombre',
        field: 'complete_name',
        filter: true,
        floatingFilter: true,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true,
        minWidth: 250,
        cellRenderer: 'agGroupCellRenderer',
        flex: 1,
    };

    public localeText: {
        [key: string]: string;
    } = AG_GRID_LOCALE_ES;

    public columnDefs: ColDef[] = [
        { headerName: 'id', field: 'id', hide: true },
        { headerName: 'Área', field: 'area_name', filter: 'agTextColumnFilter',  floatingFilter: true, sortable:true, rowGroup: true },
    ];

    protected usersList: UserPldGridDTO[];

    protected selectedIndex: number = 0;
    private gridApi!: GridApi;


    constructor(
        private testsService: TestsService,
        private usersService: UsersService,
        private mensajeService: MensajeService,
        private modalService: BsModalService,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) { }

    async ngOnInit() {
        await this.getUrlParams();
        if (this.idPldTest > 0) {
            this.loadTestForEditing();
        }
        this.getCollaborators();
        if (this.questions.length === 0) {
            this.addQuestion();
        }
    }
    /**
     * Gets the idPldTest from the route
     */
    private getUrlParams() {
        this.activatedRoute.paramMap.subscribe((paramMap) => {
            this.idPldTest = +paramMap.get('idPldTest')!;
        });
    }
    /**
     * When the Grid is ready, get the Collaborator and assign them
     */
    protected async onGridReady(params: GridReadyEvent<any>) {
        this.gridApi = params.api;

        await this.getCollaborators();
        if (this.idPldTest > 0) {
            await this.getTestFormDTO(this.idPldTest);
            // Se agrega timeout debido a que si es instantáneo se borran los usuarios asignados por alguna razón
            await setTimeout(() => {
                this.getAssignedUsers();
            }, 3000);
        }
    }
    /**
     * Loads the Test through the Id. If there is no answer,
     * then redirects to create a new one
     */
    private async loadTestForEditing() {
        await this.getTestFormDTO(this.idPldTest);

        if (!this.testFormDTO) {
            this.mensajeService.error('No se encontró el examen, por favor reintente de nuevo');
            await this.router.navigate(['/dashboard/exam/adminPld']);
        } else {
            this.accion = GridActions.EDIT;
        }
    }
    /**
     * Gets the Form DTO and assigns the Questions, Scores and the model in general
     */
    private async getTestFormDTO(idPldTest: number) {
        try {
            this.isLoading = true;
            const data = await this.testsService.getPldFormDTO(idPldTest);
            this.testFormDTO = data.test;
            this.disableMaxAttempts = data.disable_attempts;
            
            this.testFormDTO.end_date = new Date(data.test.end_date);
            this.testFormDTO.start_date = new Date(data.test.start_date);
            this.questions = data.test.test_modules[0].questions;

            this.questions.forEach((question) => {
                const maxScoreAnswer = question.answers.reduce(
                    (maxScoreAnswer, currentAnswer) => {
                        return currentAnswer.score > maxScoreAnswer.score
                            ? currentAnswer
                            : maxScoreAnswer;
                    },
                    question.answers[0]
                );

                question.answers.forEach((answer) => {
                    answer.checked = answer.score === maxScoreAnswer.score;
                });
            });

            this.assigned_users = data.assigned_users;
            this.isLoading = false;
        } catch (error) {
            // Handle the error appropriately (logging, notifying the user, etc.)
            console.error('Error fetching test data:', error);
        }
    }
    /**
     * When updating, the users assigned will be selected in the grid
     */
    private getAssignedUsers() {
        if (!this.gridApi) return;

        const assigned_users: IRowNode<any>[] = [];
        this.gridApi.forEachNode((node) => {
            if (this.assigned_users.includes(node.data!.id.toString())) {
                node.setSelected(true);
                assigned_users.push(node);
            }
        });
        this.gridApi.setNodesSelected({ nodes: assigned_users, newValue: true });
    }
    /**
     * Gets the Collaborator List to be displayed in the Grid
     */
    private getCollaborators() {
        this.isLoading = true;
        this.usersService.GetUserGridDTO().then((users) => {
            this.usersList = users;
            this.isLoading = false;
        });
    }
    /**
     * Adds a Question to the end of the array
     */
    protected addQuestion(): void {
        this.questions.push(new QuestionFormDTO());
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }

    /**
     * Adds a Question to the end of the array
     */
    protected removeQuestion(): void {
        if (this.questions.length > 1) {
            this.questions.pop();
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }
    }

    /**
     * Adds an answer to the end of the array
     */
    protected addAnswer(questionIndex: number): void {
        this.questions[questionIndex].answers.push(new AnswerFormDTO());
    }

    /**
     * Removes the last answer of the array
     */
    protected removeAnswer(questionIndex: number): void {
        if (this.questions[questionIndex].answers.length > 1) {
            this.questions[questionIndex].answers.pop();
        }
    }
    /**
     * To move through the Card
     */
    protected nextStep(form: NgForm) {
     
        if (this.selectedIndex == 0&&this.isFormValidDate()==true) {
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
     * To move through the Card
     */
    private isFormValidDate() {
        
        if(this.testFormDTO.name!=undefined&&this.testFormDTO.min_score!=undefined&&this.testFormDTO.max_attempts!=undefined&&this.testFormDTO.start_date!=undefined&&this.testFormDTO.end_date!=undefined&&this.testFormDTO.introduction_text!=undefined)
        {
          if(this.selectedIndex==0)
                return true;
                else
                return false;
            
        }
        else    
        return false   
      }
  
      // Helper function to mark all form fields as touched
   
    protected previousStep() {
        if (this.selectedIndex != 0) {
            this.selectedIndex = this.selectedIndex - 1;
        }
    }
    /**
     * On each answer change per questions finds the answer 
     * that has the same description as the checked answer
     * and assigns the checked attribute to true
     */
    protected onAnswerChange(event: MatRadioChange, question: QuestionFormDTO,index:number) {
     
        question.answers.forEach((answer, i) => {
        answer.checked = (i === index); 
        });
     /*   question.answers.forEach((answer) => {
            if(!answer.description){
                
                return;
            }
            if (answer.description == event.value) {
                answer.checked = true;
                
            } else {
                answer.checked = false;
                
            }
        });*/
    }

    /**
     * Sends the Form 
     */
    protected sendForm(form: NgForm) {
        // Gets the selected users
      if(this.selectedIndex==2)
      {
        this.postAssignedUsers();
        
        // Validate required fields
        if (form.invalid) {
            
            Utilities.validateRequiredFields(form);
            
            return;
        }
        
        // Calculates Scores per question
        this.ensureTestModuleExists();
    
        this.calculateScores();
      
        // Executes the update or add method
        const TITULO_MODAL: string = this.accion + ' examen';
        const MENSAJE_CONFIRMACION: string = 
        'Una vez que un colaborador haya respondido el examen o la fecha de vigencia haya comenzado, '+
        'no se podrán realizar modificaciones en los intentos.  ¿Está seguro de que desea continuar?';
        const modal = this.modalService.show(ConfirmationModalComponent);
        
        (<ConfirmationModalComponent>modal.content).showConfirmationModal(
        TITULO_MODAL,
        MENSAJE_CONFIRMACION
        );

        (<ConfirmationModalComponent>modal.content).onClose.subscribe(result => {
            if (result === true) {
                this.testFormDTO.id > 0 ? this.update() : this.add();
            } 
        });
    }
    }

    /**
     * Ensures that test_module exists if not creates it to store the questions
     */
    private ensureTestModuleExists() {
        if (this.testFormDTO.test_modules.length === 0) {
            this.testFormDTO.test_modules.push(new TestModuleFormDTO());
        }

        this.testFormDTO.test_modules[0].questions = this.questions;
    }

    /**
     * Calculates the score of each question and answer
     */
    private calculateScores() {
        const score_per_correctAnswer = 100 / this.questions.length;

        this.testFormDTO.test_modules[0].questions.forEach((question) => {
            question.answers.forEach((answer) => {
                answer.score = answer.checked ? +score_per_correctAnswer.toFixed(0) : 0;
            });
        });
    }      

    
    /**
     * Calls the insert (POST) method in the service to insert the register
     */
    private add() {
        this.isLoading = true;
        this.testsService.postPldTest(this.testFormDTO).then(() => {
            this.mensajeService.success('El examen se agregó con éxito');
            this.router.navigate(['/dashboard/exam/adminPld']);
            this.isLoading = false;
            this.disableSubmit = false;
        });
    }

    /**
     * Calls the update (PUT) method in the service to modify the register
     */
    private update() {
        this.isLoading = true;
        this.testsService.putPldTest(this.testFormDTO).then(() => {
            this.mensajeService.success('El examen se modificó con éxito');
            this.router.navigate(['/dashboard/exam/adminPld']);
            this.isLoading = false;
        });
    }
    /**
     * Gets the Selected Users of the grid to be inserted in the FormDTO
     */
    private postAssignedUsers() {
        let assigned_users_ids = this.gridApi
            .getSelectedNodes()
            .map((node) => node.data.id);
        if (
            assigned_users_ids.length > 0 &&
            assigned_users_ids.every((id) => id !== undefined)
        ) {
            this.testFormDTO.assigned_users = assigned_users_ids as string[];
        } else {
            if(this.selectedIndex==3)
            this.mensajeService.warning('No se asignó a ningún usuario');
        }
    }

    protected goBack() {
        this.router.navigate(['/dashboard/exam/adminPld']);
    }
}
