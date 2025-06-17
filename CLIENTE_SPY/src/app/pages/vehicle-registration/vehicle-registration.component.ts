import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
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
import { AuthService } from '../../../services/auth.service';
import { AlertsComponent } from '../alerts/alerts.component'; // Ajusta esta ruta si es necesario

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
    AlertsComponent
  ],
  templateUrl: './vehicle-registration.component.html',
  styleUrl: './vehicle-registration.component.css'
})
export class VehicleRegistrationComponent {
  @Output() refreshVehiculos = new EventEmitter<void>();
  @ViewChild('alertsComp') alertsComp!: AlertsComponent;

  hidePassword = true;
  editFrom: FormGroup;
  previewUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  base64ImageData: string = '';

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private apiService: ApiService
  ) {
    this.editFrom = this.fb.group({
      vehicleType: ['', Validators.required],
      vehicleBrand: ['', Validators.required],
      vehicleModel: ['', Validators.required],
      vehicleYear: ['', Validators.required],
      vehiclePlate: ['', Validators.required],
    });
  }

  editprofile(): void {
    if (this.editFrom.invalid) {
      this.alertsComp.showAlert('Por favor completa todos los campos obligatorios.', 'warning');
      return;
    }

    const userId = this.authService.getCurrentUserId();
    const vehicleData = {
      Type: this.editFrom.value.vehicleType,
      vehicleBrand: this.editFrom.value.vehicleBrand,
      vehicleModel: this.editFrom.value.vehicleModel,
      vehicleYear: this.editFrom.value.vehicleYear,
      vehiclePlate: this.editFrom.value.vehiclePlate,
      Imagen: this.base64ImageData,
      IdUsuariosFk: { Id: userId }
    };

    this.apiService.post('vehiculos', vehicleData).subscribe({
      next: (response) => {
        console.log('Vehículo registrado', response);
        this.alertsComp.showAlert('🚗 Vehículo registrado exitosamente', 'success', 2000);
        this.refreshVehiculos.emit();
      },
      error: (err) => {
        console.error('Error', err);
        this.alertsComp.showAlert('❌ Error al registrar el vehículo', 'error');
      }
    });
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      const maxSizeInMB = 2;

      if (!validTypes.includes(file.type)) {
        this.alertsComp.showAlert('⚠️ Formato de imagen no permitido. Usa JPG, PNG o WEBP.', 'warning');
        return;
      }

      if (file.size > maxSizeInMB * 1024 * 1024) {
        this.alertsComp.showAlert(`⚠️ La imagen no debe superar los ${maxSizeInMB}MB.`, 'warning');
        return;
      }

      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        this.previewUrl = result;
        this.base64ImageData = result.split(',')[1];
      };
      reader.readAsDataURL(file);
    }
  }
}
