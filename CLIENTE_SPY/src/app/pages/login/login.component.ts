import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { MidService } from '../../../services/mid.service';
import { AlertsComponent } from '../alerts/alerts.component';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    AlertsComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  hidePassword = true;
  loginForm: FormGroup;

  @ViewChild('alertsComp') alertsComp!: AlertsComponent;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private midService: MidService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const savedEmail = localStorage.getItem('rememberEmail');
    const savedPassword = localStorage.getItem('rememberPassword');

    if (savedEmail && savedPassword) {
      this.loginForm.patchValue({
        email: savedEmail,
        password: savedPassword,
        rememberMe: true
      });
    }
  }

  login() {
    if (this.loginForm.invalid) {
      this.alertsComp.showAlert('Por favor completa todos los campos.', 'warning');
      return;
    }

    const { email, password, rememberMe } = this.loginForm.value;

    this.midService.loginUser({ email, password }).subscribe({
      next: (res: any) => {
        if (res.Success) {
          localStorage.setItem('usuario', JSON.stringify(res.Data));

          if (rememberMe) {
            localStorage.setItem('rememberEmail', email);
          } else {
            localStorage.removeItem('rememberEmail');
          }

          // ✅ Mostrar alerta y luego redirigir
          this.alertsComp.showAlert('Inicio de sesión exitoso', 'success', 2000, () => {
            this.router.navigate(['/dashboard/start']);
          });

        } else {
          this.alertsComp.showAlert(res.Message || 'Login fallido', 'error');
        }
      },
      error: (err: any) => {
        console.error('❌ Error de login:', err);
        this.alertsComp.showAlert('Error al iniciar sesión', 'error');
      }
    });
  }

  goToRegister() {
    this.alertsComp.showAlert('Crear Cuenta Clickeado', 'info', 2000, () => {
      this.router.navigate(['/register']);
    });
  }

  recoverPassword() {
    this.alertsComp.showAlert('Funcionalidad de recuperación en desarrollo', 'info', 2000, () => {
      this.router.navigate(['/login']);
    });
  }
}
