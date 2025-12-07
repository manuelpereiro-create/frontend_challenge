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
    <div class="container">
      <h2>Registro</h2>
      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
        
        <div>
          <label>Nombre:</label>
          <input type="text" formControlName="name">
        </div>

        <div>
          <label>Email:</label>
          <input type="email" formControlName="email">
          <small *ngIf="f['email'].errors?.['email']">Email inválido</small>
        </div>

        <div>
          <label>Password:</label>
          <input type="password" formControlName="password">
          <small *ngIf="f['password'].errors?.['minlength']">Mínimo 8 caracteres</small>
          <small *ngIf="f['password'].errors?.['pattern']">Debe incluir un número</small>
        </div>

        <div>
          <label>Confirmar Password:</label>
          <input type="password" formControlName="confirmPassword">
          <small *ngIf="registerForm.errors?.['mismatch']">Las contraseñas no coinciden</small>
        </div>

        <p class="error" *ngIf="errorMessage">{{ errorMessage }}</p>

        <button type="submit" [disabled]="registerForm.invalid">Registrarse</button>
      </form>
      <p>¿Ya tienes cuenta? <a routerLink="/login">Ingresa</a></p>
    </div>
  `,
  styles: ['.container { max-width: 400px; margin: 2rem auto; }', 'small { color: red; display: block; }']
})
export class RegisterComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    errorMessage = '';

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

    get f() {
        return this.registerForm.controls;
    }

    onSubmit() {
        if (this.registerForm.valid) {
            this.authService.register(this.registerForm.value).subscribe({
                next: () => {
                    alert('Registro exitoso. Por favor, inicia sesión.');
                    this.router.navigate(['/login']);
                },
                error: (err) => this.errorMessage = 'Error en el registro. Inténtalo de nuevo.'
            });
        }
    }
}