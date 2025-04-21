import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-vehicle-registration',
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  templateUrl: './vehicle-registration.component.html',
  styleUrl: './vehicle-registration.component.css'
})
export class VehicleRegistrationComponent {
  hidePassword= true;
  editFrom: FormGroup;

  constructor(private router: Router, private fb: FormBuilder, private http: HttpClient) {
    this.editFrom = this.fb.group({
      vehicleType: ['', Validators.required],
      vehicleBrand: ['', Validators.required],
      vehicleModel: ['', Validators.required],
      vehicleYear: ['', Validators.required],
      vehiclePlate: ['', Validators.required],
    })
  }

  editprofile(): void {
    if (this.editFrom.invalid) return;

    const formData = new FormData();
    formData.append('vehicleType', this.editFrom.value.vehicleType);
    formData.append('vehicleBrand', this.editFrom.value.vehicleBrand);
    formData.append('vehicleModel', this.editFrom.value.vehicleModel);
    formData.append('vehicleYear', this.editFrom.value.vehicleYear);
    formData.append('vehiclePlate', this.editFrom.value.vehiclePlate);

    if (this.selectedFile) {
      formData.append('profileImage', this.selectedFile); // 'profileImage' debe coincidir con el backend
    }

    this.http.post('http://localhost:8082/v1/usuarios/actualizar', formData).subscribe({
      next: (response) => {
        console.log('Actualización exitosa', response);
        // Redireccionar o mostrar éxito
      },
      error: (err) => {
        console.error('Error al actualizar perfil', err);
      }
    });
  }

  previewUrl: string | ArrayBuffer | null = null;
selectedFile: File | null = null;

onFileSelected(event: Event): void {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    const maxSizeInMB = 2; // Tamaño máximo permitido

    if (!validTypes.includes(file.type)) {
      alert('Por favor selecciona una imagen válida (JPG, PNG, WEBP).');
      return;
    }

    if (file.size > maxSizeInMB * 1024 * 1024) {
      alert(`La imagen no debe superar los ${maxSizeInMB}MB.`);
      return;
    }

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result;
    };
    reader.readAsDataURL(file);
  }
}
}
