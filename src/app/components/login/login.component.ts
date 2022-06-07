import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {RoleEnum} from "../../enums/RoleEnum";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    public loginForm: FormGroup;
    public isFailedLoginAttempt = false;

    constructor(private authService: AuthService,
                private router: Router,
                private activatedRoute: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.loginForm = new FormGroup({
            name: new FormControl(""),
            password: new FormControl("")
        });
    }

    public logInAsProfessor(): void {
        // const loginData: LoginData = this.loginForm.value;
        // console.log(loginData)

        this.authService.authenticate(RoleEnum.PROFESSOR);
        this.router.navigate([""], {relativeTo: this.activatedRoute});
        this.isFailedLoginAttempt = false;

        // this.loginApiService.logIn(loginData).subscribe({
        //     next: () => {
        //         this.authService.authenticate(RoleEnum.PROFESSOR);
        //         this.router.navigate([""], {relativeTo: this.activatedRoute});
        //         this.isFailedLoginAttempt = false;
        //     },
        //     error: () => {
        //         this.authService.authenticate(RoleEnum.PROFESSOR);
        //         this.router.navigate([""], {relativeTo: this.activatedRoute});
        //         this.isFailedLoginAttempt = false;
        //         //this.authService.authenticate(RoleEnum.STUDENT);
        //         //this.isFailedLoginAttempt = true;
        //     }
        // });
    }
}
