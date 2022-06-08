import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DataService {

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
}
