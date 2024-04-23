import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, map } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token: string | null = null;
  private authenticatedSub = new Subject<boolean>();
  private isAuth = false;
  private userkey: string | null = null;
  private favorites: string[] = [];

  getIsAuth() {
    return this.isAuth;
  }
  
  constructor(private http: HttpClient, private router: Router) { }

  login(email: string, password: string) {
    const loginData = { email, password };
    this.http.post<{token: string}>('http://localhost:3000/api/login', loginData)
      .subscribe(res => {
        this.token = res.token;
        if(this.token){
          this.authenticatedSub.next(true);
          this.isAuth = true;
          this.router.navigate(['/']);
          this.userkey = email;
        } else {
          throw new Error('No token found.');
        }
    })
  }

  logout() {
    this.token = "";
    this.isAuth = false;
    this.authenticatedSub.next(false);
    this.router.navigate(['/']);
    this.userkey = '';
  }

  setFavorite(email: String, id: number) {
    var movieId = id.toString();
    const favoritedata = { email, movieId };

    this.http.post('http://localhost:3000/api/add-favorite', favoritedata)
      .subscribe(res => {});
  }

  getFavorites(email: string): Observable<string[]> {
    const emailData = { email };
    return this.http.post<{ favorites: string[] }>('http://localhost:3000/api/favorites', emailData)
      .pipe(
        map(res => {
          this.favorites = res.favorites;
          return this.favorites;
        })
      );
  }

  getToken(): string | null {
    return this.token;
  }
  getAuthSub() {
    return this.authenticatedSub.asObservable();
  }
  getUserkey() {
    return this.userkey;
  }
}
