import {Component, inject} from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  template: `
        <div class="container">
        <h2>Iniciar Sesión</h2>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            
            <div>
            <label>Email:</label>
            <input type="email" formControlName="email">
            </div>

            <div>
            <label>Password:</label>
            <input type="password" formControlName="password">
            </div>

            <p class="error" *ngIf="errorMessage">{{ errorMessage }}</p>

            <button type="submit" [disabled]="loginForm.invalid">Entrar</button>
        </form>
        <p>¿No tienes cuenta? <a routerLink="/register">Regístrate</a></p>
        </div>
    `,
    styles: ['.container { max-width: 400px; margin: 2rem auto; padding: 1rem; border: 1px solid #ccc; }', '.error { color: red; }']
})
export class LoginComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    errorMessage = '';

    loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]]
    });

    onSubmit() {
        if (this.loginForm.valid) {
            const { email, password } = this.loginForm.value;
            this.authService.login({ email: email!, password: password!}).subscribe({
                next: () => this.router.navigate(['/dashboard']),
                error: (err) => this.errorMessage = 'Credenciales Incorrectas o Inválidas'
            });
        }
    }
}