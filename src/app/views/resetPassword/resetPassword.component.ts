
import { ResetPasswordRequest } from '@models/resetPassword';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import * as Utilities from '@utils/utilities';
import { PassWordService } from '@services/password.service';
import { lastValueFrom } from 'rxjs';
import { MensajeService } from '@http/mensaje.service';

import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-resertPassword',
  standalone: true,

  templateUrl: './resetPassword.component.html',
  styleUrls: ['./resetPassword.component.scss'],
     imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    LoadingComponent
  ],
  providers: [
    PassWordService,
    Router,
    MensajeService
  ]
})
export class ResertPasswordComponent implements OnInit {
  protected passwordRequest: ResetPasswordRequest = new ResetPasswordRequest();
  protected disableSubmit: any;
  protected hidePassword: boolean = true;
  protected passwordsNotMatching: boolean = false;
  protected email: string = "";
  protected isLoading: boolean = false;

  constructor(
    private passWordService: PassWordService,
    private router: Router,
    private messageService: MensajeService,
    private route: ActivatedRoute
  ) { 
    this.route.params.subscribe(params => {
      this.email = params['id']; 
    });
  }

  ngOnInit() {
  }
  public enviarFormulario(form: NgForm){
 
    this.disableSubmit = true;
    this.isLoading=true;
    if(form.invalid){
      Utilities.validateRequiredFields(form);
      this.disableSubmit = false;
      return;
    }
    this.sendResetPass();
  }
  public checkPasswordsMatch() {
    const password = this.passwordRequest.password;
    const confirmPassword = this.passwordRequest.confirmPassword;
    
    if (password !== confirmPassword) {
      this.passwordsNotMatching = true;
    } else {
      this.passwordsNotMatching = false;
    }
  }
  public async sendResetPass() {
    this.passwordRequest.email=this.email;
    await lastValueFrom(this.passWordService.sendResetPass(this.passwordRequest))
      .then(() => {
        this.isLoading=false;

        this.messageService.success('La contraseña se ha actualizado con exito!');

        this.router.navigate(['login']);
      })
      .catch(error => {
        this.isLoading=false;
        this.disableSubmit = false;
      });
  }
}

