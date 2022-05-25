import { Component, OnInit } from '@angular/core';
import { Author, Category, Sheet, SheetApiService } from 'build/openapi';
import { AuthService } from 'src/app/services/auth.service';
@Component({
    selector: 'app-exercise-sheets',
    templateUrl: './exercise-sheets.component.html',
    styleUrls: ['./exercise-sheets.component.css']
})
export class ExerciseSheetsComponent implements OnInit {
    selectedProfessor: string = 'All professors';
    selectedCategory: string = 'All categories'

    constructor(private authService: AuthService,
                private sheetApiService: SheetApiService) { }

    ngOnInit(): void {
        this.loadExerciseSheets();

    }

    sheets: Sheet[] = [];

    authors: Author[] = [];
    authorsFilter: string[] = [];
    categories: Category[] = [];
    categoriesFilter: string[] = [];

    page: number = 1;
    pageSize: number = 10;

    get isProfessor(): boolean {
        return this.authService.isProfessor;
    }

    private loadExerciseSheets(): void { 
        this.sheetApiService.getAllSheets().subscribe({
            next: response => {
                this.authors = Array.from(new Set(response.map(sheet => sheet.author)).values())
                this.categories = Array.from(new Set(response.flatMap(sheet => sheet.categories)).values());
                this.sheets = response;
            },
            error: error => console.log(error)
        });
    }

    // filterAuthors(values: any): void {
    //     if (values.length > 0)
    //         this.authorsFilter = values;
    //     else
    //         this.authorsFilter = [];
    //     this.refreshExerciseSheets()
    // }

    // filterCategories(values: any): void {
    //     if (values.length > 0)
    //         this.categoriesFilter = values;
    //     else
    //         this.categoriesFilter = [];
    //     this.refreshExerciseSheets()
    // }

    // refreshExerciseSheets() {
    //     this.displayExerciseSheets = this.dataSource
    //         .filter(exerciseSheets => this.authorsFilter.length == 0 || this.authorsFilter.some(x => x === exerciseSheets.author))
    //         .filter(exerciseSheets => this.categoriesFilter.length == 0 || this.categoriesFilter.some(x => x === exerciseSheets.category))
    //     // .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);

    // }
}