import { Component, EventEmitter, Output, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../../services/auth.service';
import { MidService } from '../../../../services/mid.service';
import { AlertsComponent } from '../../alerts/alerts.component';

@Component({
  selector: 'app-edit-vehicle',
  standalone: true,
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
  templateUrl: './edit-vehicle.component.html',
  styleUrl: './edit-vehicle.component.css',
})
export class EditVehicleComponent implements OnInit {
  @Output() refreshVehiculos = new EventEmitter<void>();
  @Input() vehiculo: any = null;
  @ViewChild('alertsComp') alertsComp!: AlertsComponent;

  editForm: FormGroup;
  previewUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  base64ImageData: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private midService: MidService
  ) {
    this.editForm = this.fb.group({
      vehicleType: [''],
      vehicleBrand: [''],
      vehicleModel: [''],
      vehicleYear: [''],
      vehiclePlate: [''],
    });
  }

  ngOnInit(): void {
    if (this.vehiculo) {
      this.editForm.patchValue({
        vehicleType: this.vehiculo.Tipo,
        vehicleBrand: this.vehiculo.Marca,
        vehicleModel: this.vehiculo.Modelo,
        vehicleYear: this.vehiculo.Anio,
        vehiclePlate: this.vehiculo.Placa,
      });

      if (this.vehiculo.Imagen) {
        this.previewUrl = this.getBase64ImageSrc(this.vehiculo.Imagen);
        this.base64ImageData = this.vehiculo.Imagen;
      }
    }
  }

  getBase64ImageSrc(base64: string): string {
    const mime = base64.startsWith('/9j/') ? 'image/jpeg' :
      base64.startsWith('iVBOR') ? 'image/png' : 'image/jpeg';
    return `data:${mime};base64,${base64}`;
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      const maxSizeInMB = 2;

      if (!validTypes.includes(file.type)) {
        this.alertsComp.showAlert('⚠️ Por favor selecciona una imagen válida (JPG, PNG, WEBP).', 'warning');
        return;
      }

      if (file.size > maxSizeInMB * 1024 * 1024) {
        this.alertsComp.showAlert(`⚠️ La imagen no debe superar los ${maxSizeInMB}MB.`, 'warning');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        this.previewUrl = result;
        this.base64ImageData = result.split(',')[1];
      };
      reader.readAsDataURL(file);
    }
  }

  update(): void {
    if (!this.vehiculo?.Id) {
      this.alertsComp.showAlert('❌ Error: No se proporcionó un ID válido', 'error');
      return;
    }

    const formValue = this.editForm.value;
    const dataToSend: any = {};

    for (const key in formValue) {
      if (formValue[key]) {
        switch (key) {
          case 'vehicleType': dataToSend['Tipo'] = formValue[key]; break;
          case 'vehicleBrand': dataToSend['Marca'] = formValue[key]; break;
          case 'vehicleModel': dataToSend['Modelo'] = formValue[key]; break;
          case 'vehicleYear': dataToSend['Anio'] = formValue[key]; break;
          case 'vehiclePlate': dataToSend['Placa'] = formValue[key]; break;
        }
      }
    }

    if (this.base64ImageData) {
      dataToSend['Imagen'] = this.base64ImageData;
    }

    this.midService.updateVehiculo(this.vehiculo.Id, dataToSend).subscribe({
      next: (res) => {
        console.log('✅ Vehículo actualizado', res);
        this.alertsComp.showAlert('🚗 Vehículo actualizado correctamente', 'success', 2000);
        this.refreshVehiculos.emit();
      },
      error: (err) => {
        console.error('❌ Error al actualizar vehículo:', err);
        this.alertsComp.showAlert('❌ Error al actualizar el vehículo', 'error');
      },
    });
  }
}
