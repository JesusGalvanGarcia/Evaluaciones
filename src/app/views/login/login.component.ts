import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import * as Utilities from '@utils/utilities';
import { LoginService } from '@services/login.service';
import { UserLogin } from "../../models/Login/login";
import { lastValueFrom } from 'rxjs';
import { LoginResponse } from '@models/login-response';
import { GeneralConstant } from '@utils/general-constant';
import { UserService } from '../../services/UserService';
import { MensajeService } from '@http/mensaje.service';
import { ActivatedRoute } from '@angular/router';
import { RouterModule, Routes } from '@angular/router';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    LoadingComponent
  ],
  providers: [
    LoginService

  ]
})
export class LoginComponent implements OnInit {
  protected loginRequest: UserLogin = new UserLogin();
  protected disableSubmit: any;
  protected isLoading: boolean = false;

  protected hidePassword: boolean = true;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public loginServices: UserService,
    public messageService: MensajeService
  ) { }

  ngOnInit() {

  }

  /**
   * Valida que los campos del formulario sean requeridos y que el correo y la contraseña no estén vacíos.
   * Si es exitoso, llama al método autenticar.
   * @param formulario Formulario a validar.
   */
  public enviarFormulario(form: NgForm) {
    this.isLoading = true;
    this.disableSubmit = true;
    if (form.invalid) {
      Utilities.validateRequiredFields(form);
      this.disableSubmit = false;
      this.isLoading = false;
      return;
    }
    this.authenticate();
  }

  /**
   * Realiza la autenticación del usuario utilizando el servicio de inicio de sesión y redirige a la página de pacientes.
   * Llama al método Authenticate de LoginService. Si es exitoso, guarda el LoginResponse Token en el localStorage y redirige a la página de pacientes.
   */
  public async authenticate() {
    this.loginServices.PostLogin(this.loginRequest)
      .then(({ data, token, user_id }) => {
        this.isLoading = false;
        localStorage.setItem("token", token);
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("email", data.email);

        this.router.navigate(['/dashboard/evaluacion']);

      })
      .catch(({ message, title, code }) => {
        console.error('Error in the request:', message, title);
        this.messageService.error(message + " " + code);
        this.isLoading = false;
        // Handle errors here
      });
  }
}
