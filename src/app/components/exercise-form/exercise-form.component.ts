import {Component, Input, OnInit} from '@angular/core';
import {
    Category,
    CategoryApiService,
    Course,
    CourseApiService,
    CreateCategoryDto,
    CreateCourseDto,
    CreateExerciseDto,
    Exercise,
    ExerciseApiService
} from "../../../../build/openapi";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ViewportScroller} from "@angular/common";

@Component({
    selector: 'app-exercise-form',
    templateUrl: './exercise-form.component.html',
    styleUrls: ['./exercise-form.component.css']
})
export class ExerciseFormComponent implements OnInit {
    @Input()
    public isAddExercise: boolean = true;

    private exerciseId: string = "";

    private exercise: Exercise;
    private createExerciseDto: CreateExerciseDto;

    public images: { image: File, url: string }[] = [];

    public exerciseForm: FormGroup;
    public texts: FormArray = new FormArray([]);
    public solutions: FormArray = new FormArray([]);

    public courses: Course[] = [];
    public categories: Category[] = [];

    constructor(private route: ActivatedRoute,
                private router: Router,
                private viewportScroller: ViewportScroller,
                private exerciseApiService: ExerciseApiService,
                private courseApiService: CourseApiService,
                private categoryApiService: CategoryApiService) {
    }

    ngOnInit(): void {
        this.resetForm();

        this.exerciseForm = new FormGroup({
            title: new FormControl("", [Validators.required, Validators.minLength(1)]),
            courses: new FormControl("", [Validators.required, Validators.minLength(1)]),
            categories: new FormControl("", [Validators.required, Validators.minLength(1)]),
            note: new FormControl(""),
            shortDescription: new FormControl("", [Validators.required, Validators.minLength(1)]),
            texts: this.texts,
            solutions: this.solutions
        });

        if (this.isAddExercise) {
            this.texts.push(new FormControl("", [Validators.required, Validators.minLength(1)]));
            this.solutions.push(new FormControl("", [Validators.required, Validators.minLength(1)]));
        } else {
            this.route.params.subscribe(params => {
                this.exerciseId = params["id"];
                this.loadExercise(this.exerciseId);
            });
        }

        this.loadCourses();
        this.loadCategories();
    }

    private loadExercise(id: string): void {
        this.exerciseApiService.getExerciseById(id).subscribe({
            next: response => {
                this.exercise = response;

                this.exerciseForm = new FormGroup({
                    title: new FormControl(this.exercise.title, [Validators.required, Validators.minLength(1)]),
                    courses: new FormControl(this.exercise.courses, [Validators.required, Validators.minLength(1)]),
                    categories: new FormControl(this.exercise.categories, [Validators.required, Validators.minLength(1)]),
                    note: new FormControl(this.exercise.note),
                    shortDescription: new FormControl(this.exercise.shortDescription, [Validators.required, Validators.minLength(1)]),
                    texts: this.texts,
                    solutions: this.solutions
                });

                this.exercise.texts.forEach(text => this.texts.push(new FormControl(text, [Validators.required, Validators.minLength(1)])));
                this.exercise.solutions.forEach(solution => this.solutions.push(new FormControl(solution, [Validators.required, Validators.minLength(1)])));
            },
            error: err => {
                console.log(err);
                this.router.navigate(["**"]);
            }
        });
    }

    private loadCourses(): void {
        this.courseApiService.getAllCourses().subscribe({
            next: response => this.courses = response,
            error: error => console.log(error)
        });
    }

    private loadCategories(): void {
        this.categoryApiService.getAllCategories().subscribe({
            next: response => this.categories = response,
            error: error => console.log(error)
        });
    }

    public onFormChange(event?: Event): void {
        let courses: CreateCourseDto[] = [];
        if (this.exerciseForm.controls["courses"].value?.length) {
            courses = this.exerciseForm.controls["courses"].value.map((course: any) => {
                const newCourse: CreateCourseDto = {name: course.name};
                return newCourse;
            });
        }

        let categories: CreateCategoryDto[] = [];
        if (this.exerciseForm.controls["categories"].value?.length) {
            categories = this.exerciseForm.controls["categories"].value.map((category: any) => {
                const newCategory: CreateCategoryDto = {name: category.name};
                return newCategory;
            });
        }

        this.createExerciseDto = {
            title: this.exerciseForm.controls["title"].value,
            categories: categories,
            courses: courses,
            note: this.exerciseForm.controls["note"].value,
            shortDescription: this.exerciseForm.controls["shortDescription"].value,
            texts: this.exerciseForm.controls["texts"].value,
            solutions: this.exerciseForm.controls["solutions"].value
        }
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
                }
            }
        }

        event.target.value = null;
    }

    public deleteImage(imageIndex: number): void {
        this.images.splice(imageIndex, 1);
    }

    private resetForm(): void {
        this.texts.clear();
        this.solutions.clear();
        this.exerciseForm?.reset();
    }

    onSubmit() {
        if (this.isAddExercise) {
            this.exerciseApiService.createExercise(this.createExerciseDto).subscribe({
                error: err => console.log(err)
            });
        } else {
            this.exerciseApiService.updateExercise(this.exerciseId, this.createExerciseDto).subscribe({
                error: err => console.log(err)
            });
        }

        this.resetForm();
        this.texts.push(new FormControl("", [Validators.required, Validators.minLength(1)]));
        this.solutions.push(new FormControl("", [Validators.required, Validators.minLength(1)]));
        this.images = [];

        this.viewportScroller.scrollToPosition([0, 0]);
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
