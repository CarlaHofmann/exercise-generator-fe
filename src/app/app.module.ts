import {AppComponent} from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {ApiModule} from "../../build/openapi";
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {LoginComponent} from './components/login/login.component';
import {HeaderComponent} from './components/header/header.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {SheetDatabaseComponent} from './components/sheet-database/sheet-database.component';
import {CreateSheetComponent} from './components/create-sheet/create-sheet.component';
import {EditSheetComponent} from './components/edit-sheet/edit-sheet.component';
import {CloneSheetComponent} from './components/clone-sheet/clone-sheet.component';
import {SheetFormComponent} from './components/sheet-form/sheet-form.component';
import {ExerciseDatabaseComponent} from './components/exercise-database/exercise-database.component';
import {CreateExerciseComponent} from './components/create-exercise/create-exercise.component';
import {EditExerciseComponent} from './components/edit-exercise/edit-exercise.component';
import {CloneExerciseComponent} from './components/clone-exercise/clone-exercise.component';
import {ExerciseFormComponent} from './components/exercise-form/exercise-form.component';
import {AdminConsoleComponent} from './components/admin-console/admin-console.component';
import {PageNotFoundComponent} from './components/page-not-found/page-not-found.component';
import {PdfViewerComponent} from './components/pdf-viewer/pdf-viewer.component';

import {AppRoutingModule} from './app-routing.module';
import {CodemirrorModule} from "@ctrl/ngx-codemirror";
import {NgSelectModule} from '@ng-select/ng-select';
import {NgModule} from '@angular/core';
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatTooltipModule} from '@angular/material/tooltip';

import {AuthInterceptor} from "./interceptors/auth-interceptor";


@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        HeaderComponent,
        DashboardComponent,
        SheetDatabaseComponent,
        CreateSheetComponent,
        EditSheetComponent,
        CloneSheetComponent,
        SheetFormComponent,
        ExerciseDatabaseComponent,
        CreateExerciseComponent,
        EditExerciseComponent,
        CloneExerciseComponent,
        ExerciseFormComponent,
        AdminConsoleComponent,
        PageNotFoundComponent,
        PdfViewerComponent,
    ],
    imports: [
        AppRoutingModule,
        ApiModule,
        CodemirrorModule,
        NgbModule,
        NgSelectModule,
        NgbModule,
        HttpClientModule,
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
        MatTooltipModule,
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
