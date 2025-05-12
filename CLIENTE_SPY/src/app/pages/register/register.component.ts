import { Component } from '@angular/core';
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
import { AuthService } from '../../../services/auth.service'; // Ajusta según estructura

@Component({
  selector: 'app-register',
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
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  hidePassword = true;
  hideConfirmPassword = true;

  registerForm: FormGroup;

  constructor(private router: Router, private fb: FormBuilder, private authService: AuthService, private apiService: ApiService) {
    this.registerForm = this.fb.group({
      type: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      documentNumber: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    })
  }

  register() {
    if (!this.registerForm.valid) {
      alert('Por favor complete todos los campos');
      return;
    }

    const formData = this.registerForm.value;

    const extendedData = {
      ...formData,
      Fecha_Creacion: new Date().toISOString(),
      role: 'user',
    };

    const jsonData = JSON.stringify(extendedData);

    this.apiService.post(`http://localhost:8082/v1/usuarios`, jsonData).subscribe({
      next: (response) => {
        console.log('Registro exitoso', response);
        alert('Usuario creado con éxito');
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Error en el registro:', error);
        alert('Error al guardar el usuario o ya existe');
      }
    });
  }

  goToLogin() {
    console.log('Boton de login clickeado');
    this.router.navigate(['/login']);
  }

  goToTerms() {
    console.log('Boton de terminos y condiciones clickeado');
    this.router.navigate(['/terms-and-conditions']);
  }

}
