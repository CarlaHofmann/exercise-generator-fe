import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {
    Author,
    Category,
    CategoryApiService,
    Course,
    CourseApiService,
    CreateCategoryDto,
    CreateCourseDto,
    Exercise,
    ExerciseDto,
    ExerciseApiService,
    Sheet,
    SheetApiService,
    SheetDto
} from "../../../../build/openapi";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {Location, ViewportScroller} from "@angular/common";
import {DataService} from "../../services/data.service";
import {AuthService} from "../../services/auth.service";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

@Component({
    selector: 'app-sheet-form',
    templateUrl: './sheet-form.component.html',
    styleUrls: ['./sheet-form.component.css']
})
export class SheetFormComponent implements OnInit, OnDestroy {
    @Input()
    public isCreateSheet: boolean = true;

    @Input()
    public isRandomizedSheet: boolean = true;

    @Input()
    public isCloneSheet: boolean = false;

    private sheetId: string = "";

    private sheet: Sheet;
    private sheetDto: SheetDto;

    public sheetForm: FormGroup;
    public authors: Author[] = [];
    public courses: Course[] = [];
    public categories: Category[] = [];
    public numberExercises: number = 0;
    public exercises: Exercise[] = [];

    public filteredAuthorNames: String[] = [];
    public filteredCourseNames: String[] = [];
    public filteredCategoryNames: String[] = [];

    public pdfUrl = "";

    public isLoaded = false;
    public isPdfLoaded = true;
    private isSubmitted = false;

    public showAlert = false;
    public alertMessages: string[] = [];

    public page: number = 1;
    public pageSize: number = this.dataService.getPageSize();

    constructor(private route: ActivatedRoute,
                private router: Router,
                private location: Location,
                private viewportScroller: ViewportScroller,
                private sheetApiService: SheetApiService,
                private courseApiService: CourseApiService,
                private categoryApiService: CategoryApiService,
                private exerciseApiService: ExerciseApiService,
                private dataService: DataService,
                private authService: AuthService,
                private sanitizer: DomSanitizer) {
    }

    ngOnInit(): void {
        this.resetForm();
        this.dataService.existUnsavedChanges = false;

        this.sheetForm  = new FormGroup({
            title: new FormControl("", [Validators.required, Validators.minLength(1)]),
            courses: new FormControl("", [Validators.required, Validators.minLength(1)]),
            categories: new FormControl("", [Validators.required, Validators.minLength(1)]),
            exercises: new FormControl("", [Validators.required, Validators.minLength(1)]),
            isPublished: new FormControl(false)
        });

        if (this.isCreateSheet) {
            this.isLoaded = true;
        } else {
            this.route.params.subscribe(params => {
                this.sheetId = params["id"];
                this.loadSheet(this.sheetId);
            });
        }

        this.loadCourses();
        this.loadCategories();
        this.loadExercises();
    }

    ngOnDestroy() {
        this.dataService.existUnsavedChanges = false;
    }

