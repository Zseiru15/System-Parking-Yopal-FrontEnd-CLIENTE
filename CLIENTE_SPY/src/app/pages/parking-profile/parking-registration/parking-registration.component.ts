import { Component, EventEmitter, Output, Input, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../../services/auth.service';
import { AlertsComponent } from '../../alerts/alerts.component'; // Asegúrate que la ruta sea correcta

declare const google: any;

@Component({
  selector: 'app-parking-registration',
  standalone: true,
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
    AlertsComponent
  ],
  templateUrl: './parking-registration.component.html',
  styleUrl: './parking-registration.component.css'
})
export class ParkingRegistrationComponent implements AfterViewInit {
  @Output() refreshParqueaderos = new EventEmitter<void>();
  @Input() parqueadero: any = null;
  @ViewChild('alertsComp') alertsComp!: AlertsComponent;

  registerForm: FormGroup;
  previewUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  base64ImageData: string = '';
  autocomplete!: google.maps.places.Autocomplete;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private apiService: ApiService
  ) {
    this.registerForm = this.fb.group({
      parkingName: ['', Validators.required],
      number: ['', Validators.required],
      latitude: ['', Validators.required],
      length: ['', Validators.required],
      email: ['', Validators.required],
      address: ['', Validators.required],
      cars: ['', Validators.required],
      motorcycles: ['', Validators.required],
      bicycles: ['', Validators.required],
      long: ['', Validators.required],
      broad: ['', Validators.required],
      height: ['', Validators.required],
      type: ['', Validators.required],
      floor: ['', Validators.required],
      shade: ['', Validators.required],
      description: [''],
    });
  }

  ngAfterViewInit(): void {
    const input = document.getElementById('searchBox') as HTMLInputElement;

    if (input) {
      this.autocomplete = new google.maps.places.Autocomplete(input, {
        types: ['geocode'],
        componentRestrictions: { country: 'co' } // opcional: restringe a Colombia
      });

      this.autocomplete.addListener('place_changed', () => {
        const place = this.autocomplete.getPlace();

        if (!place.geometry || !place.geometry.location) {
          this.alertsComp.showAlert('No se encontró la ubicación seleccionada', 'warning');
          return;
        }

        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const address = place.formatted_address;

        // Actualizar el formulario
        this.registerForm.patchValue({
          address: address,
          latitude: lat.toString(),
          length: lng.toString()
        });
      });
    }
  }

  register() {
    if (!this.registerForm.valid) {
      this.alertsComp.showAlert('Por favor complete todos los campos', 'warning');
      return;
    }

    const userId = this.authService.getCurrentUserId();

    const formData = {
      ...this.registerForm.value,
      Imagen: this.base64ImageData,
      IdAdministradoresFk: { Id: userId }
    };

    this.apiService.post('parqueaderos', formData).subscribe({
      next: (response) => {
        console.log('✅ Registro exitoso', response);
        this.alertsComp.showAlert('Parqueadero creado con éxito', 'success');
        this.refreshParqueaderos.emit();
        this.registerForm.reset();
        this.previewUrl = null;
        this.base64ImageData = '';
      },
      error: (error) => {
        console.error('❌ Error en el registro:', error);
        this.alertsComp.showAlert('Error al guardar el parqueadero o ya existe', 'error');
      }
    });
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      const maxSizeInMB = 2;

      if (!validTypes.includes(file.type)) {
        this.alertsComp.showAlert('Por favor selecciona una imagen válida (JPG, PNG, WEBP).', 'warning');
        return;
      }

      if (file.size > maxSizeInMB * 1024 * 1024) {
        this.alertsComp.showAlert(`La imagen no debe superar los ${maxSizeInMB}MB.`, 'warning');
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
