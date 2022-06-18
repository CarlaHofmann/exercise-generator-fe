import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {ProfessorAuthGuard} from "./guards/professor-auth-guard.service";
import {AdminAuthGuard} from "./guards/admin-auth-guard.service";
import {PendingChangesGuard} from "./guards/pending-changes-guard.service";
import {PdfViewerComponent} from "./components/pdf-viewer/pdf-viewer.component";

import {ExerciseDatabaseComponent} from './components/exercise-database/exercise-database.component';
import {CreateExerciseComponent} from "./components/create-exercise/create-exercise.component";
import {EditExerciseComponent} from "./components/edit-exercise/edit-exercise.component";
import {CloneExerciseComponent} from "./components/clone-exercise/clone-exercise.component";

import {SheetDatabaseComponent} from './components/sheet-database/sheet-database.component';
import {CreateSheetComponent} from './components/create-sheet/create-sheet.component';
import {EditSheetComponent} from "./components/edit-sheet/edit-sheet.component";
import {CloneSheetComponent} from "./components/clone-sheet/clone-sheet.component";

import {AdminConsoleComponent} from "./components/admin-console/admin-console.component";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {PageNotFoundComponent} from "./components/page-not-found/page-not-found.component";




const routes: Routes = [
    {path: "login", component: LoginComponent},
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
    {path: "sheet", children: [
            {path: "", component: PageNotFoundComponent},
            {path: "db", component: SheetDatabaseComponent},
            {path: "create", component: CreateSheetComponent, canDeactivate: [PendingChangesGuard]},
            {path: ":id", children: [
                    {path: "", component: PageNotFoundComponent},
                    {path: "edit", component: EditSheetComponent, canActivate: [ProfessorAuthGuard], canDeactivate: [PendingChangesGuard]},
                    {path: "clone", component: CloneSheetComponent, canActivate: [ProfessorAuthGuard], canDeactivate: [PendingChangesGuard]},
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
