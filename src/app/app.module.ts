import {NgModule} from '@angular/core';
import {BrowserModule} from "@angular/platform-browser";

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {ApiModule} from "../../build/openapi";
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './components/login/login.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { DashboardProfessorComponent } from './components/dashboard-professor/dashboard-professor.component';
import { DashboardStudentComponent } from './components/dashboard-student/dashboard-student.component';
import { AddExerciseComponent } from './components/add-exercise/add-exercise.component';
import { ExercisesComponent } from './components/exercises/exercises.component';

import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        DashboardProfessorComponent,
        DashboardStudentComponent,
        AddExerciseComponent,
        ExercisesComponent,

    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        ApiModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
