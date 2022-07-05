import {Component, OnInit} from '@angular/core';
import {Category, Course, Exercise, Sheet, SheetApiService, SheetDto} from 'build/openapi';
import {AuthService} from '../../services/auth.service';
import {DataService} from "../../services/data.service";
import {ViewportScroller} from "@angular/common";
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';

@Component({
    selector: 'app-sheet-database',
    templateUrl: './sheet-database.component.html',
    styleUrls: ['./sheet-database.component.css']
})

export class SheetDatabaseComponent implements OnInit {

    public filterForm: FormGroup;
    public filteredSheets: Sheet[] = [];

    public sheets: Sheet[] = [];
    public authors: string[] = [];
    public courses: string[] = [];
    public categories: string[] = [];

    private categoriesFilter: string[] = [];
    private coursesFilter: string[] = [];

    private orderMap = [{key: "Title", dir: "asc"},
                        {key: "Course", dir: "asc"},
                        {key: "Category", dir: "asc"},
                        {key: "Author", dir: "asc"},
                        {key: "Exercises", dir: "asc"},
                        {key: "Updated At", dir: "asc"},
                        {key: "Published At", dir: "asc"},
                        {key: "Published", dir: "asc"}];

    public page = 1;
    public pageSize = this.dataService.getPageSize();

    public showAlert = false;
    public alertMessage = "";

    public isLoaded = false;
    public showLoading = true;


    constructor(private authService: AuthService,
                private dataService: DataService,
                private sheetApiService: SheetApiService,
                private viewportScroller: ViewportScroller,
                private fb: FormBuilder) {

        this.filterForm = this.fb.group({name: '', filters: this.fb.array([])});
    }

    public ngOnInit(): void {
        this.loadSheets();
        this.viewportScroller.scrollToPosition([0, 0]);
    }

    get isProfessor(): boolean {
        return this.authService.isProfessor;
    }

    public filters(): FormArray {
        return this.filterForm.get("filters") as FormArray
    }

    public applyFilters(): void {
        this.filteredSheets = Object.assign([], this.sheets);
        for (let filter of this.filterForm.value.filters) {
            switch (filter.choice) {
                case "Category": {
                    this.filteredSheets = this.filteredSheets
                        .filter(sheet => (filter.value.length == 0 || (filter.value as string[]).some(x => sheet.categories.map(el => el.name).includes(x))));
                    break;
                }
                case "Course": {
                    this.filteredSheets = this.filteredSheets
                        .filter(sheet => (filter.value.length == 0 || (filter.value as string[]).some(x => sheet.courses.map(el => el.name).includes(x))));
                    break;
                }
                case "Author": {
                    this.filteredSheets = this.filteredSheets
                        .filter(sheet => (filter.value.length == 0 || (filter.value as string[]).includes(sheet.author.username)));
                    break;
                }
                case "Title": {
                    this.filteredSheets = this.filteredSheets
                        .filter(sheet => (filter.value.length == 0 || sheet.title.toLowerCase().includes(filter.value.toLowerCase())));
                    break;
                }
            }
        }
    }

    public addFilter(): void {
        this.filters().push(this.fb.group({
            choice: '',
            contains: true,
            value: [],
        }));
    }

    private refreshFilterData(): void {
        this.courses = Array.from(new Set(this.filteredSheets.reduce((previous, next) => previous.concat(next.courses.map(course => course.name)), new Array<string>())).values());
        this.categories = Array.from(new Set(this.filteredSheets.reduce((previous, next) => previous.concat(next.categories.map(category => category.name)), new Array<string>())).values());
    }

    public removeFilter(index: number): void {
        this.filters().removeAt(index);
        this.applyFilters();
    }

    public removeAllFilters(): void {
        this.filters().clear();
        this.applyFilters();
    }

    private loadSheets(): void {
        this.sheetApiService.getAllSheets().subscribe({
            next: response => {
                this.sheets = response;
                this.courses = Array.from(new Set(this.sheets.reduce((previous, next) => previous.concat(next.courses.map(course => course.name)), new Array<string>())).values());
                this.categories = Array.from(new Set(this.sheets.reduce((previous, next) => previous.concat(next.categories.map(category => category.name)), new Array<string>())).values());
                if (!this.isProfessor) this.authors = Array.from(new Set(this.sheets.map(sheet => sheet.author.username)).values());
                this.refreshSheets();
                this.isLoaded = true;
                this.showLoading = false;
            },
            error: error => {
                this.displayAlert("Error loading from the database.", error);
                this.showLoading = false;
            }
        });
    }

