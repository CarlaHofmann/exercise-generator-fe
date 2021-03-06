import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from 'src/app/services/auth.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

    constructor(private router: Router,
                private activatedRoute: ActivatedRoute,
                private authService: AuthService) {
    }

    ngOnInit(): void {
    }

    get isProfessor(): boolean {
        return this.authService.isProfessor;
    }

    get isAdmin(): boolean {
        return this.authService.isAdmin;
    }

    public logout(): void {
        this.authService.logout();
        this.router.navigate([""], {relativeTo: this.activatedRoute});
    }
}
