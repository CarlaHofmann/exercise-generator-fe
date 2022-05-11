import {Injectable} from '@angular/core';
import {
    Exercise,
    ExerciseService,
    ImageSolution,
    SolutionType,
    SubExercise,
    TextSolution
} from "../../../build/openapi";

@Injectable({
    providedIn: 'root'
})
export class AddExerciseService {
    private exercise: Exercise;
    private _exerciseImages: File[] = [];
    private _exerciseSolutionsImages: File[][] = [];
    private _subExercisesImages: File[][] = [];
    private _subExercisesSolutionsImages: File[][][] = [];


    constructor(private exerciseService: ExerciseService) {
    }


    public setExercise(exercise: Exercise) {
        this.exercise = exercise;
    }

    public setSubExercise(subExercise: SubExercise, subExerciseIndex: number): void {
        if (!this.exercise.subExercises) {
            this.exercise.subExercises = [];
        }

        while (this.exercise.subExercises.length <= subExerciseIndex) {
            this.exercise.subExercises.push({title: "", text: "", solutions: []});
        }

        this.exercise.subExercises.splice(subExerciseIndex, 1, subExercise);
    }

    public createExercise(): void {
        console.log(this.exercise)
        this.exerciseService.createExercise(this.exercise).subscribe({
            next: value => console.log(value),
            error: err => console.log(err)
        });
    }

    public isDataValid(): boolean {
        let isValid = false;

        if (Boolean(this.exercise?.title?.length &&
            this.exercise?.text?.length &&
            this.hasValidCategories() &&
            this.hasValidSolutions() &&
            this.hasValidSubExercises())) {

            isValid = true;
        }

        return isValid;
    }

    public hasValidCategories(): boolean {
        return Boolean(this.exercise?.categories?.every(category =>
                category.name?.length
            )
        );
    }

    public hasValidSolutions(): boolean {
        return Boolean(this.exercise?.solutions?.every(solution => {
                    if (solution.type === SolutionType.Text) {
                        solution = solution as TextSolution;
                        return solution.text.length;
                    }else{
                        solution = solution as ImageSolution;
                        return solution.image;
                    }
                }
            )
        );
    }

    public hasValidSubExercises(): boolean {
        return Boolean((!this.exercise.subExercises ||
                !this.exercise.subExercises.length) ||
            this.exercise?.subExercises?.every(subExercise =>
                subExercise?.title?.length &&
                subExercise?.text?.length
            )
        );
    }


    //TODO:

    public addExerciseImage(image: File): void {
        this._exerciseImages.push(image);
    }

    public addSubExerciseImage(subExerciseIndex: number, image: File): void {
        if (!this._subExercisesImages[subExerciseIndex]) {
            this._subExercisesImages.push([]);
        }
        this._subExercisesImages[subExerciseIndex].push(image);
    }

    public resetSubExercisesImages(): void {
        this._subExercisesImages = [];
    }

    // public addSolutionImage(solutionIndex: number, image: File): void {
    //     if(!this._subExercisesSolutionsImages[solutionIndex]){
    //         this._subExercisesSolutionsImages.push([]);
    //     }
    //     this._subExercisesSolutionsImages[solutionIndex].push(image);
    // }

    public resetSolutionImages(): void {
        this._subExercisesSolutionsImages = [];
    }
}
