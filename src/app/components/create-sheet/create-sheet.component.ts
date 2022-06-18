import {Component, Input, OnInit} from '@angular/core';
import {
    Author,
    Category,
    CategoryApiService,
    Course,
    CourseApiService,
    Exercise,
    Sheet,
    ExerciseApiService,
    UserApiService
} from "../../../../build/openapi";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-create-exercise-sheet',
  templateUrl: './create-exercise-sheet.component.html',
  styleUrls: ['./create-exercise-sheet.component.css']
})

export class CreateExerciseSheetComponent implements OnInit {
  public exerciseSheet: Sheet[];
  public exerciseSheetForm: FormGroup;
  public texts: FormArray = new FormArray([]);
  public solutions: FormArray = new FormArray([]);

  public exercises: Exercise[] = [];
  public authors: Author[] = [];
  public courses: Course[] = [];
  public categories: Category[] = [];

  public filteredAuthorNames: String[] = [];
  public filteredCourseNames: String[] = [];
  public filteredCategoryNames: String[] = [];

  public randomizedSheet: Boolean = true;

  public page: number = 1;
  public pageSize: number = 10;

  constructor(private categoryApiService: CategoryApiService,
              private courseApiService: CourseApiService,
              private exerciseApiService: ExerciseApiService,
              private userApiService: UserApiService,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.loadExercises();
  }

  public onFormChange(): void {
          this.resetForm();

          this.exerciseSheetForm = new FormGroup({
              title: new FormControl("", [Validators.required, Validators.minLength(1)]),
              courses: new FormControl("", [Validators.required, Validators.minLength(1)]),
              categories: new FormControl("", [Validators.required, Validators.minLength(1)])
          });

          this.loadCourses();
          this.loadCategories();
      }

  private loadExercises(): void {
          this.exerciseApiService.getAllExercises().subscribe({
              next: response => {
                  if (this.isProfessor){
                      this.userApiService.getCurrentUser().subscribe({
                          next: response => {
                             this.filteredAuthorNames = [response.username];
                          },
                          error: error => console.log(error)
                      })
                  }else{
                      const uniqueAuthors: Author[] = [];
                      response.map(exercise => exercise.author).filter((author: Author) => {
                          let i = uniqueAuthors.findIndex(a => a.name === author.name);
                          if (i < 0) {
                              uniqueAuthors.push(author);
                          }
                          return null;
                      })
                      this.authors = uniqueAuthors.sort((a, b) => (a.name < b.name) ? -1 : 1);
                      this.filteredAuthorNames = this.authors.map((author: Author) => author.name);
                  }

                  const uniqueCourses: Course[] = [];
                  response.flatMap(exercise => exercise.courses).filter((course: Course) => {
                      let i = uniqueCourses.findIndex(c => c.name === course.name);
                      if(i < 0){
                          uniqueCourses.push(course);
                      }
                      return null;
                  })
                  this.courses = uniqueCourses.sort((a,b) => (a.name < b.name) ? -1 : 1);

                  const uniqueCategories: Category[] = [];
                  response.flatMap(exercise => exercise.categories).filter((category: Category) => {
                      let i = uniqueCategories.findIndex(c => c.name === category.name);
                      if(i < 0){
                          uniqueCategories.push(category);
                      }
                      return null;
                  })
                  this.categories = uniqueCategories.sort((a,b) => (a.name < b.name) ? -1 : 1);

                  this.exercises = response;
              },
              error: error => console.log(error)
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

  public selectSheet(): void {
      this.randomizedSheet = !this.randomizedSheet;
  }

  get filteredExercises(): Exercise[] {
          return this.exercises.filter((exercise: Exercise) => {
               if (this.filteredAuthorNames.length) {
                   return this.filteredAuthorNames.includes(exercise.author.name)
               }
               return true;
          }).filter((exercise: Exercise) => {
              if (this.filteredCategoryNames.length){
                  return exercise.categories.map((category: Category) => category.name)
                                         .some((categoryName: String) => this.filteredCategoryNames
                                              .includes(categoryName));
              }
              return true;
          }).filter((exercise: Exercise) => {
              if (this.filteredCourseNames.length){
                  return exercise.courses.map((course: Course) => course.name)
                                      .some((courseName: String) => this.filteredCourseNames
                                      .includes(courseName));
              }
              return true;
          });
      }

  get isProfessor(): boolean {
    return this.authService.isProfessor;
  }

  public getExerciseCourses(courses: Course[]): string {
          return courses.map(course => course.name).join(", ");
  }

  public getExerciseCategories(categories: Category[]): string {
          return categories.map(category => category.name).join(", ");
  }

  private resetForm(): void {
      this.texts.clear();
      this.solutions.clear();
      this.exerciseSheetForm?.reset();
  }

  public filterCoursesChange(courses: any): void {
      this.filteredCourseNames = courses.map((course: Course) => course.name);
  }

  public filterCategoriesChange(categories: any): void {
      this.filteredCategoryNames = categories.map((category: Category) => category.name);
  }

}
