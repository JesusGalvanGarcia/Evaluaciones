import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Importa BrowserAnimationsModule para las animaciones de Angular Material
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { SidenavComponent } from '../sidenav/sidenav.component';

@Component({
  selector: 'app-home',
  standalone:true,

  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    CommonModule,
  ]
})
export class HomeComponent implements OnInit {
  protected isCollapsed: boolean = false;

  constructor() { }

  ngOnInit() {
  }
  toggleMenu() {
    this.isCollapsed = !this.isCollapsed; // Cambia el estado del menú colapsable
  }
}
