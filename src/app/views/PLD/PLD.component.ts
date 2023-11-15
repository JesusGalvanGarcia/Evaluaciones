import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatBadgeModule } from '@angular/material/badge';
import{GridModule} from '@sharedComponents/grid/grid.module';
@Component({
  selector: 'app-PLD',
  standalone:true,
  templateUrl: './PLD.component.html',
  styleUrls: ['./PLD.component.css'],
  imports: [MatMenuModule,MatIconModule,MatCardModule,GridModule,MatBadgeModule]
})
export class PLDComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
