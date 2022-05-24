import { Component, OnInit } from '@angular/core';
import {AfterViewInit, ViewChild} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-exercise-database',
  templateUrl: './exercise-database.component.html',
  styleUrls: ['./exercise-database.component.css']
})
export class ExerciseDatabaseComponent implements OnInit,AfterViewInit {

  constructor(private http: HttpClient, private authService: AuthService) { }

  ngOnInit(): void {
    this.loadExercises();

  }

  url_delete = 'http://127.0.0.1:5000/professor/database/';
  url_exercises = 'http://127.0.0.1:5000/api/database/list';
  url_notes = 'http://127.0.0.1:5000/api/exercises/notes';

  EXERCISES_HARDCODED : exerciseEntry[] = [
    {id: 1, title: "Ex1", category: "Calculus",shortDescription:"differential equations",notes: "nothing",isUsed:true},
    {id: 2, title: "Ex2", category: "Calculus",shortDescription:"surface integrals",notes: "nothing",isUsed:true},
    {id: 3, title: "Ex3", category: "Trigonometry",shortDescription:"sinus",notes: "nothing",isUsed:true},
    {id: 4, title: "Ex4", category: "Algebra",shortDescription:"matrices and vectors",notes: "nothing",isUsed:false},
    {id: 5, title: "Ex5", category: "Algebra",shortDescription:"linear systems",notes: "nothing",isUsed:true},
    {id: 6, title: "Ex6", category: "Calculus",shortDescription:"more integrals",notes: "nothing",isUsed:true},
    {id: 7, title: "Ex7", category: "Algebra",shortDescription:"eigenvalues and eigenvectors",notes: "nothing",isUsed:true},
    {id: 8, title: "Ex8", category: "Calculus",shortDescription:"volume integrals",notes: "nothing",isUsed:true},
    {id: 9, title: "Ex9", category: "Calculus",shortDescription:"more volume integrals",notes: "nothing",isUsed:true},
    {id: 10,title: "Ex10",category: "Calculus",shortDescription:"even more volume integrals",notes: "nothing",isUsed:true},
    {id: 11,title: "Ex11",category: "Calculus",shortDescription:"all the volume integrals",notes: "nothing",isUsed:false}
    ];

  displayedColumns: string[] = ['title', 'category', 'shortDescription', 'action'];
  dataSource: exerciseEntry[] = [];
  displayExercises : exerciseEntry[] = [];
 

  searchString: string;
  categories : string [] = [];
  categoriesFilter : string [] = [];

  func(event : any){

    alert('pula');
  }
 page : number = 1;
 pageSize: number = 10;

 showAlert = false;
  alertMessage = "";

  get isProfessor(): boolean {
    return this.authService.isProfessor;
  }

  ngAfterViewInit() {
    //this.dataSource.paginator = this.paginator;
    //this.dataSource.sort = this.sort;
  }

  closeAlert(): void{
  
    this.showAlert = false;
  }
  removeExercise(id: number){

    this.http.delete(this.url_delete+id).subscribe({
      next: data => {
        // TODO: dialog
          this.loadExercises();
          //refresh list
      },
      error: error => {
          // alert('There was an error: ' + error.message);
          this.alertMessage = 'Error while trying to delete an exercise: '+error.message;
          this.showAlert = true;
      }
  });
  }

  loadExercises() : any{
   // >>>>>> HARDCODED VALUES 
    this.dataSource = this.EXERCISES_HARDCODED;
   this.categories = Array.from((new Set(this.dataSource.map(element=> element.category))).values());
   this.refreshExercises()
   
    return true;
    return this.http.get<exerciseEntry[]>(this.url_exercises).subscribe({
      next: data => {
          // alert(JSON.stringify(data))
          // alert(JSON.stringify(data[0]))
          this.dataSource = data;
          this.categories = Array.from((new Set(data.map(element=> element.category))).values());
          this.refreshExercises()
      },
      error: error => {
        this.alertMessage = 'Error loading the database: '+error.message;
        this.showAlert = true;
      }
  });
  }

  
  

  filterCategories(values: any) : void{
    if (values.length>0)
       this.categoriesFilter = values;
    else
      this.categoriesFilter = [];
    this.refreshExercises()
  }

  refreshExercises() {
    
    this.displayExercises = this.dataSource
      .filter(exercise =>  this.categoriesFilter.length==0 || this.categoriesFilter.some(x => x=== exercise.category ))
     // .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);

  }

  onSort(event: any) {

    alert(JSON.stringify(event))
    
  }

  saveNotes(id: number, value: string) {
    for(var el of this.dataSource){
      if(el.id==id)
        el.notes = value;
    }
    for(var el of this.displayExercises){
      if(el.id==id)
        el.notes = value;
    }
    const headers = { 'content-type': 'text/plain'}  
    const body={id:id, note: value};
 
    this.http.post<any>(this.url_notes, body,{'headers':headers , observe: 'response'}).subscribe({
      next: data => {
        // TODO: dialog
         // alert('success');
          //refresh list
      },
      error: error => {
          // alert('There was an error: ' + error.message);
          this.alertMessage = 'Error while trying to edit a note: '+error.message;
          this.showAlert = true;
      }
  });

 



  }
}


export interface exerciseEntry {
    id: number;
    title: string;
    category: string;
    shortDescription:string;
    notes: string;
    isUsed:boolean;
  }

