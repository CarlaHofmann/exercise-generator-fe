import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms'
import { ViewportScroller } from '@angular/common';
import {Category, Course, Exercise, ExerciseApiService, ExerciseDto} from 'build/openapi';
import {AuthService} from "../../services/auth.service";
import {DataService} from "../../services/data.service";

@Component({
    selector: 'app-exercise-database',
    templateUrl: './exercise-database.component.html',
    styleUrls: ['./exercise-database.component.css']
})

export class ExerciseDatabaseComponent implements OnInit {

    public filterForm: FormGroup;

    public exercises: Exercise[] = [];
    public filteredExercises: Exercise[] = [];

    public courses: string[] = [];
    public categories: string[] = [];
    public authors: string[] = [];

    private categoriesFilter: string[] = [];
    private coursesFilter: string[] = [];
    private searchString: string = '';

    private orderMap = [{key: "Title", dir: "asc"},
                        {key: "Course", dir: "asc"},
                        {key: "Category", dir: "asc"},
                        {key: "Author", dir: "asc"},
                        {key: "Short Description", dir: "asc"},
                        {key: "Notes", dir: "asc"},
                        {key: "Updated At", dir: "asc"},
                        {key: "Published", dir: "asc"},
                        {key: "Used", dir: "asc"}];

    public page = 1;
    public pageSize = this.dataService.getPageSize();

    public showAlert = false;
    public alertMessage = "";

    public isLoaded = false;
    public showLoading = true;


    constructor(private authService: AuthService,
                private dataService: DataService,
                private exerciseApiService: ExerciseApiService,
                private viewportScroller: ViewportScroller,
                private fb: FormBuilder) {

        this.filterForm = this.fb.group({name: '', filters: this.fb.array([])});
    }

    ngOnInit(): void {
        this.loadExercises();
    }

    public filters(): FormArray {
        return this.filterForm.get("filters") as FormArray
    }

    public applyFilters(): void {
        this.filteredExercises = Object.assign([], this.exercises);
        for (let filter of this.filterForm.value.filters) {
            switch (filter.choice) {
                case "Title": {
                    this.filteredExercises = this.filteredExercises
                        .filter(exercise => (filter.value.length == 0 || exercise.title.toLowerCase().includes(filter.value.toLowerCase())));
                    break;
                }
                case "Course": {
                    this.filteredExercises = this.filteredExercises
                        .filter(exercise => (filter.value.length == 0 || (filter.value as string[]).some(x => exercise.courses.map(el => el.name).includes(x))));
                    break;
                }
                case "Category": {
                    this.filteredExercises = this.filteredExercises
                        .filter(exercise => (filter.value.length == 0 || (filter.value as string[]).some(x => exercise.categories.map(el => el.name).includes(x))));
                    break;
                }
                case "Author": {
                    this.filteredExercises = this.filteredExercises
                        .filter(exercise => (filter.value.length == 0 || (filter.value as string[]).includes(exercise.author.username)));
                    break;
                }
                case "ShortDescription": {
                    this.filteredExercises = this.filteredExercises
                        .filter(exercise => (filter.value.length == 0 || exercise.shortDescription.toLowerCase().includes(filter.value)));
                    break;
                }
                case "Notes": {
                    this.filteredExercises = this.filteredExercises
                        .filter(exercise => (filter.value.length == 0 || (filter.contains == exercise.note?.toLowerCase().includes(filter.value))));
                    break;
                }
            }
        }
    }

    public filterCategories(values: any): void {
        if (values.length > 0) {
            this.categoriesFilter = values;
        } else {
            this.categoriesFilter = [];
        }
        this.refreshExercises();
    }

    public filterCourses(values: any): void {
        if (values.length > 0) {
            this.coursesFilter = values;
        } else {
            this.coursesFilter = [];
        }
        this.refreshExercises();
    }

    public addFilter(): void {
        this.filters().push(this.fb.group({choice: '', contains: true, value: []}));
    }

    private refreshFilterData(): void {
        this.categories = Array.from(new Set(this.filteredExercises.reduce((previous, next) => previous.concat(next.categories.map(el => el.name)), new Array<string>())).values());
        this.courses = Array.from(new Set(this.filteredExercises.reduce((previous, next) => previous.concat(next.courses.map(el => el.name)), new Array<string>())).values());
    }

    public removeFilter(index: number): void {
        this.filters().removeAt(index);
        this.applyFilters();
    }

    public removeAllFilters(): void {
        this.filters().clear();
        this.applyFilters();
    }

