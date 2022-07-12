import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {AuthService} from "../services/auth.service";
import {BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError} from "rxjs";
import {Router} from "@angular/router";
import {MessageService} from "../services/message.service";

@Injectable({
    providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {
    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor(private router: Router,
                private authService: AuthService,
                private messageService: MessageService) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const accessToken = this.authService.accessToken;
        const refreshToken = this.authService.refreshToken;

        if (accessToken.length && !this.isRefreshing) {
            request = this.addTokenHeader(request, accessToken);
        }

        return next.handle(request).pipe(
            catchError(err => {
                if (err.status === 401) {
                    if(request.url.includes("login")){
                        const error = err.error.message || err.statusText;
                        return throwError(error)
                    }
                    return this.handle401Error(request, next, refreshToken);

                }else if (err.status === 403) {
                    this.messageService.displayAlert("Session has expired. You have been logged out.", "Session has expired.");
                    this.authService.logout();
                    this.router.navigate([""]);
                }

                const error = err.error.message || err.statusText;
                return throwError(error);
            })
        );
    }

    private handle401Error(request: HttpRequest<any>, next: HttpHandler, refreshToken: string) {
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);

            if (refreshToken.length) {
                return this.authService.refreshTokens().pipe(
                    switchMap((response: { accessToken: string, refreshToken: string }) => {
                        this.isRefreshing = false;
                        this.refreshTokenSubject.next(response.refreshToken);

                        return next.handle(this.addTokenHeader(request, response.accessToken));
                    }),
                    catchError((err) => {
                        this.isRefreshing = false;

                        this.authService.logout();
                        return throwError(err);
                    })
                );
            }
        }
        return this.refreshTokenSubject.pipe(
            filter(token => token !== null),
            take(1),
            switchMap((token) => next.handle(this.addTokenHeader(request, token)))
        );
    }

    private addTokenHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {
        return request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }
}
