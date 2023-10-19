
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import * as Utilities from '@utils/utilities';
import { EmailRequest } from 'src/app/shared/entities/models/email-request'
import { EmailService } from '@services/email.service';
import { lastValueFrom } from 'rxjs';
import { MensajeService } from '@http/mensaje.service';
import { LoadingComponent } from '../loading/loading.component';
import { Location } from '@angular/common';
@Component({
  selector: 'app-sendEmailPassword',
  standalone: true,
  templateUrl: './sendEmail.component.html',
  styleUrls: ['./sendEmail.component.scss'],
    imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    LoadingComponent,
  ],
  providers: [
    EmailService,
    MensajeService
  ]
})
export class SendEmailPasswordComponent implements OnInit {
  protected emailRequest: EmailRequest = new EmailRequest();
  protected disableSubmit: any;
  protected isLoading: boolean = false;

  constructor(
    private emailService: EmailService,
    private router: Router,
    private messageService: MensajeService,
    private location: Location
  ) { }

  ngOnInit() {
  }
  public enviarFormulario(form: NgForm){
    this.isLoading=true;

    this.disableSubmit = true;
    if(form.invalid){
      Utilities.validateRequiredFields(form);
      this.disableSubmit = false;
      return;
    }
    this.sendEmail();
  }
  public async sendEmail() {
    await lastValueFrom(this.emailService.sendEmail(this.emailRequest))
      .then(() => {
        this.messageService.success('El correo se ha enviado con exito!');
        this.isLoading=false;
        this.router.navigate(['/login']);
            })
      .catch(error => {
        this.isLoading=false;

        this.disableSubmit = false;
      });
  }
}