    private loadExercises(): any {
        this.exerciseApiService.getAllExercises().subscribe({
            next: data => {
                this.exercises = data;
                this.categories = Array.from(new Set(this.exercises.reduce((previous, next) => previous.concat(next.categories.map(el => el.name)), new Array<string>())).values());
                this.courses = Array.from(new Set(this.exercises.reduce((previous, next) => previous.concat(next.courses.map(el => el.name)), new Array<string>())).values());
                if (!this.isProfessor) this.authors = Array.from(new Set(this.exercises.map((elem) => elem.author.username)).values());
                this.sortByUpdatedAt();
                this.refreshExercises();
                this.isLoaded = true;
                this.showLoading = false;
            },
            error: err => {
                this.displayAlert("Error loading from the database.", err);
                this.showLoading = false;
            }
        });
    }

    public refreshExercises() {
        this.filteredExercises = this.exercises
            .filter(exercise => (this.categoriesFilter.length == 0 || this.categoriesFilter.some(x => exercise.categories.map(el => el.name).includes(x))))
            .filter(exercise => (this.coursesFilter.length == 0 || this.coursesFilter.some(x => exercise.courses.map(el => el.name).includes(x))))
            .filter(exercise => (this.searchString.length == 0 || exercise.note?.toLowerCase().includes(this.searchString)));
        this.refreshFilterData();
    }

    private updateExercise(exercise: Exercise): void {
        const originalIsPublished = exercise.isPublished;
        const originalIsUsed = exercise.isUsed;

        const updatedExercise: ExerciseDto = {
            title: exercise.title,
            courses: exercise.courses,
            categories: exercise.categories,
            note: exercise.note,
            shortDescription: exercise.shortDescription,
            texts: exercise.texts,
            solutions: exercise.solutions,
            images: exercise.images,
            isPublished: exercise.isPublished,
            isUsed: exercise.isUsed
        }

        this.exerciseApiService.updateExercise(exercise.id, updatedExercise).subscribe({
            error: err => {
                this.displayAlert("Error while updating exercise.", err);
                exercise.isPublished = originalIsPublished;
                exercise.isUsed = originalIsUsed;
            }
        });
    }

    public viewExercisePdf(id: string): void {
        window.open("exercise/" + id + "/pdf");
    }

    public removeExercise(id: string) {
        const confirm = window.confirm("Are you sure you want to delete this exercise?");
        if (confirm) {
            this.exerciseApiService.deleteExercise(id).subscribe({
                next: () => {
                    this.loadExercises();
                    this.refreshExercises();
                },
                error: err => {
                    this.displayAlert("Error while trying to delete an exercise.", err);
                }
            });
        }
    }

    public toggleCheckbox(id: string) {
        const exercise = this.filteredExercises.find(sheet => sheet.id === id);
        if (!exercise) {
            return;
        }
        this.updateExercise(exercise);
    }

    public uncheckAll(): void {
        this.filteredExercises.forEach(exercise => {
            exercise.isUsed = false;
            this.updateExercise(exercise);
        });
    }

    public sortByUpdatedAt():void{
        this.exercises.sort(function(a, b) { return new Date(a.updatedAt!) > new Date(b.updatedAt!) ? -1 : new Date(a.updatedAt!) < new Date(b.updatedAt!) ? 1 : 0;} )
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
            this.filteredExercises = this.filteredExercises.sort((a, b) => (a.title < b.title) ? dir : dir * (-1));
        } else if (header === "Course") {
            this.filteredExercises = this.filteredExercises.sort((a, b) => (this.coursesToString(a.courses) < this.coursesToString(b.courses)) ? dir : dir * (-1));
        }else if (header === "Category") {
            this.filteredExercises = this.filteredExercises.sort((a, b) => (this.categoriesToString(a.categories) < this.categoriesToString(b.categories)) ? dir : dir * (-1));
        }else if (header === "Author") {
            this.filteredExercises = this.filteredExercises.sort((a, b) => (a.author < b.author) ? dir : dir * (-1));
        }else if (header === "Short Description") {
            this.filteredExercises = this.filteredExercises.sort((a, b) => (a.shortDescription < b.shortDescription) ? dir : dir * (-1));
        }else if (header === "Notes") {
//             this.filteredExercises = this.filteredExercises.sort((a, b) => (a.note < b.note) ? dir : dir * (-1));
        }else if (header === "Updated At") {
            this.filteredExercises = this.filteredExercises.sort((a, b) => (a.updatedAt < b.updatedAt) ? dir : dir * (-1));
        }else if (header === "Published") {
            this.filteredExercises = this.filteredExercises.sort((a, b) => (a.isPublished < b.isPublished) ? dir : dir * (-1));
        }else if (header === "Used") {
            this.filteredExercises = this.filteredExercises.sort((a, b) => (a.isUsed < b.isUsed) ? dir : dir * (-1));
        }
    }

    public coursesToString(courses: Course[]): string {
        return courses.map(course => course.name).join(", ");
    }

    public categoriesToString(categories: Category[] | Course[]) {
        return categories.map(c => c.name).join(", ");
    }

    public booleanToString(value: boolean): string {
        return value ? "Yes" : "No";
    }

    get isProfessor(): boolean {
        return this.authService.isProfessor;
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
        this.refreshExercises();
    }
}

