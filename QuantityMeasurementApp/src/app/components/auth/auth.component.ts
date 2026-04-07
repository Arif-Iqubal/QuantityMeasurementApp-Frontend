import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {

  isLoginMode = true;
  showPasswordLogin = false;
  showPasswordSignup = false;
  showConfirmPassword = false;
  errorMessage = '';

  loginForm: FormGroup;
  signupForm: FormGroup;

  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    this.signupForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, this.passwordStrengthValidator]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (token) {
      localStorage.setItem('token', token);
      this.router.navigate(['/dashboard']);
    }
  }

  // Custom validator for strong password
  passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /[0-9]/.test(value);
    const hasSpecial = /[#?!@$%^&*-]/.test(value);
    const hasMinLength = value.length >= 8;

    const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecial && hasMinLength;
    return !passwordValid ? {
      passwordStrength: {
        hasUpperCase,
        hasLowerCase,
        hasNumeric,
        hasSpecial,
        hasMinLength
      }
    } : null;
  }

  // Custom validator for password matching
  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');

    if (!password || !confirmPassword) return null;

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  // 🔄 Toggle Login/Signup
  toggleMode(isLogin: boolean) {
    this.isLoginMode = isLogin;
    this.errorMessage = '';
    // Reset forms when switching modes
    if (isLogin) {
      this.loginForm.reset();
    } else {
      this.signupForm.reset();
    }
  }

  // 👁 Toggle password visibility
  togglePassword(type: string) {
    if (type === 'login') this.showPasswordLogin = !this.showPasswordLogin;
    if (type === 'signup') this.showPasswordSignup = !this.showPasswordSignup;
    if (type === 'confirm') this.showConfirmPassword = !this.showConfirmPassword;
  }

  // // Google OAuth login
  // loginWithGoogle() {
  //   this.authService.initiateGoogleLogin();
  // }

  // 🔐 Submit
  onSubmit() {
    this.errorMessage = '';

    if (this.isLoginMode) {
      if (this.loginForm.invalid) {
        this.errorMessage = 'Please fill in all required fields correctly.';
        return;
      }

      const { email, password } = this.loginForm.value;

      this.authService.login({ email, password }).subscribe({
        next: (res: any) => {
          localStorage.setItem("token", res.token);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = err.error?.message || "Login failed";
        }
      });
    } else {
      if (this.signupForm.invalid) {
        this.errorMessage = 'Please fill in all required fields correctly.';
        return;
      }

      const { username, email, password } = this.signupForm.value;

      this.authService.register({ username, email, password }).subscribe({
        next: (res: any) => {
          localStorage.setItem("token", res.token);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = err.error?.message || "Registration failed";
        }
      });
    }
  }

  // 🔥 Google Login
  loginWithGoogle() {
    window.location.href = 'http://localhost:8080/auth/google';
  }
  // loginWithGoogle() {
  //   this.authService.initiateGoogleLogin();
  // }
}