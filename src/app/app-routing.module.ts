import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {AuthGuardProfessorService} from "./services/auth-guard-professor.service";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {AddExerciseComponent} from './components/add-exercise/add-exercise.component';
import {ExerciseSheetsComponent} from './components/exercise-sheets/exercise-sheets.component';
import {CreateExerciseSheetComponent} from './components/create-exercise-sheet/create-exercise-sheet.component';
import {ExerciseDatabaseComponent} from './components/exercise-database/exercise-database.component';
import {EditExerciseComponent} from "./components/edit-exercise/edit-exercise.component";
import {PageNotFoundComponent} from "./components/page-not-found/page-not-found.component";
import {AdminConsoleComponent} from "./components/admin-console/admin-console.component";
import {AuthGuardAdminService} from "./services/auth-guard-admin.service";


const routes: Routes = [
    {path: "login", component: LoginComponent},
    {path: "exercise-sheets", component: ExerciseSheetsComponent, canActivate: []},
    {path: "create-exercise-sheet", component: CreateExerciseSheetComponent, canActivate: []},
    {path: "add-exercise", component: AddExerciseComponent, canActivate: [AuthGuardProfessorService]},
    {path: "exercise-db", component: ExerciseDatabaseComponent, canActivate: []},
    {path: "exercise/:id/edit", component: EditExerciseComponent, canActivate: [AuthGuardProfessorService]},
    {path: "admin", component: AdminConsoleComponent, canActivate: [AuthGuardAdminService]},
    {path: "", component: DashboardComponent},
    {path: "**", component: PageNotFoundComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
