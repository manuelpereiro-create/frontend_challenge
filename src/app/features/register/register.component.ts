import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        
        <div class="auth-header">
          <h2>Crear Cuenta</h2>
          <p>Únete a Angular Academy</p>
        </div>
        
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          
          <div class="form-group">
            <label>Nombre Completo</label>
            <input type="text" formControlName="name" class="form-input" placeholder="Ej: Juan Pérez">
          </div>

          <div class="form-group">
            <label>Correo Electrónico</label>
            <input type="email" formControlName="email" class="form-input" placeholder="nombre@ejemplo.com">
            <div *ngIf="f['email'].touched && f['email'].invalid" class="error-text">
                <span *ngIf="f['email'].hasError('required')">El email es requerido.</span>
                <span *ngIf="f['email'].hasError('email')">Formato inválido.</span>
            </div>
          </div>

          <div class="form-group">
            <label>Contraseña</label>
            <div class="input-wrapper">
                <input [type]="showPassword ? 'text' : 'password'" 
                       formControlName="password" 
                       class="form-input" 
                       placeholder="••••••••">
                
                <button type="button" class="btn-toggle-pass" (click)="togglePassword()">
                    <svg *ngIf="!showPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <svg *ngIf="showPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                </button>
            </div>
            
            <div *ngIf="f['password'].touched && f['password'].invalid" class="error-text">
                <div *ngIf="f['password'].hasError('minlength')">• Mínimo 8 caracteres</div>
                <div *ngIf="f['password'].hasError('pattern')">• Debe incluir un número</div>
            </div>
          </div>

          <div class="form-group">
            <label>Confirmar Contraseña</label>
            <div class="input-wrapper">
                <input [type]="showConfirmPassword ? 'text' : 'password'" 
                       formControlName="confirmPassword" 
                       class="form-input" 
                       placeholder="••••••••">
                
                <button type="button" class="btn-toggle-pass" (click)="toggleConfirmPassword()">
                    <svg *ngIf="!showConfirmPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <svg *ngIf="showConfirmPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                </button>
            </div>
            
            <div *ngIf="f['confirmPassword'].touched && registerForm.hasError('mismatch')" class="error-text">
                Las contraseñas no coinciden.
            </div>
          </div>

          <div class="error-msg" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>

          <button type="submit" [disabled]="registerForm.invalid" class="btn-primary">
            Registrarse
          </button>

          <div class="auth-footer">
            ¿Ya tienes cuenta? <a routerLink="/login" class="link">Inicia Sesión aquí</a>
          </div>

        </form>
      </div>
    </div>
  `,
  styles: []
})
export class RegisterComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    errorMessage = '';
    
    showPassword = false;
    showConfirmPassword = false;

    registerForm = this.fb.group({
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*\d).+$/)]],
        confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

    passwordMatchValidator(group: AbstractControl) {
        const password = group.get('password')?.value;
        const confirmPassword = group.get('confirmPassword')?.value;
        return password === confirmPassword ? null : { mismatch: true };
    }

    get f() { return this.registerForm.controls; }

    togglePassword() {
        this.showPassword = !this.showPassword;
    }

    toggleConfirmPassword() {
        this.showConfirmPassword = !this.showConfirmPassword;
    }

    onSubmit() {
        if (this.registerForm.valid) {
            this.authService.register(this.registerForm.value).subscribe({
                next: () => {
                    alert('Registro exitoso. Por favor, inicia sesión.');
                    this.router.navigate(['/login']);
                },
                error: (err) => {
                    this.errorMessage = err.error?.message || 'Error en el registro.';
                }
            });
        }
    }
}