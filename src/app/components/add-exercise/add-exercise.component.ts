import {Component, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {Category, CategoryService, Exercise, ExerciseService, SolutionType} from "../../../../build/openapi";
import {Type} from "../../enums/Type";
import {AddExerciseService} from "../../services/add-exercise.service";

@Component({
    selector: 'app-add-exercise',
    templateUrl: './add-exercise.component.html',
    styleUrls: ['./add-exercise.component.css']
})


export class AddExerciseComponent implements OnInit {
    public subExercises: any[] = [];

    public constructor(private addExerciseService: AddExerciseService) {
    }

    ngOnInit(): void {
    }

    public addSubExercise(): void{
        this.subExercises.push([]);
    }

    public deleteSubExercise(index: number): void{
        this.subExercises.splice(index, 1);
    }

    onSubmit() {
        this.addExerciseService.createExercise();
    }

    public isDataValid(): boolean{
        return this.addExerciseService.isDataValid();
    }
}
