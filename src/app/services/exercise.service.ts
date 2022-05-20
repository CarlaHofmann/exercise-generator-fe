import {Injectable} from '@angular/core';
import {
    CreateExerciseDto,
    ExerciseApiService,
} from "../../../build/openapi";

@Injectable({
    providedIn: 'root'
})
export class ExerciseService {
    private createExerciseDto: CreateExerciseDto;


    constructor(private exerciseApiService: ExerciseApiService) {
    }


    public setCreateExerciseDto(exercise: CreateExerciseDto) {
        this.createExerciseDto = exercise;
    }

    public createExercise(): void {
        console.log(this.createExerciseDto)
        this.exerciseApiService.createExercise(this.createExerciseDto).subscribe({
            next: value => console.log(value),
            error: err => console.log(err)
        });
    }
}
