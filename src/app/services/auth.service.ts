import {Injectable} from '@angular/core';
import {RoleEnum} from "../enums/RoleEnum";
import {HttpClient} from "@angular/common/http";
import {LoginApiService, User, UserApiService} from "../../../build/openapi";
import {map, Observable, tap} from "rxjs";
import {DataService} from "./data.service";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private user: User | undefined;
    private roles: RoleEnum[] = [];

    private _accessToken = "";
    private _refreshToken = "";


    constructor(private http: HttpClient,
                private loginApiService: LoginApiService,
                private userApiService: UserApiService,
                private dataService: DataService) {
    }

    get username(): String | undefined {
        return this.user?.username;
    }

    get isProfessor(): boolean {
        return this.roles.includes(RoleEnum.PROFESSOR);
    }

    get isAdmin(): boolean {
        return this.roles.includes(RoleEnum.ADMIN);
    }

    set accessToken(accessToken: string) {
        this._accessToken = accessToken;
    }

    get accessToken(): string {
        return this._accessToken;
    }

    set refreshToken(refreshToken: string) {
        this._refreshToken = refreshToken;
        this.dataService.saveRefreshToken(refreshToken);
    }

    get refreshToken(): string {
        return this.dataService.getRefreshToken();
    }

    public logout(): void {
        this.accessToken = "";
        this.refreshToken = "";
        this.clearRoles();
        this.user = undefined;
        this.dataService.clear();
    }

    public clearRoles(): void{
        this.roles = [];
    }

    public authenticate(accessToken: string, refreshToken: string) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;

        const username = JSON.parse(atob(this._accessToken.split('.')[1])).sub;

        this.userApiService.getUserByUsername(username).subscribe({
            next: response => {
                this.user = response;
                this.roles.push(RoleEnum.PROFESSOR);
                if (this.user.admin) {
                    this.roles.push(RoleEnum.ADMIN);
                }
            },
            error: err => {
                console.log(err);
                this.logout();
            }
        });
    }

    public refreshTokens(): Observable<any> {
        const refreshTokenUrl = this.userApiService.configuration.basePath + "/users/refreshtoken";

        return this.http.get(refreshTokenUrl,
            {headers: {"Authorization": `Bearer ${this.refreshToken}`}}
        ).pipe(map(response => response as { accessToken: string, refreshToken: string }),
            tap(response => {
                this.accessToken = response.accessToken;
                this.refreshToken = response.refreshToken;
                this.authenticate(this.accessToken, this.refreshToken);
            })
        );
    }
}
