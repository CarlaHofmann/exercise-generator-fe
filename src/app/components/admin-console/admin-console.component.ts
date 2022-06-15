import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {CreateUserDto, User, UserApiService} from "../../../../build/openapi";
import {DataService} from "../../services/data.service";

@Component({
  selector: 'app-admin-console',
  templateUrl: './admin-console.component.html',
  styleUrls: ['./admin-console.component.css']
})
export class AdminConsoleComponent implements OnInit {

    public users: User[] = [];

    public newUserForm: FormGroup;

    public page = 1;
    public pageSize = this.dataService.getPageSize();

    public showAlert = false;
    public alertMessage = "";
    public isLoaded = false;

    constructor(private authService: AuthService,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private userService: UserApiService,
                private dataService: DataService) {
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
            next: response => {
                this.users = response;
                this.isLoaded = true;
            },
            error: err => {
                console.log(err);
                this.isLoaded = true;
                this.displayAlert("Error while loading users.");
            }
        });
    }

    public displayAlert(message: string): void {
        this.alertMessage = message;
        this.showAlert = true;
    }

    public closeAlert(): void {
        this.showAlert = false;
    }

    public addUser(): void{
        const user: CreateUserDto = this.newUserForm.value;
        this.userService.createUser(user).subscribe({
            next: response => this.users.push(response),
            error: err => console.log(err)
        });
    }

    public setPageSize(event: Event): void{
        this.pageSize = Number(event);
        this.dataService.savePageSize(this.pageSize);
    }
}
