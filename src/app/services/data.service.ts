import {Injectable} from '@angular/core';
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DataService {
    private _existUnsavedChanges: Observable<boolean> | boolean = false;

    constructor() {
    }

    public clear(): void {
        localStorage.clear();
        this.existUnsavedChanges = false;
    }

    public saveRefreshToken(refreshToken: string): void {
        localStorage.setItem("refreshToken", refreshToken);
    }

    public getRefreshToken(): string {
        const refreshToken = localStorage.getItem("refreshToken");
        return refreshToken ? refreshToken : "";
    }

    public savePageSize(pageSize: number): void {
        localStorage.setItem("pageSize", pageSize.toString(10));
    }

    public getPageSize(): number {
        const pageSize = localStorage.getItem("pageSize");
        return pageSize ? Number(pageSize) : 10;
    }

    set existUnsavedChanges(existUnsavedChange: Observable<boolean> | boolean) {
        this._existUnsavedChanges = existUnsavedChange;
    }

    get existUnsavedChanges(): Observable<boolean> | boolean {
        return this._existUnsavedChanges;
    }
}