    public refreshSheets() {
        this.filteredSheets = this.sheets
            .filter(sheet => (this.coursesFilter.length == 0 || this.coursesFilter.some(x => sheet.courses.map(course => course.name).includes(x))))
            .filter(sheet => (this.categoriesFilter.length == 0 || this.categoriesFilter.some(x => sheet.categories.map(category => category.name).includes(x))));
        this.refreshFilterData();
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
                this.displayAlert("Error while updating sheet.", err);
                sheet.isPublished = originalIsPublished;
            }
        });
    }

    public viewSheetPdf(id: string): void {
        window.open("sheet/" + id + "/pdf");
    }

    public removeSheet(id: string) {
        const confirm = window.confirm("Are you sure you want to delete this sheet?");
        if (confirm) {
            this.sheetApiService.deleteSheet(id).subscribe({
                next: () => {
                    this.loadSheets();
                    this.refreshSheets();
                },
                error: error => {
                    this.displayAlert("Error while deleting sheet.", error);
                }
            });
        }
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

    public sortTable(header: string): void {
        let headerIndex = this.orderMap.findIndex(x => x.key == header);
        let direction = this.orderMap[headerIndex].dir;
        let dir: number;

        if (direction === "asc") {
            dir = 1;
            this.orderMap[headerIndex] = {...this.orderMap[headerIndex], dir: "desc"}
        } else {
            dir = -1;
            this.orderMap[headerIndex] = {...this.orderMap[headerIndex], dir: "asc"}
        }

        if (header === "Title") {
            this.filteredSheets = this.filteredSheets.sort((a, b) => (a.title < b.title) ? dir : dir * (-1));
        } else if (header === "Course") {
            this.filteredSheets = this.filteredSheets.sort((a, b) => (this.coursesToString(a.courses) < this.coursesToString(b.courses)) ? dir : dir * (-1));
        }else if (header === "Category") {
            this.filteredSheets = this.filteredSheets.sort((a, b) => (this.categoriesToString(a.categories) < this.categoriesToString(b.categories)) ? dir : dir * (-1));
        }else if (header === "Author") {
            this.filteredSheets = this.filteredSheets.sort((a, b) => (a.author < b.author) ? dir : dir * (-1));
        }else if (header === "Exercises") {
            this.filteredSheets = this.filteredSheets.sort((a, b) => (a.exercises.length < b.exercises.length) ? dir : dir * (-1));
        }else if (header === "Updated At") {
            this.filteredSheets = this.filteredSheets.sort((a, b) => (a.updatedAt < b.updatedAt) ? dir : dir * (-1));
        }else if (header === "Published At") {
            this.filteredSheets = this.filteredSheets.sort((a, b) => (a.publishedAt < b.publishedAt) ? dir : dir * (-1));
        }else if (header === "Published") {
            this.filteredSheets = this.filteredSheets.sort((a, b) => (a.isPublished < b.isPublished) ? dir : dir * (-1));
        }
    }

    public coursesToString(courses: Course[]): string {
        return courses.map(course => course.name).join(", ");
    }

    public categoriesToString(categories: Category[]): string {
        return categories.map(category => category.name).join(", ");
    }

    private exercisesToStringArray(exercises: Exercise[]): string[] {
        const exercisesStringArray: string[] = [];
        for (let i = 0; i < exercises.length; i++) {
            exercisesStringArray.push(exercises[i]["id"])
        }
        console.log(exercisesStringArray);
        return exercisesStringArray;
    }

    public displayAlert(message: string, error: string): void {
        this.alertMessage = message;
        this.showAlert = true;
        console.log(error);
        this.viewportScroller.scrollToPosition([0, 0]);
    }

    public closeAlert(): void {
        this.showAlert = false;
    }

    public setPageSize(event: Event): void {
        this.pageSize = Number(event);
        this.dataService.savePageSize(this.pageSize);
    }
}
