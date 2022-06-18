import {Injectable} from '@angular/core';
import {RoleEnum} from "../enums/RoleEnum";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private _isStudent = false;
    private _isProfessor = false;
    private _isAdmin = false;

    constructor() {
    }


    get isProfessor(): boolean{
        return true;
        // return this._isProfessor;
    }

    get isAdmin(): boolean{
        return true;
        // return this._isAdmin;
    }

    public authenticate(role: RoleEnum){
        switch (role) {
            case RoleEnum.STUDENT:
                this._isStudent = true;
                this._isProfessor = false;
                this._isAdmin = false;
                localStorage.removeItem("pageSize");
                break;
            case RoleEnum.PROFESSOR:
                this._isStudent = false;
                this._isProfessor = true;
                this._isAdmin = false;
                break;
            case RoleEnum.ADMIN:
                this._isStudent = false;
                this._isProfessor = true;
                this._isAdmin = true;
                break;
            default:
                this._isStudent = true;
                this._isProfessor = false;
                this._isAdmin = false;
                break;
        }
    }
}
