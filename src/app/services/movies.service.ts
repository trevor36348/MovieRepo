import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Movie } from '../model/movies.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  private DUMMY_API = 'https://corsproxy.io/?https://dummyapi.online/api/movies';

  constructor(private http: HttpClient) {}

  getMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.DUMMY_API}`);
  }

  getMovieById(id: any): Observable<Movie> {
    return this.http.get<Movie>(`${this.DUMMY_API}/${id}`);
  }
}
