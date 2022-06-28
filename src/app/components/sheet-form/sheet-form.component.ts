import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {
    Author,
    Category,
    CategoryApiService,
    Course,
    CourseApiService,
    CreateCategoryDto,
    CreateCourseDto,
    Exercise,
    ExerciseApiService,
    ExerciseDto,
    Sheet,
    SheetApiService,
    SheetDto
} from "../../../../build/openapi";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {Location, ViewportScroller} from "@angular/common";
import {DataService} from "../../services/data.service";
import {AuthService} from "../../services/auth.service";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

@Component({
    selector: 'app-sheet-form',
    templateUrl: './sheet-form.component.html',
    styleUrls: ['./sheet-form.component.css']
})

export class SheetFormComponent implements OnInit, OnDestroy {
    @Input()
    public isCreateSheet: boolean = false;

    @Input()
    public isRandomizedSheet: boolean = false;

    @Input()
    public isCloneSheet: boolean = false;

    private sheetId: string = "";

    private sheet: Sheet;
    private sheetDto: SheetDto;

    public sheetForm: FormGroup;
    public authors: Author[] = [];
    public courses: Course[] = [];
    public categories: Category[] = [];
    public exercises: Exercise[] = [];
    public selectedExercises: Exercise[] = [];
    public numberExercises = 0;

    public filteredAuthorNames: String[] = [];
    public filteredCourseNames: String[] = [];
    public filteredCategoryNames: String[] = [];

    public pdfUrl = "";

    public isLoaded = false;
    public isPdfLoaded = true;
    private isSubmitted = false;

    public showAlert = false;
    public alertMessages: string[] = [];

    public page: number = 1;
    public pageSize: number = this.dataService.getPageSize();

    constructor(private route: ActivatedRoute,
                private router: Router,
                private location: Location,
                private viewportScroller: ViewportScroller,
                private sheetApiService: SheetApiService,
                private courseApiService: CourseApiService,
                private categoryApiService: CategoryApiService,
                private exerciseApiService: ExerciseApiService,
                private dataService: DataService,
                private authService: AuthService,
                private sanitizer: DomSanitizer) {
    }

    ngOnInit(): void {
        this.resetForm();
        this.dataService.existUnsavedChanges = false;

        this.sheetForm = new FormGroup({
            title: new FormControl("", [Validators.required, Validators.minLength(1)]),
            useNumericTitles: new FormControl(false),
            showSolutions: new FormControl(false),
            isPublished: new FormControl(false)
        });

        if (this.isRandomizedSheet) {
            this.sheetForm.addControl("courses", new FormControl("", [Validators.required, Validators.minLength(1)]));
            this.sheetForm.addControl("categories", new FormControl("", [Validators.required, Validators.minLength(1)]));
            this.sheetForm.addControl("numberExercises", new FormControl(1, [Validators.required]));
        } else if (this.isCreateSheet){
            this.sheetForm.addControl("exercises", new FormControl("", [Validators.required]));
            this.sheetForm.addControl("pageSize", new FormControl(this.dataService.getPageSize()));
        } else {
            this.sheetForm.addControl("courses", new FormControl("", [Validators.required, Validators.minLength(1)]));
            this.sheetForm.addControl("categories", new FormControl("", [Validators.required, Validators.minLength(1)]));
            this.sheetForm.addControl("exercises", new FormControl("", [Validators.required]));
            this.sheetForm.addControl("pageSize", new FormControl(this.dataService.getPageSize()));
        }

        if (this.isCreateSheet) {
            this.isLoaded = true;
        } else {
            this.route.params.subscribe(params => {
                this.sheetId = params["id"];
                this.loadSheet(this.sheetId);
            });
        }

        this.loadCourses();
        this.loadCategories();
        this.loadExercises();
    }

    ngOnDestroy() {
        this.dataService.existUnsavedChanges = false;
    }

    get isProfessor(): boolean {
        return this.authService.isProfessor;
    }

    private loadSheet(id: string): void {
        this.sheetApiService.getSheetById(id).subscribe({
            next: response => {
                this.sheet = response;

                this.sheetForm = new FormGroup({
                    title: new FormControl(this.sheet.title, [Validators.required, Validators.minLength(1)]),
                    courses: new FormControl(this.sheet.courses, [Validators.required, Validators.minLength(1)]),
                    categories: new FormControl(this.sheet.categories, [Validators.required, Validators.minLength(1)]),
                    exercises: new FormControl(this.sheet.exercises, [Validators.required, Validators.minLength(1)]),
                    isPublished: new FormControl(this.sheet.isPublished)
                });

                this.isLoaded = true;
            },
            error: err => {
                console.log(err);
                this.isLoaded = true;
                this.displayAlert("Sheet not found.");
            }
        });
    }

