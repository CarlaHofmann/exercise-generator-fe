import {Component, OnInit} from '@angular/core';
import {ExerciseService} from "../../services/exercise.service";
import {Category, CategoryApiService, CreateCategoryDto, CreateExerciseDto} from "../../../../build/openapi";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: 'app-add-exercise',
    templateUrl: './add-exercise.component.html',
    styleUrls: ['./add-exercise.component.css']
})


export class AddExerciseComponent implements OnInit {
    public exercise: CreateExerciseDto;

    public images: { image: File, url: string }[] = [];

    public exerciseForm: FormGroup;
    public texts: FormArray = new FormArray([new FormControl("", [Validators.required, Validators.minLength(1)])]);
    public solutions: FormArray = new FormArray([new FormControl("", [Validators.required, Validators.minLength(1)])]);

    public categories: Category[] = [];
    public hiddenCategories: Category[] = [];


    constructor(private categoryApiService: CategoryApiService,
                private exerciseService: ExerciseService) {
    }

    public ngOnInit(): void {
        this.resetForm();

        this.exerciseForm = new FormGroup({
            title: new FormControl("", [Validators.required, Validators.minLength(1)]),
            categories: new FormControl("", [Validators.required, Validators.minLength(1)]),
            hiddenCategories: new FormControl(""),
            note: new FormControl(""),
            shortDescription: new FormControl("", [Validators.required, Validators.minLength(1)]),
            texts: this.texts,
            solutions: this.solutions
        });

        this.getCategories();
    }


    private getCategories(): void {
        this.categoryApiService.getAllCategories().subscribe({
            next: response => {
                this.categories = response.filter(category => !category.isHidden);
                this.hiddenCategories = response.filter(category => category.isHidden);
            },
            error: error => console.log(error)
        });
    }

    public onFormChange(): void {
        let categories: CreateCategoryDto[] = [];
        if (this.exerciseForm.controls["categories"].value!.length !== 0) {
            categories = this.exerciseForm.controls["categories"].value.map((category: any) => {
                const newCategory: CreateCategoryDto = {name: category.name, isHidden: false};
                return newCategory;
            });
        }

        let hiddenCategories: CreateCategoryDto[] = [];
        if (this.exerciseForm.controls["hiddenCategories"].value!.length !== 0) {
            hiddenCategories = this.exerciseForm.controls["hiddenCategories"].value.map((category: any) => {
                const newCategory: CreateCategoryDto = {name: category.name, isHidden: true};
                return newCategory;
            });
        }

        this.exercise = {
            title: this.exerciseForm.controls["title"].value,
            categories: categories,
            hiddenCategories: hiddenCategories,
            note: this.exerciseForm.controls["note"].value,
            shortDescription: this.exerciseForm.controls["shortDescription"].value,
            texts: this.exerciseForm.controls["texts"].value,
            solutions: this.exerciseForm.controls["solutions"].value
        }

        this.exerciseService.setCreateExerciseDto(this.exercise);
    }

    public addText(): void{
        this.texts.push(new FormControl("", [Validators.required, Validators.minLength(1)]));
    }

    public deleteText(textIndex: number): void {
        this.texts.removeAt(textIndex);
    }

    public addSolution(): void{
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
        this.exerciseForm?.reset();
    }

    onSubmit() {
        this.exerciseService.createExercise();
        this.resetForm();
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
