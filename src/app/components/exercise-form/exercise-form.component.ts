import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {
    Category,
    CategoryApiService,
    Course,
    CourseApiService,
    CreateCategoryDto,
    CreateCourseDto,
    Exercise,
    ExerciseApiService,
    ExerciseDto,
    ImageDto
} from "../../../../build/openapi";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {Location, ViewportScroller} from "@angular/common";
import {DataService} from "../../services/data.service";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

@Component({
    selector: 'app-exercise-form',
    templateUrl: './exercise-form.component.html',
    styleUrls: ['./exercise-form.component.css']
})
export class ExerciseFormComponent implements OnInit, OnDestroy {
    @Input()
    public isAddExercise: boolean = true;

    @Input()
    public isCloneExercise: boolean = false;

    private exerciseId: string = "";

    private exercise: Exercise;
    private exerciseDto: ExerciseDto;

    public images: { image: File, url: string }[] = [];

    public exerciseForm: FormGroup;
    public texts: FormArray = new FormArray([]);
    public solutions: FormArray = new FormArray([]);

    public courses: Course[] = [];
    public categories: Category[] = [];

    public pdfUrl = "";

    public isLoaded = false;
    public isPdfLoaded = true;
    private isSubmitted = false;

    public showAlert = false;
    public alertMessage = "";

    constructor(private route: ActivatedRoute,
                private router: Router,
                private location: Location,
                private viewportScroller: ViewportScroller,
                private exerciseApiService: ExerciseApiService,
                private courseApiService: CourseApiService,
                private categoryApiService: CategoryApiService,
                private dataService: DataService,
                private sanitizer: DomSanitizer,) {
    }

    ngOnInit(): void {
        this.resetForm();
        this.dataService.existUnsavedChanges = false;

        this.exerciseForm = new FormGroup({
            title: new FormControl("", [Validators.required, Validators.minLength(1)]),
            courses: new FormControl("", [Validators.required, Validators.minLength(1)]),
            categories: new FormControl("", [Validators.required, Validators.minLength(1)]),
            shortDescription: new FormControl("", [Validators.required, Validators.minLength(1)]),
            note: new FormControl(""),
            texts: this.texts,
            solutions: this.solutions,
            isPublished: new FormControl(false)
        });

        if (this.isAddExercise) {
            this.isLoaded = true;
        } else {
            this.route.params.subscribe(params => {
                this.exerciseId = params["id"];
                this.loadExercise(this.exerciseId);
            });
        }

        this.loadCourses();
        this.loadCategories();
    }

    ngOnDestroy() {
        this.dataService.existUnsavedChanges = false;
    }

    private loadExercise(id: string): void {
        this.exerciseApiService.getExerciseById(id).subscribe({
            next: response => {
                this.exercise = response;
                this.exerciseDto = response;

                this.exerciseForm = new FormGroup({
                    title: new FormControl(this.exercise.title, [Validators.required, Validators.minLength(1)]),
                    courses: new FormControl(this.exercise.courses, [Validators.required, Validators.minLength(1)]),
                    categories: new FormControl(this.exercise.categories, [Validators.required, Validators.minLength(1)]),
                    shortDescription: new FormControl(this.exercise.shortDescription, [Validators.required, Validators.minLength(1)]),
                    note: new FormControl(this.exercise.note),
                    texts: this.texts,
                    solutions: this.solutions,
                    isPublished: new FormControl(this.exercise.isPublished)
                });

                this.exercise.texts.forEach(text => this.texts.push(new FormControl(text, [Validators.required, Validators.minLength(1)])));
                this.exercise.solutions.forEach(solution => this.solutions.push(new FormControl(solution, [Validators.required, Validators.minLength(1)])));

                const images = response.images;
                if (images) {
                    for (let i = 0; i < images.length; i++) {
                        fetch(images[i].content).then(imageUrl =>
                            imageUrl.blob().then(blob => {
                                    const fileType = blob.type;
                                    const fileName = `Image-${i}` + "." + fileType.split("/")[1];

                                    const imageFile = new File([blob], fileName, {type: fileType});
                                    this.images.push({image: imageFile, url: images[i].content})
                                }
                            )
                        );
                    }
                }

                this.isLoaded = true;
            },
            error: err => {
                this.displayAlert("Exercise not found.", err);
                this.isLoaded = true;
                this.texts.push(new FormControl("", [Validators.required, Validators.minLength(1)]));
                this.solutions.push(new FormControl("", [Validators.required, Validators.minLength(1)]));
            }
        });
    }

    private loadCourses(): void {
        this.courseApiService.getAllCourses().subscribe({
            next: response => this.courses = response.sort((a, b) => (a.name < b.name) ? -1 : 1),
            error: err => {
                this.displayAlert("Error while loading courses.", err);
            }
        });
    }

    private loadCategories(): void {
        this.categoryApiService.getAllCategories().subscribe({
            next: response => this.categories = response.sort((a, b) => (a.name < b.name) ? -1 : 1),
            error: err => {
                this.displayAlert("Error while loading categories.", err);
            }
        });
    }


