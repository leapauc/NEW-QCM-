import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthUser } from '../models/authUser';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  login(
    name: string,
    password: string
  ): Observable<{ message: string; user: AuthUser }> {
    return this.http
      .post<{ message: string; user: AuthUser }>(`${this.apiUrl}/login`, {
        name,
        password,
      })
      .pipe(
        tap((res) => {
          if (res.user) {
            localStorage.setItem('user', JSON.stringify(res.user));
          }
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getUser(): AuthUser | null {
    const user = localStorage.getItem('user');
    return user ? (JSON.parse(user) as AuthUser) : null;
  }

  isAdmin(): boolean {
    const user = this.getUser();
    return user?.admin === true;
  }

  isLoggedIn(): boolean {
    return !!this.getUser();
  }
}
