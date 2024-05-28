import { Component, OnInit } from '@angular/core';
// Importa MatIconModule y MatButtonModule en tu módulo
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { SidenavComponent } from '../sidenav/sidenav.component';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,

  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule
  ]
})
export class HomeComponent implements OnInit {
  protected isCollapsed: boolean = false;
  id: any = localStorage.getItem("user_id");
  constructor(private router: Router) { }
  showSubMenu: string | null = null;
  getUser() {
    var user = localStorage.getItem("names");
    if (user == "") {


    }

    return user;
  }
  toggleSubMenu(menu: string) {
    this.showSubMenu = this.showSubMenu === menu ? null : menu;
  }
  go(page: string) {
    switch (page) {
      case "PLD":
        this.router.navigate(['/dashboard/exam']);
        break;
      case "Evaluaciones":
        this.router.navigate(['/dashboard/evaluacion']);
        break;
      case "360":
        this.router.navigate(['/dashboard/evaluacion360']);
        break;
      case "asesores":
        this.router.navigate(['/dashboard/asesores']);
        break;
      case "admin360":
        this.router.navigate(['/dashboard/admin360']);
        break;
      case "Cursos":
        this.router.navigate(['/dashboard/iSpring/cursos']);
        break;


    }
  }
  ngOnInit() {
  }
  toggleMenu() {
    this.isCollapsed = !this.isCollapsed; // Cambia el estado del menú colapsable
  }
}
