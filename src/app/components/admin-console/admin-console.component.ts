import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
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
    public userSearchForm: FormGroup;

    public page = 1;
    public pageSize = this.dataService.getPageSize();

    public showAlert = false;
    public alertMessage = "";
    public isLoaded = false;

    constructor(private userApiService: UserApiService,
                private dataService: DataService) {
    }

    ngOnInit(): void {
        this.newUserForm = new FormGroup({
            username: new FormControl(""),
            password: new FormControl(""),
            admin: new FormControl(false)
        });

        this.userSearchForm = new FormGroup({
            searchString: new FormControl("")
        });

        this.loadUsers()
    }

    private loadUsers(): void{
        this.userApiService.getAllUsers().subscribe({
            next: response => {
                this.users = response;
                this.isLoaded = true;
            },
            error: err => {
                this.isLoaded = true;
                this.displayAlert("Error while loading users.", err);
            }
        });
    }

    get filteredUsers(): User[]{
        const searchString = this.userSearchForm.value.searchString;
        return this.users.filter(user => user.username.toLowerCase().includes(searchString.toLowerCase()));
    }

    public displayAlert(message: string, error: string): void {
        this.alertMessage = message;
        this.showAlert = true;
        console.log(error);
    }

    public closeAlert(): void {
        this.showAlert = false;
    }

    public addUser(): void{
        const user: CreateUserDto = this.newUserForm.value;
        this.userApiService.createUser(user).subscribe({
            next: response => {
                this.users.push(response);
                this.newUserForm.reset();
            },
            error: err => this.displayAlert("Error while creating user.", err)
        });
    }

    public deleteUser(username: string): void{
        this.userApiService.deleteUserByUsername(username).subscribe({
            next: () => this.users = this.users.filter(user => user.username !== username),
            error: err => this.displayAlert("Error while deleting user.", err)
        });
    }

    public setPageSize(event: Event): void{
        this.pageSize = Number(event);
        this.dataService.savePageSize(this.pageSize);
    }
}
