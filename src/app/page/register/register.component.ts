import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit, OnDestroy {
  email: string = '';
  password: string = '';

  private authenticationSub!: Subscription;
  userAuth = false;
  
  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

  ngOnDestroy(): void {
    this.authenticationSub.unsubscribe();
  }

  ngOnInit(): void {
    this.authenticationSub = this.authService.getAuthSub().subscribe(status => {
      this.userAuth = status;
    })
    this.userAuth = this.authService.getIsAuth();
  }

  onRegisterSubmit() {
    const registerData = { email: this.email, password: this.password };
    this.http.post<any>('http://localhost:3000/api/register', registerData)
      .subscribe(
        response => {
          console.log(response);
          this.authService.login(this.email, this.password);
        },
        error => {
          console.error(error); 
        }
      );
  }
}