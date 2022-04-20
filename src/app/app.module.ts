import {NgModule} from '@angular/core';
import {BrowserModule} from "@angular/platform-browser";

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {ApiModule} from "../../build/openapi";
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './components/login/login.component';
import {ReactiveFormsModule} from "@angular/forms";
import { DashboardProfessorComponent } from './components/dashboard-professor/dashboard-professor.component';
import { DashboardStudentComponent } from './components/dashboard-student/dashboard-student.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        DashboardProfessorComponent,
        DashboardStudentComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        ApiModule,
        NgbModule,
        ReactiveFormsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
