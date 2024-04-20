import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {

  private authenticationSub: Subscription = new Subscription;
  userAuth = false;

  constructor(private authService: AuthService, private router: Router) {}

  onHome() {
    this.router.navigate(['/']);
  }
  onLogin() {
    this.router.navigate(['/login']);
  }
  onRegister() {
    this.router.navigate(['/register']);
  }
  onFav() {
    this.router.navigate(['/favorites']);
  }
  onLogout(){
    this.authService.logout();
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
