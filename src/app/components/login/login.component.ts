import {Component, OnInit} from '@angular/core';
import {ViewportScroller} from '@angular/common';
import {FormControl, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {LoginApiService} from "../../../../build/openapi";
import {DataService} from "../../services/data.service";
import {MessageService} from "../../services/message.service";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    public loginForm: FormGroup;
    public isFailedLoginAttempt = false;

    public showAlert = false;
    public alertMessage = "";

    constructor(private router: Router,
                private viewportScroller: ViewportScroller,
                private authService: AuthService,
                private dataService: DataService,
                private messageService: MessageService,
                private loginApiService: LoginApiService) {
    }

    ngOnInit(): void {
        this.loginForm = new FormGroup({
            name: new FormControl(""),
            password: new FormControl("")
        });
    }

    public login(): void {
        const username = this.loginForm.value.name;
        const password = this.loginForm.value.password;

        this.loginApiService.login(username, password).subscribe({
            next: response => {
                this.authService.authenticate(response.accessToken, response.refreshToken);
                this.router.navigate([""]);
                this.messageService.closeAlert();
            },
            error: err => {
                this.displayAlert("Login failed. Username or Password wrong.", err);
            }
        });
    }

    public displayAlert(message: string, error: string): void {
        this.alertMessage = message;
        this.showAlert = true;
        console.log(error);
        this.viewportScroller.scrollToPosition([0, 0]);
    }

    public closeAlert(): void {
        this.showAlert = false;
    }
}
