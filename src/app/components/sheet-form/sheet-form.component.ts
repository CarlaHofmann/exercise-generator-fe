import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {
    Course,
    CreateCourseDto,
    Category,
    CreateCategoryDto,
    Exercise,
    ExerciseApiService,
    Sheet,
    SheetApiService,
    SheetDto
} from "../../../../build/openapi";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {Location, ViewportScroller} from "@angular/common";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {DataService} from "../../services/data.service";
import {AuthService} from "../../services/auth.service";

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
    public authors: string[] = [];
    public courses: string[] = [];
    public categories: string[] = [];
    public exercises: Exercise[] = [];
    public sheetExercises: Exercise[] = [];
    public numberExercises = 0;

    public filterForm: FormGroup;
    public filteredExercises: Exercise[] = [];
    private categoriesFilter: string[] = [];
    private coursesFilter: string[] = [];
    private searchString: string = '';

    private orderMap = [{key: "Select", dir: "asc"},
                        {key: "Title", dir: "asc"},
                        {key: "Course", dir: "asc"},
                        {key: "Category", dir: "asc"},
                        {key: "Author", dir: "asc"},
                        {key: "Short Description", dir: "asc"},
                        {key: "Notes", dir: "asc"},
                        {key: "Updated At", dir: "asc"},
                        {key: "Published", dir: "asc"},
                        {key: "Used", dir: "asc"}];

    public pdfUrl = "";

    public isSheetLoaded = false;
    public isExerciseLoaded = false;
    public isPdfLoaded = true;
    public isSubmitting = false;

    public showAlert = false;
    public alertMessage = "";

    public page: number = 1;
    public pageSize: number = this.dataService.getPageSize();

    constructor(private route: ActivatedRoute,
                private router: Router,
                private location: Location,
                private viewportScroller: ViewportScroller,
                private sheetApiService: SheetApiService,
                private exerciseApiService: ExerciseApiService,
                private dataService: DataService,
                private authService: AuthService,
                private sanitizer: DomSanitizer,
                private fb:FormBuilder) {

                this.filterForm = this.fb.group({name: '', filters: this.fb.array([]), });
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
            this.sheetForm.addControl("numberExercises", new FormControl(1));
        } else if (this.isCreateSheet){
            this.sheetForm.addControl("pageSize", new FormControl(this.dataService.getPageSize()));
        } else {
            this.sheetForm.addControl("courses", new FormControl("", [Validators.required, Validators.minLength(1)]));
            this.sheetForm.addControl("categories", new FormControl("", [Validators.required, Validators.minLength(1)]));
            this.sheetForm.addControl("pageSize", new FormControl(this.dataService.getPageSize()));
        }

        if (this.isCreateSheet) {
            this.isSheetLoaded = true;
        } else {
            this.route.params.subscribe(params => {
                this.sheetId = params["id"];
                this.loadSheet(this.sheetId);
            });
        }

        this.loadExercises();
        this.viewportScroller.scrollToPosition([0, 0]);
    }

    ngOnDestroy() {
        this.dataService.existUnsavedChanges = false;
    }

    public filters() : FormArray {
        return this.filterForm.get("filters") as FormArray
    }

    public applyFilters() : void{

        this.filteredExercises =  Object.assign([], this.exercises);
        for(let filter of this.filterForm.value.filters)
        {
            switch(filter.choice) {
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

    public addFilter() : void{
        this.filters().push(this.fb.group({
            choice: '',
            contains: true,
            value: [],
          })  );
    }

    private refreshFilterData(): void {
        this.categories = Array.from(new Set(this.filteredExercises.reduce((previous, next) => previous.concat(next.categories.map(el => el.name)).sort((a, b) => (a < b) ? -1 : 1), new Array<string>())).values());
        this.courses = Array.from(new Set(this.filteredExercises.reduce((previous, next) => previous.concat(next.courses.map(el => el.name)).sort((a, b) => (a < b) ? -1 : 1), new Array<string>())).values());
    }

    public removeFilter(index : number): void{
        this.filters().removeAt(index);
        this.applyFilters();
    }

    public removeAllFilters(): void{
        this.filters().clear();
        this.applyFilters();
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
                    isPublished: new FormControl(this.sheet.isPublished),
                    pageSize: new FormControl(this.dataService.getPageSize())
                });

                this.sheetExercises = this.sheet.exercises;
                this.isSheetLoaded = true;
            },
            error: err => {
                this.displayAlert("Sheet not found.", err);
                this.isSheetLoaded = true;
            }
        });
    }

    get sheetCourses(): string {
        this.onFormChange();
        return this.sheetDto.courses.length ?
                this.sheetDto.courses.map((course: Course) => course.name).join(', ') : "-";
    }

    get sheetCategories(): string {
        this.onFormChange();
        return this.sheetDto.categories.length ?
                this.sheetDto.categories.map((category: Category) => category.name).join(', ') : "-";
    }

    private loadExercises(): void {
        this.exerciseApiService.getAllExercises().subscribe({
            next: response => {
                this.exercises = response;
                this.categories = Array.from(new Set(this.exercises.reduce((previous, next) => previous.concat(next.categories.map(el => el.name)).sort((a, b) => (a < b) ? -1 : 1), new Array<string>())).values());
                this.courses = Array.from(new Set(this.exercises.reduce((previous, next) => previous.concat(next.courses.map(el => el.name)).sort((a, b) => (a < b) ? -1 : 1), new Array<string>())).values());
                if (!this.isProfessor) this.authors = Array.from(new Set(this.exercises.map((elem) => elem.author.username)).values());
                this.refreshExercises();
                this.isExerciseLoaded = true;
            },
            error: err => {
                this.displayAlert("Error while loading exercises.", err);
                this.isExerciseLoaded = true;
            }
        });
    }

    public refreshExercises() {
        this.filteredExercises = this.exercises
            .filter(exercise => (this.categoriesFilter.length == 0 || this.categoriesFilter.some(x => exercise.categories.map(el => el.name).includes(x))))
            .filter(exercise => (this.coursesFilter.length == 0 || this.coursesFilter.some(x => exercise.courses.map(el => el.name).includes(x))))
            .filter(exercise => (this.searchString.length == 0 || exercise.note?.toLowerCase().includes(this.searchString)));
        if (this.isCreateSheet) this.filteredExercises = this.filteredExercises.sort((a, b) => (a.updatedAt < b.updatedAt) ? 1 : -1);
        if (!this.isCreateSheet) this.filteredExercises = this.filteredExercises.sort((a, b) => (this.isSheetExercise(a) < this.isSheetExercise(b)) ? 1 : -1);
        this.refreshFilterData();
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

        this.sheetExercises = [...randomExercises].sort(() => 0.5 - Math.random()).slice(0, this.numberExercises);
        this.onFormChange();
    }

    public selectExercise(exercise: Exercise) {
        if (!this.sheetExercises.includes(exercise)) {
            this.sheetExercises.push(exercise);
        } else {
            const indexOfExercise = this.sheetExercises.findIndex((e) => {
                return e.id === exercise.id;
            });
            if (indexOfExercise !== -1) {
                this.sheetExercises.splice(indexOfExercise, 1);
            }
        }
        this.onFormChange();
    }

    public toggleCheckbox(val: string): void {
        this.onFormChange();
        if (val === 'useNumericTitles') {
            this.sheetDto.useNumericTitles = !this.sheetDto.useNumericTitles;
        }
        if (val === 'showSolutions') {
            this.sheetDto.showSolutions = !this.sheetDto.showSolutions;
        }
        if (val === 'isPublished') {
            this.sheetDto.isPublished = !this.sheetDto.isPublished;
        }
    }

    public removeExercise(id: string) {
        const confirm = window.confirm("Are you sure you want to delete this exercise?");
        if (confirm) {
            this.exerciseApiService.deleteExercise(id).subscribe({
                next: () => {
                    this.loadExercises();
                },
                error: err => {
                    this.displayAlert('Error while deleting exercise.', err);
                }
            });
        }
    }

    public onFormChange(event?: Event): void {
        let courses: CreateCourseDto[] = [];
        let categories: CreateCategoryDto[] = [];
        let exercises: string[] = [];

        if (this.isRandomizedSheet) {
            if (this.sheetForm.controls["courses"].value?.length) {
                courses = this.sheetForm.controls["courses"].value.map((courseName: any) => {
                    const newCourse: CreateCourseDto = {name: courseName};
                    return newCourse;
                });
            }

            if (this.sheetForm.controls["categories"].value?.length) {
                categories = this.sheetForm.controls["categories"].value.map((categoryName: any) => {
                    const newCategory: CreateCategoryDto = {name: categoryName};
                    return newCategory;
                });
            }

            this.numberExercises = this.sheetForm.controls["numberExercises"].value;

        } else {
            this.sheetExercises.flatMap(exercise => exercise.courses).filter((course: Course) => {
                let i = courses.findIndex(c => c.name === course.name);
                if (i < 0) {
                    courses.push(course);
                }
                return null;
            })

            this.sheetExercises.flatMap(exercise => exercise.categories).filter((category: Category) => {
                let i = categories.findIndex(c => c.name === category.name);
                if (i < 0) {
                    categories.push(category);
                }
                return null;
            })
        }

        exercises = this.exercisesToStringArray(this.sheetExercises);

        this.sheetDto = {
            title: this.sheetForm.controls["title"].value,
            courses: courses,
            categories: categories,
            exercises: exercises,
        }

        this.checkUnsavedChanges();
    }

    private checkUnsavedChanges(): void {
        if (this.isRandomizedSheet) {
            this.dataService.existUnsavedChanges = Boolean(this.sheetForm.controls["title"].value.length ||
                this.sheetForm.controls["courses"].value &&
                this.sheetForm.controls["courses"].value.length ||
                this.sheetForm.controls["categories"].value &&
                this.sheetForm.controls["categories"].value.length);
        }
         else {
            this.dataService.existUnsavedChanges = Boolean(this.sheetForm.controls["title"].value.length);
        }
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

        if (header === "Select") {
            this.filteredExercises = this.filteredExercises.sort((a, b) => (this.isSheetExercise(a) < this.isSheetExercise(b)) ? dir : dir * (-1));
        } else if (header === "Title") {
            this.filteredExercises = this.filteredExercises.sort((a, b) => (a.title.toLowerCase() < b.title.toLowerCase()) ? dir : dir * (-1));
        } else if (header === "Course") {
            this.filteredExercises = this.filteredExercises.sort((a, b) => (this.coursesToString(a.courses).toLowerCase() < this.coursesToString(b.courses).toLowerCase()) ? dir : dir * (-1));
        }else if (header === "Category") {
            this.filteredExercises = this.filteredExercises.sort((a, b) => (this.categoriesToString(a.categories).toLowerCase() < this.categoriesToString(b.categories).toLowerCase()) ? dir : dir * (-1));
        }else if (header === "Author") {
            this.filteredExercises = this.filteredExercises.sort((a, b) => (a.author.username.toLowerCase() < b.author.username.toLowerCase()) ? dir : dir * (-1));
        }else if (header === "Short Description") {
            this.filteredExercises = this.filteredExercises.sort((a, b) => (a.shortDescription.toLowerCase() < b.shortDescription.toLowerCase()) ? dir : dir * (-1));
        }else if (header === "Notes") {
            this.filteredExercises = this.filteredExercises.sort((a, b) => (a.note!.toLowerCase() < b.note!.toLowerCase()) ? dir : dir * (-1));
        }else if (header === "Updated At") {
            this.filteredExercises = this.filteredExercises.sort((a, b) => (a.updatedAt < b.updatedAt) ? dir : dir * (-1));
        }else if (header === "Published") {
            this.filteredExercises = this.filteredExercises.sort((a, b) => (a.isPublished < b.isPublished) ? dir : dir * (-1));
        }else if (header === "Used") {
            this.filteredExercises = this.filteredExercises.sort((a, b) => (a.isUsed < b.isUsed) ? dir : dir * (-1));
        }
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
                this.displayAlert("Error while trying to get PDF.", err);
                this.isPdfLoaded = true;
            }
        });
    }

    public viewExercisePdf(id: string): void {
        window.open("exercise/" + id + "/pdf");
    }

    public onSubmit(goBack: boolean): void {
        this.isSubmitting = true;

        if (this.isCreateSheet || this.isCloneSheet) {
            if (this.isRandomizedSheet) {
                this.randomizedExercises();
            }
            this.sheetApiService.createSheet(this.sheetDto).subscribe({
                next: () => {
                    this.isSubmitting = false;
                    this.resetForm();
                    if (goBack) {
                        this.location.back();
                    }
                },
                error: err => {
                    this.displayAlert("Error while creating sheet.", err);
                    this.isSubmitting = false;
                }
            });
        } else {
            this.sheetApiService.updateSheet(this.sheetId, this.sheetDto).subscribe({
                next: () => {
                    this.isSubmitting = false;
                    this.resetForm();
                    if (goBack) {
                        this.location.back();
                    }
                },
                error: err => {
                    this.displayAlert("Error while updating sheet.", err);
                    this.isSubmitting = false;
                }
            });
        }

        if (!goBack) {
            this.viewportScroller.scrollToPosition([0, 0]);
        }
    }

    private resetForm(): void {
        const originalPageSize = this.dataService.getPageSize();
        this.sheetForm?.reset();
        this.dataService.existUnsavedChanges = false;
        this.pageSize = originalPageSize;
        this.dataService.savePageSize(originalPageSize);
    }

    public coursesToString(courses: Course[]): string {
        return courses.map(course => course.name).join(", ");
    }

    public categoriesToString(categories: Category[]): string {
        return categories.map(category => category.name).join(", ");
    }

    public booleanToString(value: boolean): string {
        return value ? "Yes" : "No";
    }

    private exercisesToStringArray(exercises: Exercise[]): string[]{
        const exercisesStringArray: string[] = [];
        for (let i=0; i < exercises.length; i++) {
            exercisesStringArray.push(exercises[i]["id"])
        }
        return exercisesStringArray;
    }

    public isSheetExercise(exercise: Exercise) {
        return this.sheetExercises.some(elem => elem.id === exercise.id);
    }

    public getSanitizedUrl(url: string): SafeResourceUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
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
    }
}
