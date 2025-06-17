import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../../../services/auth.service';
import { AlertsComponent } from '../alerts/alerts.component'; // ajusta el path real

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatOptionModule,
    MatSelectModule,
    AlertsComponent
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  hidePassword = true;
  registerForm: FormGroup;

  @ViewChild('alertsComp') alertsComp!: AlertsComponent;

  constructor(private router: Router, private fb: FormBuilder, private authService: AuthService, private apiService: ApiService) {
    this.registerForm = this.fb.group({
      // type: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      documentNumber: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    })
  }

  register() {
    if (this.registerForm.invalid) {
      this.alertsComp.showAlert('Por favor complete todos los campos', 'warning');
      return;
    }

    const formData = this.registerForm.value;
    const extendedData = {
      ...formData,
      Fecha_Creacion: new Date().toISOString(),
    };

    this.apiService.post('usuarios', extendedData).subscribe({
      next: (res: any) => {
        console.log('Registro exitoso', res);
        this.alertsComp.showAlert('Usuario creado con éxito', 'success');

        if (res?.token) {
          this.authService.saveToken(res.token);
          this.authService.setUserSession(res.Data);
          this.alertsComp.showAlert('Registro exitoso', 'success', 2000, () => {
            this.router.navigate(['/dashboard/start']);
          });
        } else {
          this.router.navigate(['/login']);
        }
      },
      error: (error) => {
        console.error('Error completo:', error);
        const errorMsg = error.error?.message || 'Error al guardar el usuario o ya existe';
        this.alertsComp.showAlert(errorMsg, 'error');
      }
    });
  }

  togglePasswordVisibility(event: MouseEvent) {
    event.preventDefault(); // evita submit
    event.stopPropagation(); // evita burbujeo innecesario
    this.hidePassword = !this.hidePassword;
  }

  goToLogin() {
    console.log('Boton de login clickeado');
    this.alertsComp.showAlert('Login Clickeado', 'info', 2000, () => {
      this.router.navigate(['/login']);
    });
  }

  goToTerms() {
    console.log('Boton de terminos y condiciones clickeado');
    this.alertsComp.showAlert('Terminos y Condiciones Clickeado', 'info', 2000, () => {
      this.router.navigate(['/terms-and-conditions']);
    });
  }
}
