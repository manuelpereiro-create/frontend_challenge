import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        
        <div class="auth-header">
          <h2>Bienvenido de nuevo</h2>
          <p>Ingresa tus credenciales para continuar</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          
          <div class="form-group">
            <label>Correo Electrónico</label>
            <input 
              type="email" 
              class="form-input" 
              formControlName="email" 
              placeholder="nombre@ejemplo.com"
              [class.error-border]="f['email'].touched && f['email'].invalid">
          </div>

          <div class="form-group">
            <label>Contraseña</label>
            <input 
              type="password" 
              class="form-input" 
              formControlName="password" 
              placeholder="••••••••">
          </div>

          <div class="error-msg" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>

          <button 
            type="submit" 
            class="btn-primary" 
            [disabled]="loginForm.invalid || isLoading">
            {{ isLoading ? 'Validando...' : 'Iniciar Sesión' }}
          </button>
        
        </form>

        <div class="auth-footer">
          ¿Aún no tienes cuenta? 
          <a routerLink="/register" class="link">Regístrate</a>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .error-border { border-color: #ef4444; }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  errorMessage = '';
  isLoading = false;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  get f() { return this.loginForm.controls; }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      const { email, password } = this.loginForm.value;
      
      this.authService.login({ email: email!, password: password! }).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error.message || 'Usuario o contraseña incorrectos';
        }
      });
    }
  }
}