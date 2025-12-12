import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        provideHttpClient(), 
        provideRouter([])    
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form should be invalid when empty', () => {
    expect(component.registerForm.valid).toBeFalsy();
  });

  it('should validate password match', () => {
    component.registerForm.patchValue({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password456'
    });

    expect(component.registerForm.hasError('mismatch')).toBeTruthy();

    component.registerForm.patchValue({
      confirmPassword: 'password123'
    });

    expect(component.registerForm.hasError('mismatch')).toBeFalsy();
  });

  it('should validate email format', () => {
    const emailControl = component.registerForm.controls.email;
    
    emailControl.setValue('invalid-email');
    expect(emailControl.hasError('email')).toBeTruthy();

    emailControl.setValue('valid@email.com');
    expect(emailControl.hasError('email')).toBeFalsy();
  });

  it('should require password minimum length', () => {
    const passwordControl = component.registerForm.controls.password;
    
    passwordControl.setValue('short1');
    expect(passwordControl.hasError('minlength')).toBeTruthy();

    passwordControl.setValue('longpass1');
    expect(passwordControl.hasError('minlength')).toBeFalsy();
  });

  it('should require password to contain a number', () => {
    const passwordControl = component.registerForm.controls.password;
    
    passwordControl.setValue('noNumbers');
    expect(passwordControl.hasError('pattern')).toBeTruthy();

    passwordControl.setValue('hasNumber1');
    expect(passwordControl.hasError('pattern')).toBeFalsy();
  });
});
