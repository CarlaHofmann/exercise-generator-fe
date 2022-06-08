import { Component, OnInit } from '@angular/core';
import { Author, Course, Category, Sheet, SheetApiService } from 'build/openapi';
import { AuthService } from 'src/app/services/auth.service';

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
    public pageSize: number = 10;


    constructor(private authService: AuthService,
                private sheetApiService: SheetApiService) {
    }

    public ngOnInit(): void {
        this.loadExerciseSheets();
    }


    private loadExerciseSheets(): void {
        this.sheetApiService.getAllSheets().subscribe({
            next: response => {
                const uniqueAuthors: Author[] = [];
                response.map(sheet => sheet.author).filter((author: Author) => {
                    let i = uniqueAuthors.findIndex(a => a.name === author.name);
                    if(i < 0){
                        uniqueAuthors.push(author);
                    }
                    return null;
                })
                this.authors = uniqueAuthors.sort((a,b) => (a.name < b.name) ? -1 : 1);

                const uniqueCourses: Course[] = [];
                response.flatMap(sheet => sheet.courses).filter((course: Course) => {
                    let i = uniqueCourses.findIndex(c => c.name === course.name);
                    if(i < 0){
                        uniqueCourses.push(course);
                    }
                    return null;
                })
                this.courses = uniqueCourses.sort((a,b) => (a.name < b.name) ? -1 : 1);

                const uniqueCategories: Category[] = [];
                response.flatMap(sheet => sheet.categories).filter((category: Category) => {
                    let i = uniqueCategories.findIndex(c => c.name === category.name);
                    if(i < 0){
                        uniqueCategories.push(category);
                    }
                    return null;
                })
                this.categories = uniqueCategories.sort((a,b) => (a.name < b.name) ? -1 : 1);

                this.sheets = response.sort((a,b) => (a.publishedAt > b.publishedAt) ? -1 : 1);
            },
            error: error => console.log(error)
        });
    }

    get filteredSheets(): Sheet[] {
        return this.sheets.filter((sheet: Sheet) => {
                                        if (this.filteredAuthorNames.length){
                                            return this.filteredAuthorNames.includes(sheet.author.name)
                                        }
                                        return true;
                                  })
                          .filter((sheet: Sheet) => {
                                        if (this.filteredCourseNames.length){
                                            return sheet.courses.map((course: Course) => course.name)
                                                                .some((courseName: String) => this.filteredCourseNames
                                                                .includes(courseName));
                                        }
                                        return true;
                                  })
                          .filter((sheet: Sheet) => {
                                        if (this.filteredCategoryNames.length){
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
}
