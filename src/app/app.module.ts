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
import {SheetDatabaseComponent} from './components/sheet-database/sheet-database.component';
import {CreateSheetComponent} from './components/create-sheet/create-sheet.component';
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
import {CloneExerciseComponent} from './components/clone-exercise/clone-exercise.component';
import {CreateExerciseComponent} from './components/create-exercise/create-exercise.component';
import {PdfViewerComponent} from './components/pdf-viewer/pdf-viewer.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        DashboardComponent,
        SheetDatabaseComponent,
        CreateSheetComponent,
        HeaderComponent,
        ExerciseDatabaseComponent,
        ExerciseDatabaseComponent,
        EditExerciseComponent,
        PageNotFoundComponent,
        ExerciseFormComponent,
        AdminConsoleComponent,
        CloneExerciseComponent,
        CreateExerciseComponent,
        PdfViewerComponent,
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
        BrowserAnimationsModule,
        MatPaginatorModule,
        MatTableModule,
        MatTooltipModule,
        MatSortModule,
        //MatSort
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
