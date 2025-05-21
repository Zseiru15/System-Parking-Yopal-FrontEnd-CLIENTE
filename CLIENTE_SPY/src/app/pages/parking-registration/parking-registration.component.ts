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
    })
  }

  register() {
    if (!this.registerForm.valid) {
      alert('Por favor complete todos los campos');
      return;
    }

    const userId = this.authService.getCurrentUserId(); // Asegúrate de que este método existe

    const formData = {
      ...this.registerForm.value,
      Imagen: this.parkingImage,
      IdAdministradoresFk: { Id: userId }  // 👈 CAMBIO CLAVE AQUÍ
    };

    this.apiService.post('parqueaderos', formData).subscribe({
      next: (response) => {
        console.log('Registro exitoso', response);
        alert('Parqueadero creado con éxito');
      },
      error: (error) => {
        console.error('Error en el registro:', error);
        alert('Error al guardar el parqueadero o ya existe');
      }
    });
  }

  previewUrl: string | null = null;
  selectedFile: File | null = null;

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      const maxSizeInMB = 2;

      if (!validTypes.includes(file.type)) {
        alert('Formato inválido');
        return;
      }

      if (file.size > maxSizeInMB * 1024 * 1024) {
        alert('La imagen es muy grande');
        return;
      }

      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Quitamos el encabezado
        this.previewUrl = result;
        const base64Index = result.indexOf('base64,') + 7;
        this.parkingImage = result.substring(base64Index);
      };
      reader.readAsDataURL(file);
    }
  }

  parkingImage: string = '';


}
