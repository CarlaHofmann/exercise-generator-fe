import {NgModule} from '@angular/core';
import {BrowserModule} from "@angular/platform-browser";

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {ApiModule} from "../../build/openapi";
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './components/login/login.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AddExerciseComponent } from './components/add-exercise/add-exercise.component';
import { ExerciseSheetsComponent } from './components/exercise-sheets/exercise-sheets.component';
import { ExerciseDBComponent } from './components/exercise-db/exercise-db.component';
import { HeaderComponent } from './components/header/header.component';

import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        DashboardComponent,
        AddExerciseComponent,
        ExerciseSheetsComponent,
        ExerciseDBComponent,
        HeaderComponent,

    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        ApiModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
