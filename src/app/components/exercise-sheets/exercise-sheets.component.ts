import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/services/auth.service';
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
    this.loadExerciseSheets();

  }

  EXERCISESHEETS_HARDCODED: exerciseSheetsEntry[] = [
    { title: "Exercise Sheet Nr. 5", category: "Statistics", author: "bremm@fb2.fra-uas.de", updatedAt: "17.05.2022 16:03:22", download: 'http://www.africau.edu/images/default/sample.pdf' },
    { title: "Exercise Sheet Sprint 3", category: "R", author: "andersson@fb2.fra-uas.de", updatedAt: "16.05.2022 14:13:47", download: "http://www.africau.edu/images/default/sample.pdf" },
    { title: "Exercise Sheet Nr. 4", category: "Statistics", author: "bremm@fb2.fra-uas.de", updatedAt: "10.05.2022 11:05:43", download: "http://www.africau.edu/images/default/sample.pdf" },
    { title: "Exercise Sheet Week 3", category: "SWT", author: "godehardt@fb2.fra-uas.de", updatedAt: "09.05.2022 18:48:26", download: "http://www.africau.edu/images/default/sample.pdf" },
    { title: "Exercise Sheet Nr. 3", category: "Probability Calculation", author: "bremm@fb2.fra-uas.de", updatedAt: "03.05.2022 12:59:39", download: "http://www.africau.edu/images/default/sample.pdf" },
    { title: "Exercise Sheet Nr. 5", category: "Statistics", author: "bremm@fb2.fra-uas.de", updatedAt: "17.05.2022 16:03:22", download: 'http://www.africau.edu/images/default/sample.pdf' },
    { title: "Exercise Sheet Sprint 3", category: "R", author: "andersson@fb2.fra-uas.de", updatedAt: "16.05.2022 14:13:47", download: "http://www.africau.edu/images/default/sample.pdf" },
    { title: "Exercise Sheet Nr. 4", category: "Statistics", author: "bremm@fb2.fra-uas.de", updatedAt: "10.05.2022 11:05:43", download: "http://www.africau.edu/images/default/sample.pdf" },
    { title: "Exercise Sheet Week 3", category: "SWT", author: "godehardt@fb2.fra-uas.de", updatedAt: "09.05.2022 18:48:26", download: "http://www.africau.edu/images/default/sample.pdf" },
    { title: "Exercise Sheet Nr. 3", category: "Probability Calculation", author: "bremm@fb2.fra-uas.de", updatedAt: "03.05.2022 12:59:39", download: "http://www.africau.edu/images/default/sample.pdf" },
  ];

  dataSource: exerciseSheetsEntry[] = [];
  displayExerciseSheets: exerciseSheetsEntry[] = [];

  authors: string[] = [];
  authorsFilter: string[] = [];
  categories: string[] = [];
  categoriesFilter: string[] = [];

  page: number = 1;
  pageSize: number = 10;

  get isProfessor(): boolean {
    return this.authService.isProfessor;
  }

  loadExerciseSheets(): any {
    // >>>>>> HARDCODED VALUES 
    this.dataSource = this.EXERCISESHEETS_HARDCODED;
    this.authors = Array.from((new Set(this.dataSource.map(element => element.author))).values());
    this.categories = Array.from((new Set(this.dataSource.map(element => element.category))).values());
    this.refreshExerciseSheets()

    return true;
    //    return this.http.get<exerciseEntry[]>(this.url_exercises).subscribe({
    //      next: data => {
    //          // alert(JSON.stringify(data))
    //          // alert(JSON.stringify(data[0]))
    //          this.dataSource = data;
    //          this.categories = Array.from((new Set(data.map(element=> element.category))).values());
    //          this.refreshExercises()
    //      },
    //      error: error => {
    //        this.alertMessage = 'Error loading the database: '+error.message;
    //        this.showAlert = true;
    //      }
    //  });
  }

  filterAuthors(values: any): void {
    if (values.length > 0)
      this.authorsFilter = values;
    else
      this.authorsFilter = [];
    this.refreshExerciseSheets()
  }

  filterCategories(values: any): void {
    if (values.length > 0)
      this.categoriesFilter = values;
    else
      this.categoriesFilter = [];
    this.refreshExerciseSheets()
  }

  refreshExerciseSheets() {
    this.displayExerciseSheets = this.dataSource
      .filter(exerciseSheets => this.authorsFilter.length == 0 || this.authorsFilter.some(x => x === exerciseSheets.author))
      .filter(exerciseSheets => this.categoriesFilter.length == 0 || this.categoriesFilter.some(x => x === exerciseSheets.category))
    // .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);

  }
}

export interface exerciseSheetsEntry {
  title: string;
  category: string;
  author: string;
  updatedAt: string;
  download: string;
}