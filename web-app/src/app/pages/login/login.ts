import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { IAuth } from '../../interfaces/auth';
import { MatCardHeader, MatCardModule } from '@angular/material/card';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    MatFormField,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatLabel,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  router = inject(Router);
  loginForm!: FormGroup;

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
    if (this.authService.isLoggedIn) {
      console.log('User is already logged in');
      this.router.navigateByUrl('/');
    }
  }

  login() {
    console.log(this.loginForm.valid);
    if (this.loginForm.valid) {
      console.log('Login Data:', this.loginForm.value);
      this.authService
        .login(this.loginForm.value.email, this.loginForm.value.password)
        .subscribe((res: IAuth) => {
          console.log(res);
          this.authService.saveToken(res);
          if (res.role == 'Admin') {
            this.router.navigateByUrl('/');
          } else {
            this.router.navigateByUrl('/employee-dashboard');
          }
        });
    }
  }
}
