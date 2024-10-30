import { Component ,OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { ToolService } from '@services/tools.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit  {
  title = 'intranet-app';
  links:any;
  id:any=localStorage.getItem("user_id");
  isLoading:boolean=false;
  isMenuVisible = false;

  toggleMenu() {
    this.isMenuVisible = !this.isMenuVisible;
  }
  ngOnInit() {
    this.isLoading=true;
  
    this.getTool();
  }
  constructor(public router: Router,private tools : ToolService) {}
  isLoginPage(): boolean {
    const loginRoutes = ['/login', '/sendEmail'];
    const currentUrl = this.router.url;
  
    // Verificar rutas exactas
    if (loginRoutes.includes(currentUrl)) {
      return true;
    }
  
    // Verificar ruta con parámetros dinámicos
    const resetPasswordRouteRegex = /^\/resetPassword\/[^/]+$/;
    if (resetPasswordRouteRegex.test(currentUrl)) {
      return true;
    }
    if (this.links ==undefined) {
      this.getTool();
    } 
    return false;
  }
  go(page:string)
  {
    this.isLoading=true;
    this.router.navigate([page]);
    this.isLoading=false;
  }
  getTool()
  {
       this.tools.getTools(localStorage.getItem("user_id"))
       .then((response: any) => {
        this.links=response;
       this.isLoading=false;
      })
      .catch((error) => {
        console.error('Error al comunicarse con la sesión:', error);
        this.isLoading = false;
        //this.getUser();
      });
    
  }
}
