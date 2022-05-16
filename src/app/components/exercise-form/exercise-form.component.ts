import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {
    Category,
    CategoryService,
    Exercise,
    ExerciseService,
    TextSolution,
    SubExercise,
    SolutionType
} from "../../../../build/openapi";
import {AddExerciseService} from "../../services/add-exercise.service";

@Component({
    selector: 'app-exercise-form',
    templateUrl: './exercise-form.component.html',
    styleUrls: ['./exercise-form.component.css']
})
export class ExerciseFormComponent implements OnInit {
    @Input()
    public isExercise: boolean = true;  //if false isSubexercise

    @Input()
    public subExerciseIndex: number;

    public exercise: Exercise;

    public subExercise: SubExercise;

    public exerciseImages: { image: File, url: string }[] = [];

    public solutionsImages: { image: File, url: string }[][] = [];

    public exerciseForm: FormGroup;

    public solutions = new FormArray([new FormControl("", [Validators.required, Validators.minLength(1)])]);

    public categories: Category[] = [];


    constructor(private exerciseService: ExerciseService,
                private categoryService: CategoryService,
                private addExerciseService: AddExerciseService) {
    }

    public ngOnInit(): void {
        this.resetForm();

        this.exerciseForm = new FormGroup({
            title: new FormControl("", [Validators.required, Validators.minLength(1)]),
            text: new FormControl("", [Validators.required, Validators.minLength(1)]),
            shortText: new FormControl(""),
            solutions: this.solutions,
        });

        if (this.isExercise) {
            this.getCategories();
            this.exerciseForm.addControl("categories", new FormControl([], [Validators.required, Validators.minLength(1)]));
        }
    }


    private getCategories(): void {
        // this.categoryService.getAllCategories().subscribe({
        //     next: response => this.categories = response,
        //     error: error => console.log(error)
        // });
    }

    public addSolution(): void {
        this.solutions.push(new FormControl("", [Validators.required, Validators.minLength(1)]));
    }

    public deleteSolution(index: number): void {
        this.solutions.removeAt(index);
        this.solutionsImages.splice(index, 1);
    }

    public onFormChange(): void {
        if (this.isExercise) {
            let categories: Category[] = [];
            if (this.exerciseForm.controls["categories"].value!.length !== 0) {
                categories = this.exerciseForm.controls["categories"].value.map((category: string) => {
                    const newCategory: Category = {name: category};
                    return newCategory;
                });
            }

            let solutions: TextSolution[] = [];
            if (this.exerciseForm.controls["solutions"].value!.length !== 0) {
                solutions = this.exerciseForm.controls["solutions"].value.map((solution: string[]) => {
                    return {type: SolutionType.Text, text: solution};
                });
            }

            this.exercise = {
                title: this.exerciseForm.controls["title"].value,
                categories: categories,
                text: this.exerciseForm.controls["text"].value,
                shortText: this.exerciseForm.controls["shortText"].value,
                solutions: solutions
            }
            this.addExerciseService.setExercise(this.exercise);
        }else{
            let solutions: TextSolution[] = [];
            if (this.exerciseForm.controls["solutions"].value!.length !== 0) {
                solutions = this.exerciseForm.controls["solutions"].value.map((solution: string[]) => {
                    return {type: SolutionType.Text, text: solution};
                });
            }

            this.subExercise = {
                title: this.exerciseForm.controls["title"].value,
                text: this.exerciseForm.controls["text"].value,
                shortText: this.exerciseForm.controls["shortText"].value,
                solutions: solutions
            }

            this.addExerciseService.setSubExercise(this.subExercise, this.subExerciseIndex);
        }

        // console.log(this.exercise)
        // console.log(this.subExercise)
        // console.log(this.exerciseImages)
        // console.log(this.solutionImages)
    }

    public onImageChange(event: any): void {
    // public onFileChange(event: any, type: Type, typeIndex: number): void {
        // const reader = new FileReader();
        //
        // for (var i = 0; i < event.target.files.length; i++) {
        //     const image = event.target.files[i];
        //
        //     this.images.push({image: image, url: ""}); // add filenames when a new file is uploaded
        //     const imageData = this.images[this.images.length-1];
        //
        //     reader.readAsDataURL(imageData.image);
        //     reader.onload = () => {
        //         if (typeof reader.result === "string") {
        //             imageData.url = reader.result;
        //         }
        //     }

            // switch (type) {
            //     case Type.EXERCISE:
            //         this.addImageServise.addExerciseImage(image);
            //         break;
            //     case Type.SUB_EXERCISE:
            //         this.addImageServise.addSubExerciseImage(typeIndex, image);
            //         break;
            //     case Type.SOLUTION:
            //         this.addImageServise.addSolutionImage(typeIndex, image);
            //         break;
            // }
        // }
        event.target.value = null;
    }

    public deleteImage(typeIndex: number): void {
    // public deleteImage(typeIndex: number, imageIndex: number): void {
        // this.images.splice(imageIndex, 1);
    }

    private resetForm(): void {
        this.exerciseForm?.reset();

        let solutionsLength = this.solutions.length;
        for (let i = 1; i < solutionsLength; i++) {
            this.solutions.removeAt(1);
        }
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
