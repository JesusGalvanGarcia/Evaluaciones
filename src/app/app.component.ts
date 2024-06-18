import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'intranet-app';
  constructor(public router: Router) {}
  isLoginPage(): boolean {
    return this.router.url === '/login';
  }
}
