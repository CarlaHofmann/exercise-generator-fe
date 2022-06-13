import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree} from "@angular/router";
import {Observable} from "rxjs";

export interface CanDeactivateComponent {
    canDeactivate(): Observable<boolean> | boolean;
}

@Injectable({
    providedIn: 'root'
})
export class PendingChangesGuard implements CanDeactivate<CanDeactivateComponent> {

    constructor() {
    }

    public canDeactivate(
        component: CanDeactivateComponent,
        currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot,
        nextState: RouterStateSnapshot
    ): Observable<boolean|UrlTree>|Promise<boolean|UrlTree>|boolean|UrlTree {
        return component.canDeactivate();
    }
}
