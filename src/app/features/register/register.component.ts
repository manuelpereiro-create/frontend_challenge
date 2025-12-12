import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
    private fb: FormBuilder = inject(FormBuilder);
    private authService: AuthService = inject(AuthService);
    private router: Router = inject(Router);
    private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

    protected errorMessage: string = '';
    
    showPassword: boolean = false;
    showConfirmPassword: boolean = false;
    showSuccess: boolean = false;

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
                    this.showSuccess = true;
                    this.cdr.detectChanges();
                    setTimeout(() => {this.router.navigate(['/login']);}, 2000);
                },
                error: (err) => {
                    this.errorMessage = err.error?.message || 'Error en el registro.';
                    this.showSuccess = false;
                    this.cdr.detectChanges();
                }
            });
        }
    }
}