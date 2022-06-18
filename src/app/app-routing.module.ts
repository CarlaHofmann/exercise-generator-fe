import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {ProfessorAuthGuard} from "./guards/professor-auth-guard.service";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {ExerciseSheetsComponent} from './components/exercise-sheets/exercise-sheets.component';
import {CreateExerciseSheetComponent} from './components/create-exercise-sheet/create-exercise-sheet.component';
import {ExerciseDatabaseComponent} from './components/exercise-database/exercise-database.component';
import {EditExerciseComponent} from "./components/edit-exercise/edit-exercise.component";
import {PageNotFoundComponent} from "./components/page-not-found/page-not-found.component";
import {AdminConsoleComponent} from "./components/admin-console/admin-console.component";
import {AdminAuthGuard} from "./guards/admin-auth-guard.service";
import {CloneExerciseComponent} from "./components/clone-exercise/clone-exercise.component";
import {CreateExerciseComponent} from "./components/create-exercise/create-exercise.component";
import {PendingChangesGuard} from "./guards/pending-changes-guard.service";
import {PdfViewerComponent} from "./components/pdf-viewer/pdf-viewer.component";


const routes: Routes = [
    {path: "login", component: LoginComponent},
    {path: "sheet", children: [
            {path: "", component: PageNotFoundComponent},
            {path: "db", component: ExerciseSheetsComponent},
            {path: "create", component: CreateExerciseSheetComponent, canActivate: [ProfessorAuthGuard], canDeactivate: [PendingChangesGuard]},
            {path: ":id", children: [
                    {path: "", component: PageNotFoundComponent},
                    // {path: "edit", component: EditExerciseComponent, canActivate: [ProfessorAuthGuard], canDeactivate: [PendingChangesGuard]},
                    // {path: "clone", component: CloneExerciseComponent, canActivate: [ProfessorAuthGuard], canDeactivate: [PendingChangesGuard]},
                    {path: "pdf", component: PdfViewerComponent},
                ]},
        ]},
    {path: "exercise", children: [
            {path: "", component: PageNotFoundComponent},
            {path: "db", component: ExerciseDatabaseComponent},
            {path: "create", component: CreateExerciseComponent, canActivate: [ProfessorAuthGuard], canDeactivate: [PendingChangesGuard]},
            {path: ":id", children: [
                    {path: "", component: PageNotFoundComponent},
                    {path: "edit", component: EditExerciseComponent, canActivate: [ProfessorAuthGuard], canDeactivate: [PendingChangesGuard]},
                    {path: "clone", component: CloneExerciseComponent, canActivate: [ProfessorAuthGuard], canDeactivate: [PendingChangesGuard]},
                    {path: "pdf", component: PdfViewerComponent},
                ]},
        ]},
    {path: "admin", component: AdminConsoleComponent, canActivate: [AdminAuthGuard]},
    {path: "", component: DashboardComponent},
    {path: "**", component: PageNotFoundComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [ProfessorAuthGuard, AdminAuthGuard, PendingChangesGuard]
})
export class AppRoutingModule {
}
