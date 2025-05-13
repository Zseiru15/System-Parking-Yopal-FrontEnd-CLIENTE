import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../services/auth.service'; // Ajusta según estructura
@Component({
  selector: 'app-parking-registration',
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatOptionModule,
    MatSelectModule,
    MatIconModule,
  ],
  templateUrl: './parking-registration.component.html',
  styleUrl: './parking-registration.component.css'
})
export class ParkingRegistrationComponent {

  registerForm: FormGroup;

  constructor(private router: Router, private fb: FormBuilder, private authService: AuthService, private apiService: ApiService) {
    this.registerForm = this.fb.group({
      parkingName: ['', Validators.required],
      latitude: ['', Validators.required],
      length: ['', Validators.required],
      address: ['', Validators.required],
      cars: ['', Validators.required],
      motorcycles: ['', Validators.required],
      bicycles: ['', Validators.required],
      height: ['', Validators.required],
      type: ['', Validators.required],
      floor: ['', Validators.required],
      shade: ['', Validators.required],
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
    };

    const jsonData = JSON.stringify(extendedData);

    console.log (jsonData)
    
    this.apiService.post(`http://localhost:8082/v1/parqueaderos`, jsonData).subscribe({

      next: (response) => {
        console.log('Registro exitoso', response);
        alert('Parqueadero creado con éxito');

        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Error en el registro:', error);
        alert('Error al guardar el parqueadero o ya existe');
      }
    });
  }
}
