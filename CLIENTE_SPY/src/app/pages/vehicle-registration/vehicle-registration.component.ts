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
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service'; // Ajusta según estructura

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
    ReactiveFormsModule,
  ],
  templateUrl: './vehicle-registration.component.html',
  styleUrl: './vehicle-registration.component.css'
})
export class VehicleRegistrationComponent {
  hidePassword = true;
  editFrom: FormGroup;

  constructor(private router: Router, private fb: FormBuilder, private http: HttpClient, private authService: AuthService, private apiService: ApiService) {
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

    const userId = this.authService.getCurrentUserId(); // Este método lo defines en el AuthService
    const vehicleData = {
      Type: this.editFrom.value.vehicleType,
      vehicleBrand: this.editFrom.value.vehicleBrand,
      vehicleModel: this.editFrom.value.vehicleModel,
      vehicleYear: this.editFrom.value.vehicleYear,
      vehiclePlate: this.editFrom.value.vehiclePlate,
      Imagen: this.previewUrl, // imagen en base64
      IdUsuariosFk: { Id: userId }
    };

    this.apiService.post('vehiculos', vehicleData).subscribe({
      next: (response) => console.log('Vehículo registrado', response),
      error: (err) => console.error('Error', err)
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