    private loadCourses(): void {
        this.courseApiService.getAllCourses().subscribe({
            next: response => this.courses = response,
            error: error => {
                console.log(error);
                this.displayAlert("Error while loading courses.");
            }
        });
    }

    private loadCategories(): void {
        this.categoryApiService.getAllCategories().subscribe({
            next: response => this.categories = response,
            error: error => {
                console.log(error);
                this.displayAlert("Error while loading categories.");
            }
        });
    }

    private loadExercises(): void {
        this.exerciseApiService.getAllExercises().subscribe({
            next: response => this.exercises = response,
            error: error => {
                console.log(error);
                this.displayAlert("Error while loading exercises.");
            }
        });
    }

    get filteredExercises(): Exercise[] {
        return this.exercises.filter((exercise: Exercise) => {
            if (this.filteredAuthorNames.length) {
                return this.filteredAuthorNames.includes(exercise.author.name);
            }
            return true;
        }).filter((exercise: Exercise) => {
            if (this.filteredCategoryNames.length) {
                return exercise.categories.map((category: Category) => category.name)
                    .some((categoryName: String) => this.filteredCategoryNames
                        .includes(categoryName));
            }
            return true;
        }).filter((exercise: Exercise) => {
            if (this.filteredCourseNames.length) {
                return exercise.courses.map((course: Course) => course.name)
                    .some((courseName: String) => this.filteredCourseNames
                        .includes(courseName));
            }
            return true;
        });
    }

    private randomizedExercises(): void {
        const randomCourseNames = this.sheetDto.courses.map((course: Course) => course.name);
        const randomCategoryNames = this.sheetDto.categories.map((category: Category) => category.name);
        const randomExercises = this.exercises.filter((exercise: Exercise) => {
                    if (randomCourseNames.length) {
                        return exercise.courses.map((course: Course) => course.name)
                            .some((courseName: string) => randomCourseNames
                                .includes(courseName));
                    }
                    return true;
                }).filter((exercise: Exercise) => {
                    if (randomCategoryNames.length) {
                        return exercise.categories.map((category: Category) => category.name)
                            .some((categoryName: string) => randomCategoryNames
                                .includes(categoryName));
                    }
                    return true;
                });

        this.sheetDto.exercises = [...randomExercises].sort(() => 0.5 - Math.random()).slice(0, this.numberExercises);
    }

    public selectExercise(exercise: Exercise) {
        if (!this.selectedExercises.includes(exercise)){
            this.selectedExercises.push(exercise);
        } else {
            const indexOfExercise = this.selectedExercises.findIndex((e) => {
                return e.id === exercise.id;
            });
            if (indexOfExercise !== -1) {
              this.selectedExercises.splice(indexOfExercise, 1);
            }
        }
        this.onFormChange();
    }

    public toggleCheckbox(val: string): void {
        this.onFormChange();
        if (val = 'useNumericTitles'){
                this.sheetDto.useNumericTitles = !this.sheetDto.useNumericTitles;
        }
        if (val = 'showSolutions'){
                this.sheetDto.showSolutions = !this.sheetDto.showSolutions;
        }
        if (val = 'isPublished'){
                this.sheetDto.isPublished = !this.sheetDto.isPublished;
        }
    }

