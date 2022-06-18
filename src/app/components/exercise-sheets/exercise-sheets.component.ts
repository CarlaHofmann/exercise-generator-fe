import {Component, OnInit} from '@angular/core';
import {AuthService} from 'src/app/services/auth.service';
import {Author, Category, Course, Sheet, SheetApiService, UserApiService} from 'build/openapi';
import {DataService} from "../../services/data.service";
import {timeout} from 'rxjs';

@Component({
    selector: 'app-exercise-sheets',
    templateUrl: './exercise-sheets.component.html',
    styleUrls: ['./exercise-sheets.component.css']
})

export class ExerciseSheetsComponent implements OnInit {

    public sheets: Sheet[] = [];
    public authors: Author[] = [];
    public courses: Course[] = [];
    public categories: Category[] = [];

    public filteredAuthorNames: String[] = [];
    public filteredCourseNames: String[] = [];
    public filteredCategoryNames: String[] = [];

    public page: number = 1;
    public pageSize: number = this.dataService.getPageSize();

    public showAlert = false;
    public alertMessage = "";

    public isLoaded:boolean = false;
    public showLoading:boolean = true;


    constructor(private authService: AuthService,
                private dataService: DataService,
                private sheetApiService: SheetApiService,
                private userApiService: UserApiService) {
    }

    public ngOnInit(): void {
        this.loadExerciseSheets();
    }

    public displayAlert(message: string): void {
        this.alertMessage = message;
        this.showAlert = true;
    }

    public closeAlert(): void {
        this.showAlert = false;
    }

    private loadExerciseSheets(): void {
        this.sheetApiService.getAllSheets().pipe(timeout(3000)).subscribe({
            next: response => {
                if (this.isProfessor){
                    this.userApiService.getCurrentUser().subscribe({
                        next: response => {
                           this.filteredAuthorNames = [response.username];
                        },
                        error: error => console.log(error)
                    })
                }else{
                    const uniqueAuthors: Author[] = [];
                    response.map(sheet => sheet.author).filter((author: Author) => {
                        let i = uniqueAuthors.findIndex(a => a.name === author.name);
                        if (i < 0) {
                            uniqueAuthors.push(author);
                        }
                        return null;
                    })
                    this.authors = uniqueAuthors.sort((a, b) => (a.name < b.name) ? -1 : 1);
                }

                const uniqueCourses: Course[] = [];
                response.flatMap(sheet => sheet.courses).filter((course: Course) => {
                    let i = uniqueCourses.findIndex(c => c.name === course.name);
                    if (i < 0) {
                        uniqueCourses.push(course);
                    }
                    return null;
                })
                this.courses = uniqueCourses.sort((a, b) => (a.name < b.name) ? -1 : 1);

                const uniqueCategories: Category[] = [];
                response.flatMap(sheet => sheet.categories).filter((category: Category) => {
                    let i = uniqueCategories.findIndex(c => c.name === category.name);
                    if (i < 0) {
                        uniqueCategories.push(category);
                    }
                    return null;
                })
                this.categories = uniqueCategories.sort((a, b) => (a.name < b.name) ? -1 : 1);

                this.sheets = response.sort((a, b) => (a.publishedAt > b.publishedAt) ? -1 : 1);
                this.isLoaded = true;
                this.showLoading = false;
            },
            error: error => {
                this.displayAlert("Error loading from the database.");
                this.showLoading = false;
                console.log(error);
            }
        });
    }

    get filteredSheets(): Sheet[] {
        return this.sheets.filter((sheet: Sheet) => {
            if (this.filteredAuthorNames.length) {
                return this.filteredAuthorNames.includes(sheet.author.name)
            }
            return true;
        }).filter((sheet: Sheet) => {
            if (this.filteredCourseNames.length) {
                return sheet.courses.map((course: Course) => course.name)
                    .some((courseName: String) => this.filteredCourseNames
                        .includes(courseName));
            }
            return true;
        }).filter((sheet: Sheet) => {
            if (this.filteredCategoryNames.length) {
                return sheet.categories.map((category: Category) => category.name)
                    .some((categoryName: String) => this.filteredCategoryNames
                        .includes(categoryName));
            }
            return true;
        });
    }

    public filterAuthorsChange(authors: any): void {
        this.filteredAuthorNames = authors.map((author: Author) => author.name);
    }

    public filterCoursesChange(courses: any): void {
        this.filteredCourseNames = courses.map((course: Course) => course.name);
    }

    public filterCategoriesChange(categories: any): void {
        this.filteredCategoryNames = categories.map((category: Category) => category.name);
    }

    public getSheetCourses(courses: Course[]): string {
        return courses.map(course => course.name).join(", ");
    }

    public getSheetCategories(categories: Category[]): string {
        return categories.map(category => category.name).join(", ");
    }

    public toggleCheckbox(id: string, value: any) {
        // return this.sheetApiService.isPublishedUpdate(id, !value).subscribe({
        //     next: data => {
        //         return true;
        //     },
        //     error: error => console.log(error)
        // });
    }

    get isProfessor(): boolean {
        return this.authService.isProfessor;
    }

    public setPageSize(event: Event): void{
        this.pageSize = Number(event);
        this.dataService.savePageSize(this.pageSize);
    }

    public viewSheetPdf(id: string): void {
        window.open("sheet/" + id + "/pdf");
    }
}