    get isProfessor(): boolean {
      return this.authService.isProfessor;
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
                    isPublished: new FormControl(this.sheet.isPublished)
                });

                this.isLoaded = true;
            },
            error: err => {
                console.log(err);
                this.isLoaded = true;
                this.displayAlert("Sheet not found.");
            }
        });
    }

    private loadCourses(): void {
        this.courseApiService.getAllCourses().subscribe({
            next: response => this.courses = response,
            error: error => {
                console.log(error);
                this.displayAlert("Error while loading courses.");
            }
        });
    }

    private loadCategories(): void {
        this.categoryApiService.getAllCategories().subscribe({
            next: response => this.categories = response,
            error: error => {
                console.log(error);
                this.displayAlert("Error while loading categories.");
            }
        });
    }

    private loadExercises(): void {
          this.exerciseApiService.getAllExercises().subscribe({
              next: response => {
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

//     public loadSheetExercises(): Exercise[] {
//             next: response => {
//                     response.map(exercise => sheet.exercise) => {
//                         this.sheetExercises = [];
//                         let i = uniqueAuthors.findIndex(e => e.title === exercise.title);
//                         if (i < 0) {
//                             this.sheetExercises.push(exercise);
//                         }
//                         return null;
//                     })
//                     this.isLoaded = true;
//             },
//             error: err => {
//                 console.log(err);
//                 this.isLoaded = true;
//                 this.displayAlert("Error while loading sheet exercises.");
//             });
//
//     }

    get sheetExercises(): Exercise[]{
        return this.sheet.exercises;
    }


    public getExerciseCourses(courses: Course[]): string {
            return courses.map(course => course.name).join(", ");
    }

    public getExerciseCategories(categories: Category[]): string {
            return categories.map(category => category.name).join(", ");
    }

    public viewSheetPdf(id: string): void {
        window.open("sheet/" + id + "/pdf");
    }

    public viewExercisePdf(id: string): void {
           window.open("exercise/" + id + "/pdf");
//         this.isPdfLoaded = false;
//
//         this.exerciseApiService.previewExerciseDto(this.exerciseDto).subscribe({
//             next: response => {
//                 const pdf = new Blob([response], {type: "application/pdf"});
//                 this.pdfUrl = URL.createObjectURL(pdf);
//
//                 this.isPdfLoaded = true;
//             },
//             error: err => {
//                 console.log(err);
//                 this.displayAlert("Error while trying to get PDF.");
//                 this.isPdfLoaded = true;
//             }
//         });
    }

    public toggleCheckbox(): void {
        this.onFormChange();
        this.sheetDto.isPublished = !this.sheetDto.isPublished;
    }

    public onFormChange(event?: Event): void {
        if (this.isSubmitted) {
            return;
        }

        let courses: CreateCourseDto[] = [];
        if (this.sheetForm.controls["courses"].value?.length) {
            courses = this.sheetForm.controls["courses"].value.map((course: any) => {
                const newCourse: CreateCourseDto = {name: course.name};
                return newCourse;
            });
        }

        let categories: CreateCategoryDto[] = [];
        if (this.sheetForm.controls["categories"].value?.length) {
            categories = this.sheetForm.controls["categories"].value.map((category: any) => {
                const newCategory: CreateCategoryDto = {name: category.name};
                return newCategory;
            });
        }

        this.sheetDto = {
            title: this.sheetForm .controls["title"].value,
            courses: courses,
            categories: categories,
            exercises: this.exercises,
            isPublished: this.sheetDto?.isPublished ? this.sheetDto.isPublished : false
        }

        this.checkUnsavedChanges();
    }

    private checkUnsavedChanges(): void {
        this.dataService.existUnsavedChanges = Boolean(this.sheetForm .controls["title"].value.length ||
            this.sheetForm .controls["courses"].value &&
            this.sheetForm .controls["courses"].value.some((course: { name: string }) => course.name.length) ||
            this.sheetForm .controls["categories"].value &&
            this.sheetForm .controls["categories"].value.some((category: { name: string }) => category.name.length));
    }

    private resetForm(): void {
        this.sheetForm ?.reset();
        this.dataService.existUnsavedChanges = false;
    }

    public onSubmit(goBack: boolean): void {
        if (this.isCreateSheet || this.isCloneSheet) {
            this.sheetApiService.createSheet(this.sheetDto).subscribe({
                next: () => {
                    this.isSubmitted = true;
                    this.resetForm();
                    if (goBack) {
                        this.location.back();
                    }
                },
                error: err => {
                    console.log(err);
                    this.displayAlert("Error while creating sheet.");
                }
            });
        } else {
            this.sheetApiService.updateSheet(this.sheetId, this.sheetDto).subscribe({
                next: () => {
                    this.isSubmitted = true;
                    this.resetForm();
                    if (goBack) {
                        this.location.back();
                    }
                },
                error: err => {
                    console.log(err);
                    this.displayAlert("Error while updating sheet.");
                }
            });
        }

        if (!goBack) {
            this.viewportScroller.scrollToPosition([0, 0]);
        }
    }

    public getSanitizedUrl(url: string): SafeResourceUrl{
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

    public displayAlert(message: string): void {
        this.alertMessages.push(message);
    }

    public closeAlert(message: string): void {
        this.alertMessages = this.alertMessages.filter(m => m !== message);
    }

    public setPageSize(event: Event): void {
        this.pageSize = Number(event);
        this.dataService.savePageSize(this.pageSize);
    }
}
