import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import { RoleEnum } from 'src/app/enums/RoleEnum';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private authService: AuthService) { }

  ngOnInit(): void {
  }

  get isProfessor(): boolean {
    return this.authService.isProfessor;
  }

  public logOutAsProfessor(): void {
    this.authService.authenticate(RoleEnum.STUDENT);
    this.router.navigate([""], {relativeTo: this.activatedRoute});
  }
}