    get sheetExercises(): Exercise[] {
        return this.sheet.exercises;
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
                console.log(err);
                this.displayAlert("Error while updating exercise.")
                exercise.isPublished = originalIsPublished;
                exercise.isUsed = originalIsUsed;
            }
        });
    }

    public removeExercise(id: string) {
        const confirm = window.confirm("Are you sure you want to delete this exercise?");
        if (confirm) {
            this.exerciseApiService.deleteExercise(id).subscribe({
                next: () => {
                    this.loadExercises();
                },
                error: error => {
                    console.log(error);
                    this.displayAlert('Error while trying to delete an exercise.');
                }
            });
        }
    }

    public getCoursesString(courses: Course[]): string {
        return courses.map(course => course.name).join(", ");
    }

    public getCategoriesString(categories: Category[]): string {
        return categories.map(category => category.name).join(", ");
    }

    public booleanToString(value: boolean): string {
        if(value){
            return "Yes";
        }else{
            return "No";
        }
    }

    public onFormChange(event?: Event): void {
        let courses: CreateCourseDto[] = [];
        let categories: CreateCategoryDto[] = [];
        let exercises: Exercise[] = [];

        if (this.isSubmitted) {
            return;
        }

        if (this.isRandomizedSheet){
            if (this.sheetForm.controls["courses"].value?.length) {
                courses = this.sheetForm.controls["courses"].value.map((course: any) => {
                    const newCourse: CreateCourseDto = {name: course.name};
                    return newCourse;
                });
            }

            if (this.sheetForm.controls["categories"].value?.length) {
                categories = this.sheetForm.controls["categories"].value.map((category: any) => {
                    const newCategory: CreateCategoryDto = {name: category.name};
                    return newCategory;
                });
            }

            this.numberExercises = this.sheetForm.controls["numberExercises"].value;

        } else if (this.isCreateSheet){
            this.selectedExercises.flatMap(exercise => exercise.courses).filter((course: Course) => {
                let i = courses.findIndex(c => c.name === course.name);
                if (i < 0) {
                    courses.push(course);
                }
               return null;
            })

            this.selectedExercises.flatMap(exercise => exercise.categories).filter((category: Category) => {
                let i = categories.findIndex(c => c.name === category.name);
                if (i < 0) {
                    categories.push(category);
                }
               return null;
            })

            exercises = this.selectedExercises;

        }else{
            if (this.sheetForm.controls["courses"].value?.length) {
                courses = this.sheetForm.controls["courses"].value.map((course: any) => {
                    const newCourse: CreateCourseDto = {name: course.name};
                    return newCourse;
                });
            }

            if (this.sheetForm.controls["categories"].value?.length) {
                categories = this.sheetForm.controls["categories"].value.map((category: any) => {
                    const newCategory: CreateCategoryDto = {name: category.name};
                    return newCategory;
                });
            }
        }


        this.sheetDto = {
            title: this.sheetForm.controls["title"].value,
            courses: courses,
            categories: categories,
            exercises: exercises,
        }
        console.log(this.sheetDto);
//         this.checkUnsavedChanges();
    }

    private checkUnsavedChanges(): void {
        this.dataService.existUnsavedChanges = Boolean(this.sheetForm.controls["title"].value.length ||
            this.sheetForm.controls["courses"].value &&
            this.sheetForm.controls["courses"].value.some((course: { name: string }) => course.name.length) ||
            this.sheetForm.controls["categories"].value &&
            this.sheetForm.controls["categories"].value.some((category: { name: string }) => category.name.length));
    }

    public viewSheetPdf(): void {
        this.isPdfLoaded = false;

        this.sheetApiService.previewSheetDto(this.sheetDto).subscribe({
            next: response => {
                const pdf = new Blob([response], {type: "application/pdf"});
                this.pdfUrl = URL.createObjectURL(pdf);

                this.isPdfLoaded = true;
                this.viewportScroller.scrollToPosition([0, 0]);
            },
            error: err => {
                console.log(err);
                this.displayAlert("Error while trying to get PDF.");
                this.isPdfLoaded = true;
            }
        });
    }

    public viewExercisePdf(id: string): void {
        window.open("exercise/" + id + "/pdf");
    }

    public onSubmit(goBack: boolean): void {
        if (this.isCreateSheet || this.isCloneSheet) {
            if (this.isRandomizedSheet){
                this.randomizedExercises();
            }
            this.sheetApiService.createSheet(this.sheetDto).subscribe({
                next: () => {
                    this.sheetDto.exercises.forEach(exercise => {
                        exercise.isPublished = true;
                        exercise.isUsed = true;

                        this.updateExercise(exercise);
                    })
                    this.isSubmitted = true;
                    this.resetForm();
                    if (goBack) {
                        this.location.back();
                    }
                },
                error: err => {
                    console.log(err);
                    this.displayAlert("Error while creating sheet.");
                }
            });
        } else {
            this.sheetApiService.updateSheet(this.sheetId, this.sheetDto).subscribe({
                next: () => {
                    this.isSubmitted = true;
                    this.resetForm();
                    if (goBack) {
                        this.location.back();
                    }
                },
                error: err => {
                    console.log(err);
                    this.displayAlert("Error while updating sheet.");
                }
            });
        }

        if (!goBack) {
            this.viewportScroller.scrollToPosition([0, 0]);
        }
    }

    private resetForm(): void {
        this.sheetForm?.reset();
        this.dataService.existUnsavedChanges = false;
    }

    public getSanitizedUrl(url: string): SafeResourceUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

    public displayAlert(message: string): void {
        this.alertMessages.push(message);
    }

    public closeAlert(message: string): void {
         this.alertMessages = this.alertMessages.filter(m => m !== message);
    }

    public setPageSize(event: Event): void {
        this.pageSize = Number(event);
        this.dataService.savePageSize(this.pageSize);
    }
}
