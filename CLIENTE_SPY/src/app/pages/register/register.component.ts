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
    if (this.registerForm.valid) {
      const { firstName, lastName, documentNumber, phone, email, password } = this.registerForm.value;

      this.authService.register(firstName, lastName, documentNumber, phone, email, password).subscribe({
        next: (res) => {
          localStorage.setItem('token', res.token); // Ajusta esto si tu API devuelve el token en otra propiedad
          console.log('Registro exitoso', res);
          alert('Registro exitoso');
          this.router.navigate(['/dashboard']);
        },
        error: (err: any) => {
          alert('Credenciales incorrectas o error del servidor');
          console.error('Error de registro:', err);
        }
      });
    } else {
      alert('Por favor complete todos los campos');
    }

    console.log('Registro Exitoso')
    const formData = this.registerForm.value;
    console.log('datos capturados', formData)

    const extededData = {
      ...formData,
      Fecha_Creacion: new Date().toISOString(),
      role: 'user',
    }

    console.log('Dato extendido', extededData)
    const jsonData = JSON.stringify(formData, null, 2)

    this.apiService.post(`http://localhost:8082/v1/usuarios`, jsonData).subscribe({
      next: (response) => {
        console.log('registro exitoso')
        console.log('Response', response)
        alert('Se creo el usuario')
      },
      error: (error) => {
        console.log('Ojo, error en el post')
        alert('Error al guardar el usuario')
      }
    })



    console.log('Datos json', jsonData)
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
