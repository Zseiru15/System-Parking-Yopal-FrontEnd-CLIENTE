import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { API_URLS } from '../../../config/api-config';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

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

  hidePassword= true;
  hideConfirmPassword= true;

  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private apiService: ApiService, private router: Router){
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      birthDate: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      gender: ['', Validators.required],
    })
  }

  register(){
    if (this.registerForm.valid){
      console.log('Registro Exitoso')
      const formData = this.registerForm.value;
      console.log('datos capturados', formData)

      const extededData = {
        ...formData,
        Fecha_Creacion: new Date().toISOString(),
        role: 'user',
      }

      console.log('Dato extendido', extededData)

      this.apiService.post(API_URLS.CRUD.Api_crud, extededData).subscribe({
        next: (response) => {
          console.log('registro exitoso')
          console.log('Response', response)
          alert('Se creo el usuario')
          this.goToDashboard()
        },
        error: (error) => {
          console.log('Ojo, error en el post')
          alert('Error al guardar el usuario')
        }
      })

      const jsonData = JSON.stringify(formData, null, 2)

      console.log('Datos json', jsonData)
    }
  }

  goToLogin(){
    console.log('Boton de registro clickeado');
    this.router.navigate(['/login']);
  }
  goToDashboard(){
    console.log('Boton de registro clickeado');
    this.router.navigate(['/user-porfile']);
  }

}
