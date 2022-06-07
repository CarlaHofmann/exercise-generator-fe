import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {CreateUserDto, User, UserApiService} from "../../../../build/openapi";

@Component({
  selector: 'app-admin-console',
  templateUrl: './admin-console.component.html',
  styleUrls: ['./admin-console.component.css']
})
export class AdminConsoleComponent implements OnInit {

    public users: User[] = [];

    public newUserForm: FormGroup;

    public page: number = 1;
    public pageSize: number = 10;

    constructor(private authService: AuthService,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private userService: UserApiService) {
    }

    ngOnInit(): void {
        this.newUserForm = new FormGroup({
            username: new FormControl(""),
            password: new FormControl("")
        });

        this.loadUsers()
    }

    private loadUsers(): void{
        this.userService.getAllUsers().subscribe({
            next: response => this.users = response,
            error: err => console.log(err)
        });
    }

    public addUser(): void{
        const user: CreateUserDto = this.newUserForm.value;
        this.userService.createUser(user).subscribe({
            next: response => this.users.push(response),
            error: err => console.log(err)
        });
    }
}
