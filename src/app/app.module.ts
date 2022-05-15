import {NgModule} from '@angular/core';
import {BrowserModule} from "@angular/platform-browser";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatPaginatorModule } from '@angular/material/paginator';
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
import { HeaderComponent } from './components/header/header.component';

import { MatTableModule } from '@angular/material/table';
import { NgSelectModule } from '@ng-select/ng-select';
import { ExerciseDatabaseComponent } from './components/exercise-database/exercise-database.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatSort} from '@angular/material/sort';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        DashboardComponent,
        AddExerciseComponent,
        ExerciseSheetsComponent,
        HeaderComponent,
        ExerciseDatabaseComponent
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
        MatPaginatorModule,
        MatTableModule,
        BrowserAnimationsModule,
        MatTooltipModule,
        //MatSort
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
