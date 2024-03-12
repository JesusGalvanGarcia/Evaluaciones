import { Component, OnInit } from '@angular/core';
import{TablesModule} from "../plan/plan.module";
import { FormsModule } from '@angular/forms'; 
@Component({
  selector: 'app-planForm',
  standalone:true,
  imports: [
  TablesModule,FormsModule],
  templateUrl: './planForm.component.html',
  styleUrls: ['./planForm.component.scss']
})
export class PlanFormComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
