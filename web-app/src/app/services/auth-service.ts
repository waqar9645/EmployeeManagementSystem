import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IAuth } from '../interfaces/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiURL = 'https://localhost:7218';
  http = inject(HttpClient);
  router = inject(Router);

  constructor() {}

  login(email: string, password: string) {
    return this.http.post<IAuth>(`${this.apiURL}/api/Auth/login`, {
      email: email,
      password: password,
    });
  }

  saveToken(authToken: IAuth) {
    localStorage.setItem('auth', JSON.stringify(authToken));
    localStorage.setItem('token', authToken.token);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('auth');
    this.router.navigateByUrl('/login');
  }

  get isLoggedIn() {
    return localStorage.getItem('token') ? true : false;
  }

  get isEmployee() {
    if(!this.isLoggedIn) {
      return false;
    }
    let auth = JSON.parse(localStorage.getItem('auth')!);
    if (auth.role == 'Employee') {
      return true;
    } else {
      return false;
    }
  }

  get authDetail() : IAuth | null{
    if(!this.isLoggedIn) return null;
    let auth : IAuth = JSON.parse(localStorage.getItem('auth')!);
    return auth;
  }

  getProfile(){
    return this.http.get(`${this.apiURL}/api/Auth/profile`);
  }

  updateProfile(data : any){
    return this.http.post(`${this.apiURL}/api/Auth/profile`, data);
  }


}
