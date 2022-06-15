import {AfterViewInit, Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Category, CreateCategoryDto, CreateCourseDto, Exercise, ExerciseApiService, ExerciseDto} from 'build/openapi';
import {DataService} from "../../services/data.service";

@Component({
    selector: 'app-exercise-database',
    templateUrl: './exercise-database.component.html',
    styleUrls: ['./exercise-database.component.css']
})
export class ExerciseDatabaseComponent implements OnInit, AfterViewInit {

    public dataSource: Exercise[] = [];
    public displayExercises: Exercise[] = [];


    private searchString: string = '';
    public categories: string[] = [];
    public courses: string[] = [];
    private categoriesFilter: string[] = [];
    private coursesFilter: string[] = [];

    public page: number = 1;
    public pageSize: number = this.dataService.getPageSize();

    public showAlert = false;
    public alertMessage = "";
    public isLoaded: boolean = false;


    constructor(private authService: AuthService,
                private dataService: DataService,
                private exerciseApiService: ExerciseApiService) {
    }

    ngOnInit(): void {
        this.loadExercises();
    }

    public ngAfterViewInit() {

    }


    get isProfessor(): boolean {
        return this.authService.isProfessor;
    }

    public categoriesToString(cats: Category[]) {

        var s: string = "";
        for (let i = 0; i < cats.length; i++) {
            if (i == 0)
                s += cats[i].name
            else
                s += ' , ' + cats[i].name;
        }
        return s;
    }

    public displayAlert(message: string): void {
        this.alertMessage = message;
        this.showAlert = true;
    }

    public closeAlert(): void {
        this.showAlert = false;
    }

    public removeExercise(id: string) {

        this.exerciseApiService.deleteExercise(id).subscribe({
            next: data => {
                // TODO: dialog
                this.loadExercises();
                //refresh list
            },
            error: error => {
                // alert('There was an error: ' + error.message);
                this.alertMessage = 'Error while trying to delete an exercise.';
                console.log(error);
                this.showAlert = true;
            }
        });
    }

    public toggleCheckbox(id: string, value: any) {

        return this.exerciseApiService.isUsedUpdate(id, !value).subscribe({
            next: data => {
                return true;
            },
            error: error => {
                this.displayAlert('Error sending ckeck/unckeck to backend.');
                console.log(error);
                return false;
            }
        });

    }


    public refreshFilterData(): void {
        this.categories = Array.from(new Set(this.displayExercises.reduce((previous, next) => previous.concat(next.categories.map(el => el.name)), new Array<string>())).values());
        this.courses = Array.from(new Set(this.displayExercises.reduce((previous, next) => previous.concat(next.courses.map(el => el.name)), new Array<string>())).values());
    }

    public loadExercises(): any {
        // >>>>>> HARDCODED VALUES (uncomment the following 4 lines)
        /*this.dataSource = this.EXERCISES_HARDCODED;
        this.categories = Array.from((new Set(this.dataSource.map(element=> element.category))).values());
        this.refreshExercises()
        return true;*/

        this.exerciseApiService.getAllExercises().subscribe({
            next: data => {
                this.dataSource = data;
                this.categories = Array.from(new Set(this.dataSource.reduce((previous, next) => previous.concat(next.categories.map(el => el.name)), new Array<string>())).values());
                this.courses = Array.from(new Set(this.dataSource.reduce((previous, next) => previous.concat(next.courses.map(el => el.name)), new Array<string>())).values());
                this.refreshExercises();
                this.isLoaded = true;
            },
            error: error => {
                this.displayAlert('Error loading from the database.');
                console.log(error);
            }
        });
    }


    public filterCategories(values: any): void {
        if (values.length > 0)
            this.categoriesFilter = values;
        else
            this.categoriesFilter = [];
        this.refreshExercises()
    }

    public filterCourses(values: any): void {
        if (values.length > 0)
            this.coursesFilter = values;
        else
            this.coursesFilter = [];
        this.refreshExercises()
    }


    public refreshExercises() {
        this.displayExercises = this.dataSource
            .filter(exercise => (this.categoriesFilter.length == 0 || this.categoriesFilter.some(x => exercise.categories.map(el => el.name).includes(x))))
            .filter(exercise => (this.coursesFilter.length == 0 || this.coursesFilter.some(x => exercise.courses.map(el => el.name).includes(x))))
            .filter(exercise => (this.searchString.length == 0 || exercise.note?.toLowerCase().includes(this.searchString)));
        this.refreshFilterData();
    }

    public onSearchChange(event: any) {
        this.searchString = event.target.value.toLowerCase();
        this.refreshExercises();
    }

    public uncheckAll(): void {
        this.exerciseApiService.isUsedReset().subscribe({
            next: data => {
                for (var el of this.dataSource) {
                    el.isUsed = false;
                }
            },
            error: error => {
                // alert('There was an error: ' + error.message);
                this.alertMessage = 'Error while trying to reset all the checkboxes: ' + error.message;
                this.showAlert = true;
            }
        });

    }

    public saveNotes(id: string, value: string) {
        var ex = this.dataSource.find(el => {
            return el.id == id;
        })
        var updatedExercise: ExerciseDto = {
            title: ex?.title!,
            note: value,
            shortDescription: ex?.shortDescription,
            texts: ex?.texts!,
            solutions: ex?.solutions!,
            images: ex?.images,
            courses: ex?.courses?.map(el => {
                let e: CreateCourseDto = {name: el.name!};
                return e;
            })!,
            categories: ex?.courses?.map(el => {
                let e: CreateCategoryDto = {name: el.name!};
                return e;
            })!,
        };


        this.exerciseApiService.updateExercise(id, updatedExercise).subscribe({
            next: data => {
                for (var el of this.dataSource) {
                    if (el.id == id)
                        el.note = value;
                }
                for (var el of this.displayExercises) {
                    if (el.id == id)
                        el.note = value;
                }
            },
            error: error => {
                // alert('There was an error: ' + error.message);
                this.alertMessage = 'Error while trying to edit a note: ' + error.message;
                this.showAlert = true;
            }
        });
    }

    public setPageSize(event: Event): void {
        this.pageSize = Number(event);
        this.dataService.savePageSize(this.pageSize);
        this.refreshExercises();
    }
}

