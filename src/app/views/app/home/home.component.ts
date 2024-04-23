import { Component, OnInit } from '@angular/core';
// Importa MatIconModule y MatButtonModule en tu módulo
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { SidenavComponent } from '../sidenav/sidenav.component';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { LoadingComponent } from '../../app/loading/loading.component';
import { MensajeService } from '@http/mensaje.service';
import { ToolService } from '@services/tools.service';
@Component({
  selector: 'app-home',
  standalone:true,

  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    LoadingComponent
  ]
})
export class HomeComponent implements OnInit {
  protected isCollapsed: boolean = false;
  id:any=localStorage.getItem("user_id");
  links:any;
  isLoading:boolean=false;
  constructor( public message: MensajeService, private router: Router,private tools : ToolService) { }
  showSubMenu: string | null = null;
  getUser() {
    var user=localStorage.getItem("user_id");
    if(user=="")
    {
      this.router.navigate(['login']);
      this.message.error("No hay una sesión iniciada.")
    }

    return localStorage.getItem("names");
  }
  toggleSubMenu(menu: string) {
    this.showSubMenu = this.showSubMenu === menu ? null : menu;
  }
  go(page:string,pageOrigin:string)
  {
    this.isLoading=true;
    this.router.navigate([page]);
    this.isLoading=false;
  }
  ngOnInit() {
    this.isLoading=true;
  
    this.getTool();
  
  }
  getTool()
  {
       this.tools.getTools(this.id)
       .then((response: any) => {
        this.links=response;
       this.isLoading=false;
      })
      .catch((error) => {
        console.error('Error al comunicarse con la sesión:', error);
        this.isLoading = false;
        this.getUser();
      });
    
  }
  toggleMenu() {
    this.isCollapsed = !this.isCollapsed; // Cambia el estado del menú colapsable
  }
}
