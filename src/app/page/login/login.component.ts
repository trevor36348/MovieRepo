import { Component, NgModule, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs/internal/Subscription';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit, OnDestroy {
  email: string = '';
  password: string = '';

  private authenticationSub!: Subscription;
  userAuth = false;

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

  onLoginSubmit() {
    try {
      this.authService.login(this.email, this.password)
    } catch (error) {
      //code to display error on page
      console.log("Incorrect Username or Password!")
    }
  }

  ngOnDestroy(): void {
    this.authenticationSub.unsubscribe();
  }

  ngOnInit(): void {
    this.authenticationSub = this.authService.getAuthSub().subscribe(status => {
      this.userAuth = status;
    })
    this.userAuth = this.authService.getIsAuth();
  }
}
