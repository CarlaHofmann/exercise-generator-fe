import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Category, Course, Exercise, ExerciseApiService, ExerciseDto} from 'build/openapi';
import {DataService} from "../../services/data.service";
import { FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms'

@Component({
    selector: 'app-exercise-database',
    templateUrl: './exercise-database.component.html',
    styleUrls: ['./exercise-database.component.css']
})
export class ExerciseDatabaseComponent implements OnInit {

    public exercises: Exercise[] = [];
    public filteredExercises: Exercise[] = [];

    private searchString: string = '';
    public categories: string[] = [];
    public courses: string[] = [];
    public authors: string[] = [];
    private categoriesFilter: string[] = [];
    private coursesFilter: string[] = [];

    public page = 1;
    public pageSize = this.dataService.getPageSize();

    public showAlert = false;
    public alertMessage = "";
    public isLoaded = false;
    public showLoading = true;

    // filter form
    filterForm: FormGroup;

    public applyFilters() : void{

        this.filteredExercises =  Object.assign([], this.exercises);
        for(let filter of this.filterForm.value.filters)
        {
            switch(filter.choice) {
                case "Category": {
                   this.filteredExercises = this.filteredExercises
                   .filter(exercise => (filter.value.length == 0 || (filter.value as string[]).some(x => exercise.categories.map(el => el.name).includes(x))));
                   break;
                }
                case "Course": {
                    this.filteredExercises = this.filteredExercises
                    .filter(exercise => (filter.value.length == 0 || (filter.value as string[]).some(x => exercise.courses.map(el => el.name).includes(x))));
                   break;
                }
                case "Author": {
                    this.filteredExercises = this.filteredExercises
                    .filter(exercise => (filter.value.length == 0 || (filter.value as string[]).includes(exercise.author.name)));
                   break;
                }
                case "ShortDescription": {
                    this.filteredExercises = this.filteredExercises
                    .filter(exercise => (filter.value.length == 0 || exercise.shortDescription.toLowerCase().includes(filter.value)));
                   break;
                }
                case "Title": {
                    this.filteredExercises = this.filteredExercises
                    .filter(exercise => (filter.value.length == 0 || exercise.title.toLowerCase().includes(filter.value.toLowerCase())));
                   break;
                }
                case "Notes": {
                    this.filteredExercises = this.filteredExercises
                    .filter(exercise => (filter.value.length == 0 || (filter.contains == exercise.note?.toLowerCase().includes(filter.value))));
                   break;
                }


             }

        }

      /*  this.filteredExercises = this.exercises
        .filter(exercise => (this.categoriesFilter.length == 0 || this.categoriesFilter.some(x => exercise.categories.map(el => el.name).includes(x))))
        .filter(exercise => (this.coursesFilter.length == 0 || this.coursesFilter.some(x => exercise.courses.map(el => el.name).includes(x))))
        .filter(exercise => (this.searchString.length == 0 || exercise.note?.toLowerCase().includes(this.searchString)));
*/
    }

    public addFilter() : void{

        this.filters().push(this.fb.group({
            choice: '',
            contains: true,
            value: [],
          })  );

    }

    public removeFilter(index : number): void{
        this.filters().removeAt(index);
        this.applyFilters();

    }

    public removeAllFilters(): void{
        this.filters().clear();
        this.applyFilters();
    }

    filters() : FormArray {
        return this.filterForm.get("filters") as FormArray
    }

    constructor(private authService: AuthService,
                private dataService: DataService,
                private exerciseApiService: ExerciseApiService,
                private fb:FormBuilder) {
                    this.filterForm = this.fb.group({
                        name: '',
                        filters: this.fb.array([]) ,
                      });

    }

    ngOnInit(): void {
        this.loadExercises();
    }


    get isProfessor(): boolean {
        return this.authService.isProfessor;
    }

    public categoriesToString(categories: Category[] | Course[]) {
        return categories.map(c => c.name).join(", ");
    }

    public displayAlert(message: string): void {
        this.alertMessage = message;
        this.showAlert = true;
    }

    public closeAlert(): void {
        this.showAlert = false;
    }

    public removeExercise(id: string) {
        const confirm = window.confirm("Are you sure you want to delete this exercise?");
        if (confirm) {
            this.exerciseApiService.deleteExercise(id).subscribe({
                next: () => {
                    this.loadExercises();
                    this.refreshExercises();
                },
                error: error => {
                    this.alertMessage = 'Error while trying to delete an exercise.';
                    this.showAlert = true;
                    console.log(error);
                }
            });
        }
    }

    private refreshFilterData(): void {
        this.categories = Array.from(new Set(this.filteredExercises.reduce((previous, next) => previous.concat(next.categories.map(el => el.name)), new Array<string>())).values());
        this.courses = Array.from(new Set(this.filteredExercises.reduce((previous, next) => previous.concat(next.courses.map(el => el.name)), new Array<string>())).values());
    }

    private loadExercises(): any {
        this.exerciseApiService.getAllExercises().subscribe({
            next: data => {
                this.exercises = data;
                this.categories = Array.from(new Set(this.exercises.reduce((previous, next) => previous.concat(next.categories.map(el => el.name)), new Array<string>())).values());
                this.courses = Array.from(new Set(this.exercises.reduce((previous, next) => previous.concat(next.courses.map(el => el.name)), new Array<string>())).values());
                if (!this.isProfessor) this.authors = Array.from(new Set(this.exercises.map((elem) => elem.author.name)).values());
                this.refreshExercises();
                this.isLoaded = true;
                this.showLoading = false;
            },
            error: error => {
                this.displayAlert('Error loading from the database: ' + error.message);
                this.showLoading = false;
                console.log(error);
            }
        });
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

    public refreshExercises() {
        this.filteredExercises = this.exercises
            .filter(exercise => (this.categoriesFilter.length == 0 || this.categoriesFilter.some(x => exercise.categories.map(el => el.name).includes(x))))
            .filter(exercise => (this.coursesFilter.length == 0 || this.coursesFilter.some(x => exercise.courses.map(el => el.name).includes(x))))
            .filter(exercise => (this.searchString.length == 0 || exercise.note?.toLowerCase().includes(this.searchString)));
        this.refreshFilterData();
    }

    public onSearchChange(event: any) {
        this.searchString = event.target.value.toLowerCase();
        this.refreshExercises();
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

    private updateExercise(exercise: Exercise): void{
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
                this.alertMessage = "Error while updating exercise.";
                this.showAlert = true;
                console.log(err);
                exercise.isPublished = originalIsPublished;
                exercise.isUsed = originalIsUsed;
            }
        });
    }

    public setPageSize(event: Event): void {
        this.pageSize = Number(event);
        this.dataService.savePageSize(this.pageSize);
        this.refreshExercises();
    }

    public viewExercisePdf(id: string): void {
        window.open("exercise/" + id + "/pdf");
    }
}

