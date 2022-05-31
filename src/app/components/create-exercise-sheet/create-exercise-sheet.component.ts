import {Component, OnInit} from '@angular/core';
import {ExerciseService} from "../../services/exercise.service";
import {Category, Course, CategoryApiService, CreateCategoryDto, CreateExerciseDto} from "../../../../build/openapi";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-create-exercise-sheet',
  templateUrl: './create-exercise-sheet.component.html',
  styleUrls: ['./create-exercise-sheet.component.css']
})
export class CreateExerciseSheetComponent implements OnInit {
  public exercise: CreateExerciseDto;
  public exerciseSheetForm: FormGroup;

  public courses: Course[] = [];
  public categories: Category[] = [];

  constructor(private categoryApiService: CategoryApiService,
              private exerciseService: ExerciseService) { }

  ngOnInit(): void {
  }

  get randomizedSheet(): boolean {
      return true;
  }

  get customizedSheet(): boolean {
     return false;
  }

  public onFormChange(): void {
          let categories: CreateCategoryDto[] = [];
          if (this.exerciseForm.controls["categories"].value!.length !== 0) {
              categories = this.exerciseForm.controls["categories"].value.map((category: any) => {
                  const newCategory: CreateCategoryDto = {name: category.name, isHidden: false};
                  return newCategory;
              });
          }

          this.exercise = {
              title: this.exerciseForm.controls["title"].value,
              courses: courses,
              categories: categories,
              hiddenCategories: hiddenCategories,
              note: this.exerciseForm.controls["note"].value,
              shortDescription: this.exerciseForm.controls["shortDescription"].value,
              texts: this.exerciseForm.controls["texts"].value,
              solutions: this.exerciseForm.controls["solutions"].value
          }

          this.exerciseService.setCreateExerciseDto(this.exercise);
      }

      private loadCourses(): void {
          this.courseApiService.getAllCourses().subscribe({
              next: response => this.courses = response,
              error: error => console.log(error)
          });
      }

}
