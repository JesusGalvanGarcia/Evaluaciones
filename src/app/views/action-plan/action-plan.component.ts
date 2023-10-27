import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ViewportScroller } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatDrawer } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { Router, ActivatedRoute } from '@angular/router';
import { ActionPlanService } from 'src/app/services/ActionPlanService';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import SignaturePad from 'signature_pad';
import { MensajeService } from '@http/mensaje.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';


@Component({
  selector: 'app-action-plan',
  templateUrl: './action-plan.component.html',
  styleUrls: ['./action-plan.component.scss'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatSidenavModule,
    NgIf,
    MatButtonModule,
    ReactiveFormsModule,
    MatDividerModule,
    MatIconModule,
    MatProgressSpinnerModule,
    CommonModule,
    MatProgressBarModule
  ],
})
export class ActionPlanComponent {

  user_id: number = 0;

  // Signature
  @ViewChild('signatureCanvas') signatureCanvas: ElementRef;
  @ViewChild('drawer') drawer: MatDrawer;
  private signaturePad: SignaturePad;
  firmaBase64: string;
  canvas: any;
  selected_signature: any;
  show_sign: boolean = false;
  is_signed: boolean = false;

  // Form Agreements
  agreement_form: FormGroup | any;

  // Table Agreementes
  displayedColumns: string[] = ['id', 'opportunity_area', 'goal', 'developed_skill', 'action', 'established_date', 'actions'];
  dataSource: MatTableDataSource<UserData> | any = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  loading: boolean = true;
  finished: boolean = false;
  responsable: boolean = false;
  user_action_plan_id: number = 0;
  action_plan_name: string = '';
  user_action_plan: any;
  agreements: any;
  signatures: any;

  selected_agreement_id: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private viewportScroller: ViewportScroller,
    private router: Router,
    private route: ActivatedRoute,
    private _actionPlanService: ActionPlanService,
    public system_message: MensajeService
  ) {

    this.user_id = Number(localStorage.getItem('user_id')!);
    this.route.params.subscribe(params => {
      this.user_action_plan_id = params['user_action_plan_id'];
    });

    this.agreement_form = this.formBuilder.group({
      opportunity_area: ['', Validators.required],
      goal: ['', Validators.required],
      developed_skill: [''],
      action: [''],
      established_date: [''],
    });

    this.getAgreements();

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.canvas = this.signatureCanvas.nativeElement;
    this.signaturePad = new SignaturePad(this.canvas, {
      backgroundColor: 'white',
      minWidth: 1,
      maxWidth: 3,
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getAgreements() {

    const searchData = {
      user_id: this.user_id
    }

    this._actionPlanService.GetAction(searchData, this.user_action_plan_id).
      then(({ user_action_plan, agreements, signatures }) => {

        this.user_action_plan = user_action_plan;
        this.action_plan_name = user_action_plan.action_plan_name
        this.agreements = agreements;

        // signatures

        this.signatures = signatures;

        // agreements
        this.dataSource = new MatTableDataSource(agreements);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.checkIfItsValid();

        this.loading = false;
      })
      .catch(({ title, message, code }) => {

        this.loading = false;

        this.system_message.error(title + message);

        this.dataSource = new MatTableDataSource([]);
        console.log(message)
      });
  }

  evaluateForm() {

    if (this.selected_agreement_id == 0) {
      this.saveAgreement();
    } else
      this.updateAgreement();
  }

  saveAgreement() {

    const data = {
      user_id: this.user_id,
      user_action_plan_id: this.user_action_plan_id,
      opportunity_area: this.agreement_form.get('opportunity_area').value,
      goal: this.agreement_form.get('goal').value,
      developed_skill: this.agreement_form.get('developed_skill').value,
      action: this.agreement_form.get('action').value,
      established_date: this.agreement_form.get('established_date').value
    }

    this.loading = true;

    this._actionPlanService.SaveAgreement(data).
      then(({ }) => {

        this.resetForm();
        this.getAgreements();
        this.closeDrawer();
      })
      .catch(({ title, message, code }) => {
        console.log(message)
      });
  }

  editAgreement(agreement_id: number) {

    let agreement = this.agreements.find((agreement: any) => agreement.id == agreement_id);

    this.selected_agreement_id = agreement_id;

    this.agreement_form.patchValue({
      opportunity_area: agreement.opportunity_area,
      goal: agreement.goal,
      developed_skill: agreement.developed_skill,
      action: agreement.action,
      established_date: agreement.established_date
    });

    this.openDrawer();
  }

  updateAgreement() {

    const data = {
      user_id: this.user_id,
      user_action_plan_id: this.user_action_plan_id,
      opportunity_area: this.agreement_form.get('opportunity_area').value,
      goal: this.agreement_form.get('goal').value,
      developed_skill: this.agreement_form.get('developed_skill').value,
      action: this.agreement_form.get('action').value,
      established_date: this.agreement_form.get('established_date').value
    }

    this.loading = true;

    this._actionPlanService.UpdateAgreement(data, this.selected_agreement_id).
      then(({ }) => {

        this.resetForm();
        this.getAgreements();
        this.closeDrawer();
        this.selected_agreement_id = 0;
      })
      .catch(({ title, message, code }) => {
        console.log(message)
        this.loading = false;
      });
  }

  confirmActionPlan() {

    const data = {
      user_id: this.user_id,
      user_action_plan_id: this.user_action_plan_id
    }

    this.loading = true;

    this._actionPlanService.confirmActionPlan(data).
      then(({ }) => {

        this.getAgreements();
      })
      .catch(({ title, message, code }) => {
        console.log(message)
        this.loading = false;
      });
  }

  toSign() {

    let signature = this.signatures.find((signature: any) => signature.responsable_id == this.user_id);

    if (!signature)
      this.system_message.error('No estás autorizado para firmar.')
    else {

      this.selected_signature = signature;
      this.is_signed = signature.url ? true : false;
      this.show_sign = true;
    }
  }

  clearSignature() {
    // Limpia la firma en el canvas
    this.signaturePad.clear();
    this.firmaBase64 = '';
  }

  confirmSignature() {

    this.firmaBase64 = this.signaturePad.toDataURL();
  }

  saveSignature() {

    const data = {
      user_id: this.user_id,
      user_action_plan_id: this.user_action_plan_id,
      signature: this.firmaBase64
    }

    this.loading = true;

    this._actionPlanService.saveSignature(data).
      then(({ }) => {

        this.clearSignature();
        this.show_sign = false;
        this.getAgreements();
      })
      .catch(({ title, message, code }) => {
        console.log(message)
        this.loading = false;
      });
  }

  scrollToTop() {
    this.viewportScroller.scrollToPosition([0, 0]);
  }

  closeDrawer() {
    this.drawer.close();
    this.selected_agreement_id = 0;
  }

  openDrawer() {
    this.drawer.open();
  }

  resetForm() {
    this.agreement_form.reset();
  }

  redirectToPage() {
    this.router.navigate(['/dashboard/evaluacion']);
  }

  checkIfItsValid() {

    if (this.user_action_plan.status_id != 3)
      this.finished = false;
    else
      this.finished = true;


    if (this.user_action_plan.responsable_id == this.user_id)
      this.responsable = true
    else
      this.responsable = false

  }
}

export interface UserData {
  id: string;
  name: string;
  progress: string;
  fruit: string;
}