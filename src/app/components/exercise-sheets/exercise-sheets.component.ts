import { Component, OnInit } from '@angular/core';
import { Author, Category, Sheet, SheetApiService } from 'build/openapi';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-exercise-sheets',
    templateUrl: './exercise-sheets.component.html',
    styleUrls: ['./exercise-sheets.component.css']
})


export class ExerciseSheetsComponent implements OnInit {
    public sheets: Sheet[] = [];

    public authors: Author[] = [];
    public categories: Category[] = [];
    public commentArray: Category[] = []

    public page: number = 1;
    public pageSize: number = 10;


    constructor(private authService: AuthService,
                private sheetApiService: SheetApiService) {
    }

    public ngOnInit(): void {
        this.loadExerciseSheets();
    }

    get isProfessor(): boolean {
        return this.authService.isProfessor;
    }

    private loadExerciseSheets(): void {
        this.sheetApiService.getAllSheets().subscribe({
            next: response => {
                console.log(response);
                this.authors = Array.from(new Set(response.map(sheet => sheet.author)).values());
//                 console.log(this.authors);
                console.log(response.flatMap(sheet => sheet.categories));
                this.categories = Array.from(new Set(response.flatMap(sheet => sheet.categories)));
                console.log(this.categories);
                this.sheets = response;
                console.log(this.sheets);
            },
            error: error => console.log(error)
        });
    }

    public filterAuthors(values: any): void {
         if (values.length > 0)
             this.authors = values;
         else
             this.authors = [];
     }

    public filterCategories(values: any): void {
         if (values.length > 0)
             this.categories = values;
         else
             this.categories = [];
    }

    public getSheetCategories(categories: Category[]): string {
        let categoriesString = "";

        for (let i=0; i < categories.length; i++){
            this.categoriesString += categories[i].name
        }
    }

//     refreshExerciseSheets() {
//         this.displayExerciseSheets = this.dataSource
//             .filter(exerciseSheets => this.authorsFilter.length == 0 || this.authorsFilter.some(x => x === exerciseSheets.author))
//             .filter(exerciseSheets => this.categoriesFilter.length == 0 || this.categoriesFilter.some(x => x === exerciseSheets.category))
//         // .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
//
//     }
}
