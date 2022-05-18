import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {AuthService} from 'src/app/services/auth.service';
@Component({
  selector: 'app-exercise-sheets',
  templateUrl: './exercise-sheets.component.html',
  styleUrls: ['./exercise-sheets.component.css']
})
export class ExerciseSheetsComponent implements OnInit {
  selectedProfessor: string = 'All professors';
  selectedCategory: string = 'All categories'
  
  constructor(private authService: AuthService) { }
  ngOnInit(): void {
    
  }
  get isProfessor(): boolean {
    return this.authService.isProfessor;
}
  public selectProfessorChangeHandler (event: any) {
    //update the ui
    this.selectedProfessor = event.target.value;
    console.log(this.selectedProfessor);
  }
  public selectCategoryChangeHandler (event: any) {
    //update the ui
    this.selectedCategory = event.target.value;
    console.log(this.selectedCategory);
  }
}