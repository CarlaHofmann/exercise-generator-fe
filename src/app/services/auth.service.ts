import {Injectable} from '@angular/core';
import {RoleEnum} from "../enums/RoleEnum";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private _isStudent = false;
    private _isProfessor = false;

    constructor() {
    }


    get isProfessor(): boolean{
        return true;
        // return this._isProfessor
    }

    public authenticate(role: RoleEnum){
        switch (role) {
            case RoleEnum.STUDENT:
                this._isStudent = true;
                this._isProfessor = false;
                break;
            case RoleEnum.PROFESSOR:
                this._isStudent = false;
                this._isProfessor = true;
                break;
            default:
                this._isStudent = true;
                this._isProfessor = false;
                break;
        }
    }
}
