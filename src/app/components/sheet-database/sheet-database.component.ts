import {Component, OnInit} from '@angular/core';
import {Author, Category, Course, Sheet, SheetApiService, SheetDto, Exercise} from 'build/openapi';
import {AuthService} from '../../services/auth.service';
import {DataService} from "../../services/data.service";

@Component({
    selector: 'app-sheet-database',
    templateUrl: './sheet-database.component.html',
    styleUrls: ['./sheet-database.component.css']
})

export class SheetDatabaseComponent implements OnInit {

    public sheets: Sheet[] = [];
    public authors: Author[] = [];
    public courses: Course[] = [];
    public categories: Category[] = [];

    public filteredAuthorNames: String[] = [];
    public filteredCourseNames: String[] = [];
    public filteredCategoryNames: String[] = [];

    public page = 1;
    public pageSize = this.dataService.getPageSize();

    public showAlert = false;
    public alertMessage = "";

    public isLoaded = false;
    public showLoading = true;


    constructor(private authService: AuthService,
                private dataService: DataService,
                private sheetApiService: SheetApiService) {
    }

    public ngOnInit(): void {
        this.loadSheets();
    }

    get isProfessor(): boolean {
        return this.authService.isProfessor;
    }

    public displayAlert(message: string): void {
        this.alertMessage = message;
        this.showAlert = true;
    }

    public closeAlert(): void {
        this.showAlert = false;
    }

    private loadSheets(): void {
        this.sheetApiService.getAllSheets().subscribe({
            next: response => {
                const uniqueAuthors: Author[] = [];
                response.map(sheet => sheet.author).filter((author: Author) => {
                    let i = uniqueAuthors.findIndex(a => a.name === author.name);
                    if (i < 0) {
                        uniqueAuthors.push(author);
                    }
                    return null;
                })
                this.authors = uniqueAuthors.sort((a, b) => (a.name < b.name) ? -1 : 1);

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

    public removeSheet(id: string) {
        const confirm = window.confirm("Are you sure you want to delete this sheet?");
        if (confirm) {
            this.sheetApiService.deleteSheet(id).subscribe({
                next: () => {
                    this.loadSheets();
                },
                error: error => {
                    this.alertMessage = 'Error while trying to delete a sheet.';
                    console.log(error);
                    this.showAlert = true;
                }
            });
        }
    }

    public filterCoursesChange(courses: any): void {
        this.filteredCourseNames = courses.map((course: Course) => course.name);
    }

    public filterCategoriesChange(categories: any): void {
        this.filteredCategoryNames = categories.map((category: Category) => category.name);
    }

    public filterAuthorsChange(authors: any): void {
        this.filteredAuthorNames = authors.map((author: Author) => author.name);
    }

    public getSheetCourses(courses: Course[]): string {
        return courses.map(course => course.name).join(", ");
    }

    public getSheetCategories(categories: Category[]): string {
        return categories.map(category => category.name).join(", ");
    }

    public toggleCheckbox(id: string) {
        const sheet = this.filteredSheets.find(sheet => sheet.id === id);
        if (!sheet) {
            return;
        }

        this.updateSheet(sheet);
    }

    public uncheckAll(): void {
        this.filteredSheets.forEach(sheet => {
            sheet.isPublished = false;

            this.updateSheet(sheet);
        });
    }

    private updateSheet(sheet: Sheet): void {
        const originalIsPublished = sheet.isPublished;

        const exercisesString = this.exercisesToStringArray(sheet.exercises);

        const updatedSheet: SheetDto = {
            title: sheet.title,
            courses: sheet.courses,
            categories: sheet.categories,
            exercises: exercisesString,
            isPublished: sheet.isPublished
        }

        this.sheetApiService.updateSheet(sheet.id, updatedSheet).subscribe({
            error: err => {
                this.alertMessage = "Error while updating sheet.";
                this.showAlert = true;
                console.log(err);
                sheet.isPublished = originalIsPublished;
            }
        });
    }

    private exercisesToStringArray(exercises: Exercise[]): string[]{
        const exercisesStringArray: string[] = [];
        for (let i=0; i < exercises.length; i++) {
            exercisesStringArray.push(exercises[i]["id"])
        }
        console.log(exercisesStringArray);
        return exercisesStringArray;
    }

    public setPageSize(event: Event): void {
        this.pageSize = Number(event);
        this.dataService.savePageSize(this.pageSize);
    }

    public viewSheetPdf(id: string): void {
        window.open("sheet/" + id + "/pdf");
    }
}
