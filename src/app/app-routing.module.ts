import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {DashboardProfessorComponent} from "./components/dashboard-professor/dashboard-professor.component";
import {AuthGuardProfessorService} from "./services/auth-guard-professor.service";
import {DashboardStudentComponent} from "./components/dashboard-student/dashboard-student.component";
import {AuthGuardStudentService} from "./services/auth-guard-student.service";

const routes: Routes = [
    {path: "professor/dashboard", component: DashboardProfessorComponent, canActivate: [AuthGuardProfessorService]},
    {path: "student/dashboard", component: DashboardStudentComponent, canActivate: [AuthGuardStudentService]},
    {path: "", component: LoginComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
