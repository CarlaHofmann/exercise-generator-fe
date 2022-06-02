import {Component, OnInit} from '@angular/core';
import {AuthService} from "./services/auth.service";
import {Router} from "@angular/router";
import {MessageService} from "./services/message.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = "exercise-generator";

    constructor(private router: Router,
                private authService: AuthService,
                private messageService: MessageService) {
    }

    ngOnInit(): void {
        if (this.authService.refreshToken.length) {
            this.authService.refreshTokens().subscribe({
                error: () => {
                    this.authService.logout();
                    this.router.navigate([""]);
                }
            });
        }

        window.addEventListener("storage", (event) => {
            if (event.storageArea == localStorage && !document.hasFocus()) {
                let refreshToken = this.authService.refreshToken;

                if (!refreshToken.length) {
                    this.authService.logout();
                    this.router.navigate([""]);
                }else{
                    this.authService.refreshTokens().subscribe({
                        error: () => {
                            this.authService.logout();
                            this.router.navigate([""]);
                        }
                    });
                }
            }
        });
    }

    get showAlert(): boolean{
        return this.messageService.showAlert;
    }

    get alertMessage(): string{
        return this.messageService.alertMessage;
    }

    public closeAlert(): void{
        this.messageService.closeAlert();
    }
}
