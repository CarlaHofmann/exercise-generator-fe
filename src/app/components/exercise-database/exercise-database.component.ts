import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Category, Course, Exercise, ExerciseApiService, ExerciseDto} from 'build/openapi';
import {DataService} from "../../services/data.service";

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
    private categoriesFilter: string[] = [];
    private coursesFilter: string[] = [];

    public page = 1;
    public pageSize = this.dataService.getPageSize();

    public showAlert = false;
    public alertMessage = "";
    public isLoaded = false;
    public showLoading = true;


    constructor(private authService: AuthService,
                private dataService: DataService,
                private exerciseApiService: ExerciseApiService) {
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

