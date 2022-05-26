import { Component, OnInit } from '@angular/core';
import { AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AuthService } from "../../services/auth.service";
import { exerciseEntry, ExerciseDbService } from "../../services/exercise-db.service";
@Component({
  selector: 'app-exercise-database',
  templateUrl: './exercise-database.component.html',
  styleUrls: ['./exercise-database.component.css']
})
export class ExerciseDatabaseComponent implements OnInit, AfterViewInit {

  constructor(private http: HttpClient, private authService: AuthService, private exerciseService: ExerciseDbService) { }

  ngOnInit(): void {
    this.loadExercises();

  }

  private EXERCISES_HARDCODED: exerciseEntry[] = [
    { id: 1, title: "Ex1", category: "Calculus", shortDescription: "differential equations", notes: "nothing", isUsed: true },
    { id: 2, title: "Ex2", category: "Calculus", shortDescription: "surface integrals", notes: "nothing", isUsed: true },
    { id: 3, title: "Ex3", category: "Trigonometry", shortDescription: "sinus", notes: "nothing", isUsed: true },
    { id: 4, title: "Ex4", category: "Algebra", shortDescription: "matrices and vectors", notes: "nothing", isUsed: false },
    { id: 5, title: "Ex5", category: "Algebra", shortDescription: "linear systems", notes: "nothing", isUsed: true },
    { id: 6, title: "Ex6", category: "Calculus", shortDescription: "more integrals", notes: "nothing", isUsed: true },
    { id: 7, title: "Ex7", category: "Algebra", shortDescription: "eigenvalues and eigenvectors", notes: "nothing", isUsed: true },
    { id: 8, title: "Ex8", category: "Calculus", shortDescription: "volume integrals", notes: "nothing", isUsed: true },
    { id: 9, title: "Ex9", category: "Calculus", shortDescription: "more volume integrals", notes: "nothing", isUsed: true },
    { id: 10, title: "Ex10", category: "Calculus", shortDescription: "even more volume integrals", notes: "nothing", isUsed: true },
    { id: 11, title: "Ex11", category: "Calculus", shortDescription: "all the volume integrals", notes: "nothing", isUsed: false }
  ];

  public displayedColumns: string[] = ['title', 'category', 'shortDescription', 'action'];
  public dataSource: exerciseEntry[] = [];
  public displayExercises: exerciseEntry[] = [];


  private searchString: string = '';
  public categories: string[] = [];
  private categoriesFilter: string[] = [];

  // 
  public page: number = 1;
  public pageSize: number = 10;

  public showAlert = false;
  public alertMessage = "";

  get isProfessor(): boolean {
    return this.authService.isProfessor;
  }

  public ngAfterViewInit() {

  }

  public popAlert(message: string): void {
    this.alertMessage = message;
    this.showAlert = true;
  }
  public closeAlert(): void {
    this.showAlert = false;
  }

  public removeExercise(id: number) {

    this.exerciseService.deleteRequest(id).subscribe({
      next: data => {
        // TODO: dialog
        this.loadExercises();
        //refresh list
      },
      error: error => {
        // alert('There was an error: ' + error.message);
        this.alertMessage = 'Error while trying to delete an exercise: ' + error.message;
        this.showAlert = true;
      }
    });
  }

  public loadExercises(): any {
    // >>>>>> HARDCODED VALUES (uncomment the following 4 lines)
    this.dataSource = this.EXERCISES_HARDCODED;
    this.categories = Array.from((new Set(this.dataSource.map(element=> element.category))).values());
    this.refreshExercises()
    return true;

    this.exerciseService.getExercises().subscribe({
      next: data => {
        this.dataSource = data;
        this.categories = Array.from((new Set(data.map(element => element.category))).values());
        this.refreshExercises()
      },
      error: error => {
        this.popAlert('Error loading the database: ' + error.message);
      }
    });
  }




  public filterCategories(values: any): void {
    if (values.length > 0)
      this.categoriesFilter = values;
    else
      this.categoriesFilter = [];
    this.refreshExercises()
  }

  public refreshExercises() {

    this.displayExercises = this.dataSource
      .filter(exercise => (this.categoriesFilter.length == 0 || this.categoriesFilter.some(x => x === exercise.category)))
      .filter(exercise => (this.searchString.length == 0 || exercise.notes.toLowerCase().includes(this.searchString)));
  }

  public onSearchChange(event: any) {
    this.searchString = event.target.value.toLowerCase();
    this.refreshExercises();
  }

  public uncheckAll(): void {
    for (var el of this.dataSource) {
      el.isUsed = false;
    }
  }

  public saveNotes(id: number, value: string) {

    const body = { id: id, note: value };

    this.exerciseService.putNotes(body).subscribe({
      next: data => {
        for (var el of this.dataSource) {
          if (el.id == id)
            el.notes = value;
        }
        for (var el of this.displayExercises) {
          if (el.id == id)
            el.notes = value;
        }
      },
      error: error => {
        // alert('There was an error: ' + error.message);
        this.alertMessage = 'Error while trying to edit a note: ' + error.message;
        this.showAlert = true;
      }
    });





  }
}

