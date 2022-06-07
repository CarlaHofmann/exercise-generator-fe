import {NgModule} from '@angular/core';
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import {MatPaginatorModule} from '@angular/material/paginator';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {ApiModule} from "../../build/openapi";
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {LoginComponent} from './components/login/login.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {AddExerciseComponent} from './components/add-exercise/add-exercise.component';
import {ExerciseSheetsComponent} from './components/exercise-sheets/exercise-sheets.component';
import {CreateExerciseSheetComponent} from './components/create-exercise-sheet/create-exercise-sheet.component';
import {HeaderComponent} from './components/header/header.component';

import {MatTableModule} from '@angular/material/table';
import {NgSelectModule} from '@ng-select/ng-select';
import {ExerciseDatabaseComponent} from './components/exercise-database/exercise-database.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSortModule} from '@angular/material/sort';
import {EditExerciseComponent} from './components/edit-exercise/edit-exercise.component';
import {PageNotFoundComponent} from './components/page-not-found/page-not-found.component';
import {ExerciseFormComponent} from './components/exercise-form/exercise-form.component';
import {CodemirrorModule} from "@ctrl/ngx-codemirror";
import {AdminConsoleComponent} from './components/admin-console/admin-console.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        DashboardComponent,
        AddExerciseComponent,
        ExerciseSheetsComponent,
        CreateExerciseSheetComponent,
        HeaderComponent,
        ExerciseDatabaseComponent,
        ExerciseDatabaseComponent,
        EditExerciseComponent,
        PageNotFoundComponent,
        ExerciseFormComponent,
        AdminConsoleComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        ApiModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        CodemirrorModule,
        NgSelectModule,
        MatPaginatorModule,
        MatTableModule,
        BrowserAnimationsModule,
        MatTooltipModule,
        MatSortModule,
        //MatSort
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
