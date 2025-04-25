import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.authService.checkAuth().subscribe({
          next: (auth) => (this.isLoggedIn = auth),
          error: (_) => (this.isLoggedIn = false),
        });
      });
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => this.router.navigateByUrl('/'),
      error: err => this.router.navigateByUrl('/'),
    });
  }
}
