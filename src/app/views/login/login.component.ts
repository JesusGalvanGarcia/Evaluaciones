import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import * as Utilities from '@utils/utilities';
import { LoginRequest } from 'src/app/shared/entities/models/login-request';
import { LoginService } from '@services/login.service';
import { lastValueFrom } from 'rxjs';
import { LoginResponse } from '@models/login-response';
import { GeneralConstant } from '@utils/general-constant';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule
  ],
  providers: [
    LoginService,
    Router
  ]
})
export class LoginComponent implements OnInit {
  protected loginRequest: LoginRequest = new LoginRequest();
  protected disableSubmit: any;
  protected hidePassword: boolean = true;
  constructor(
    private loginService: LoginService,
    private router: Router,
  
  ) { }

  ngOnInit() {
    console.log('Inicia LoginComponent');
  }

  /**
   * Valida que los campos del formulario sean requeridos y que el correo y la contraseña no estén vacíos.
   * Si es exitoso, llama al método autenticar.
   * @param formulario Formulario a validar.
   */
  public enviarFormulario(form: NgForm){
    this.disableSubmit = true;
    if(form.invalid){
      Utilities.validateRequiredFields(form);
      this.disableSubmit = false;
      return;
    }
    this.authenticate();
  }

  /**
   * Realiza la autenticación del usuario utilizando el servicio de inicio de sesión y redirige a la página de pacientes.
   * Llama al método Authenticate de LoginService. Si es exitoso, guarda el LoginResponse Token en el localStorage y redirige a la página de pacientes.
   */
  public async authenticate() {
    await lastValueFrom(this.loginService.authenticate(this.loginRequest))
      .then((loginResponse: LoginResponse) => {
        localStorage.setItem(GeneralConstant.TOKEN_KEY, loginResponse.token);
        this.router.navigate(['/main']);
      })
      .catch(error => {
        localStorage.removeItem(GeneralConstant.TOKEN_KEY);
        this.disableSubmit = false;
      });
  }
}
