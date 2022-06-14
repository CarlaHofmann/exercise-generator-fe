import {Injectable} from '@angular/core';
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DataService {
    private _existUnsavedChanges: Observable<boolean> | boolean = false;

    constructor() {
    }

    public savePageSize(pageSize: number): void{
        localStorage.setItem("pageSize", pageSize.toString(10));
    }

    public getPageSize(): number{
        if(localStorage.getItem("pageSize")){
            return Number(localStorage.getItem("pageSize"));
        }
        return 10;
    }

    set existUnsavedChanges(existUnsavedChange: Observable<boolean> | boolean){
        this._existUnsavedChanges = existUnsavedChange;
    }

    get existUnsavedChanges(): Observable<boolean> | boolean{
        return this._existUnsavedChanges;
    }
}