    public toggleCheckbox(): void {
        this.onFormChange();
        this.exerciseDto.isPublished = !this.exerciseDto.isPublished;
    }

    public onFormChange(event?: Event): void {
        if (this.isSubmitted) {
            return;
        }

        let courses: CreateCourseDto[] = [];
        if (this.exerciseForm.controls["courses"].value?.length) {
            courses = this.exerciseForm.controls["courses"].value
                .filter((course: {name: string}) => course.name.trim().length);
        }

        let categories: CreateCategoryDto[] = [];
        if (this.exerciseForm.controls["categories"].value?.length) {
            categories = this.exerciseForm.controls["categories"].value
                .filter((category: {name: string}) => category.name.trim().length);
        }

        this.exerciseDto = {
            isUsed: false,
            title: this.exerciseForm.controls["title"].value,
            courses: courses,
            categories: categories,
            shortDescription: this.exerciseForm.controls["shortDescription"].value,
            note: this.exerciseForm.controls["note"].value,
            texts: this.exerciseForm.controls["texts"].value,
            solutions: this.exerciseForm.controls["solutions"].value,
            isPublished: this.exerciseDto?.isPublished,
            images: this.exerciseDto?.images
        }

        this.checkUnsavedChanges();
    }

    private checkUnsavedChanges(): void {
        this.dataService.existUnsavedChanges = Boolean(this.exerciseForm.controls["title"].value.length ||
            this.exerciseForm.controls["courses"].value &&
            this.exerciseForm.controls["courses"].value.some((course: { name: string }) => course.name.length) ||
            this.exerciseForm.controls["categories"].value &&
            this.exerciseForm.controls["categories"].value.some((category: { name: string }) => category.name.length) ||
            this.exerciseForm.controls["shortDescription"].value.length ||
            this.exerciseForm.controls["note"].value.length ||
            this.exerciseForm.controls["texts"].value.some((text: string) => text.length) ||
            this.exerciseForm.controls["solutions"].value.some((solution: string) => solution.length) ||
            this.images.length);
    }

    public addText(): void {
        this.texts.push(new FormControl("", [Validators.required, Validators.minLength(1)]));
    }

    public deleteText(textIndex: number): void {
        this.texts.removeAt(textIndex);
    }

    public addSolution(): void {
        this.solutions.push(new FormControl("", [Validators.required, Validators.minLength(1)]));
    }

    public deleteSolution(solutionIndex: number): void {
        this.solutions.removeAt(solutionIndex);
    }

    public onImageChange(event: any): void {
        const reader = new FileReader();

        for (let i = 0; i < event.target.files.length; i++) {
            const image = event.target.files[i];

            this.images.push({image: image, url: ""}); // add filenames when a new file is uploaded
            const imageData = this.images[this.images.length - 1];

            reader.readAsDataURL(imageData.image);
            reader.onload = () => {
                if (typeof reader.result === "string") {
                    imageData.url = reader.result;

                    const image: ImageDto = {
                        content: this.images[this.images.length - 1].url,
                        reference: `#-#${this.images.length - 1}`
                    };
                    this.exerciseDto.images?.push(image);

                    this.onFormChange();
                }
            }
        }

        event.target.value = null;
    }

    public deleteImage(imageIndex: number): void {
        this.images.splice(imageIndex, 1);
        this.exerciseDto.images?.splice(imageIndex, 1);
        this.onFormChange();
    }

    private resetForm(): void {
        this.texts.clear();
        this.solutions.clear();
        this.exerciseForm?.reset();
        if (this.isAddExercise) {
            this.texts.push(new FormControl("", [Validators.required, Validators.minLength(1)]));
            this.solutions.push(new FormControl("", [Validators.required, Validators.minLength(1)]));
        }
        this.images = [];
        this.dataService.existUnsavedChanges = false;
    }

    public onSubmit(goBack: boolean): void {
        if (this.isAddExercise || this.isCloneExercise) {
            this.exerciseApiService.createExercise(this.exerciseDto).subscribe({
                next: () => {
                    this.isSubmitted = true;
                    this.resetForm();
                    if (goBack) {
                        this.location.back();
                    }
                },
                error: err => {
                    this.displayAlert("Error while creating exercise.", err);
                }
            });
        } else {
            this.exerciseApiService.updateExercise(this.exerciseId, this.exerciseDto).subscribe({
                next: () => {
                    this.isSubmitted = true;
                    this.resetForm();
                    if (goBack) {
                        this.location.back();
                    }
                },
                error: err => {
                    this.displayAlert("Error while updating exercise.", err);
                }
            });
        }

        if (!goBack) {
            this.viewportScroller.scrollToPosition([0, 0]);
        }
    }

    public viewExercisePdf(): void {
        this.isPdfLoaded = false;

        this.exerciseApiService.previewExerciseDto(this.exerciseDto).subscribe({
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

    public getSanitizedUrl(url: string): SafeResourceUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
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

    public formatBytes(bytes: number, decimals = 2): string {
        if (bytes === 0) {
            return "0 Bytes";
        }
        const k = 1024;
        const dm = decimals <= 0 ? 0 : decimals;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    }
}
