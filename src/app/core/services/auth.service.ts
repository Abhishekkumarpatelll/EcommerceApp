import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, tap } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUser.asObservable();

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }) {
    return this.http.post<{ access_token: string }>(
      `${environment.apiUrl}/auth/login`, 
      credentials
    ).pipe(
      tap(res => {
        localStorage.setItem('token', res.access_token);
        this.getProfile().subscribe();
      })
    );
  }

  register(userData: any) {
    return this.http.post(`${environment.apiUrl}/users`, userData);
  }

  getProfile() {
    return this.http.get<User>(`${environment.apiUrl}/auth/profile`).pipe(
      tap(user => this.currentUser.next(user))
    ); // Fixed missing closing parenthesis and semicolon
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUser.next(null);
  }
}
