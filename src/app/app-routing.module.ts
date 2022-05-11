import { ExerciseDatabaseComponent } from './components/exercise-database/exercise-database.component';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {AuthGuardProfessorService} from "./services/auth-guard-professor.service";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import { AddExerciseComponent } from './components/add-exercise/add-exercise.component';
import { ExerciseSheetsComponent } from './components/exercise-sheets/exercise-sheets.component';
import { ExerciseDBComponent } from './components/exercise-db/exercise-db.component';


const routes: Routes = [
    {path: "login", component: LoginComponent},
    {path: "exercise-sheets", component: ExerciseSheetsComponent, canActivate: []},
    {path: "add-exercise", component: AddExerciseComponent, canActivate: [AuthGuardProfessorService]},
    {path: "exercise-db", component: ExerciseDBComponent, canActivate: []},
    {path: "**", component: DashboardComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
