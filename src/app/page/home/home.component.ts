import { Component, OnInit } from '@angular/core';
import { MovieboxComponent } from '../../components/moviebox/moviebox.component';
import { HomeLayoutComponent } from '../../layouts/home-layout/home-layout.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MovieboxComponent, HomeLayoutComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  constructor() {}
  ngOnInit(): void {}
}
