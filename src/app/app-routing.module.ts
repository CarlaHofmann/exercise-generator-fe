import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {AuthGuardProfessorService} from "./services/auth-guard-professor.service";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {AuthGuardStudentService} from "./services/auth-guard-student.service";
import { AddExerciseComponent } from './components/add-exercise/add-exercise.component';
import { HeaderComponent } from './components/header/header.component';
import { ExerciseSheetsComponent } from './components/exercise-sheets/exercise-sheets.component';
import { ExerciseDBComponent } from './components/exercise-db/exercise-db.component';

const routes: Routes = [
    {path: "header", component: HeaderComponent, canActivate: []},
    {path: "", component: DashboardComponent},
    {path: "login", component: LoginComponent},
    {path: "exercise-sheets", component: ExerciseSheetsComponent, canActivate: []},
    {path: "add-exercise", component: AddExerciseComponent, canActivate: []},
    {path: "exercise-db", component: ExerciseDBComponent, canActivate: []},
    
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
