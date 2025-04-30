import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  // login
  login(email: string, password: string) {
    // HTTP POST request
    const body = new URLSearchParams();
    body.set('username', email);
    body.set('password', password);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    return this.http.post('http://localhost:5000/app/users/login', body, {
      headers: headers,
      withCredentials: true,
    });
  }

  // Register
  register(user: { name: string; email: string; password: string }) {
    // HTTP POST
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(
      'http://localhost:5000/app/users/register',
      JSON.stringify(user),
      { headers: headers }
    );
  }

  // Logout
  logout() {
    return this.http.post(
      'http://localhost:5000/app/users/logout',
      {},
      { withCredentials: true, responseType: 'text' }
    );
  }

  // checkAuth
  checkAuth() {
    return this.http.get<boolean>('http://localhost:5000/app/users/checkAuth', {
      withCredentials: true,
    });
  }
}
