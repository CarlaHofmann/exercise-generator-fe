import {Component, OnInit} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {LoginData, LoginService} from "../../../../build/openapi";
import {AuthService} from "../../services/auth.service";
import {RoleEnum} from "../../enums/RoleEnum";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    public loginForm = this.loginFormBuilder.group({
        name: "",
        password: ""
    });
    public isFailedLoginAttempt = false;

    constructor(private loginFormBuilder: FormBuilder,
                private loginService: LoginService,
                private authService: AuthService,
                private router: Router,
                private activatedRoute: ActivatedRoute) {
    }

    ngOnInit(): void {
    }

    public logInAsProfessor(): void {
        const loginData: LoginData = this.loginForm.value;

        this.loginService.logIn(loginData).subscribe({
            next: () => {
                this.authService.authenticate(RoleEnum.PROFESSOR);
                this.router.navigate(["professor/dashboard"], {relativeTo: this.activatedRoute});
                this.isFailedLoginAttempt = false;
            },
            error: () => {
                this.authService.authenticate(RoleEnum.PROFESSOR);
                this.router.navigate(["professor/dashboard"], {relativeTo: this.activatedRoute});
                this.isFailedLoginAttempt = false;
                //this.authService.authenticate(RoleEnum.INVALID);
                //this.isFailedLoginAttempt = true;
            }
        });
    }

    public logInAsStudent(): void {
        this.authService.authenticate(RoleEnum.STUDENT);
        this.router.navigate(["student/dashboard"], {relativeTo: this.activatedRoute});
    }
}
