import { Component, EventEmitter, Output, Input } from '@angular/core';
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
import { AuthService } from '../../../../services/auth.service'; // Ajusta según estructura
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
  @Output() refreshParqueaderos = new EventEmitter<void>(); // ✅ Este evento lo escucha el padre
  @Input() parqueadero: any = null;
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

    const userId = this.authService.getCurrentUserId(); // ID del usuario logeado

    const formData = {
      ...this.registerForm.value,
      Imagen: this.base64ImageData,
      IdAdministradoresFk: { Id: userId }  // 👈 CAMBIO CLAVE AQUÍ
    };

    this.apiService.post('parqueaderos', formData).subscribe({
      next: (response) => {
        console.log('Registro exitoso', response);
        alert('Parqueadero creado con éxito');
        this.refreshParqueaderos.emit(); // ✅ Notifica al padre
      },
      error: (error) => {
        console.error('Error en el registro:', error);
        alert('Error al guardar el parqueadero o ya existe');
      }
    });
  }

  previewUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  base64ImageData: string = '';

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      const maxSizeInMB = 2;

      if (!validTypes.includes(file.type)) {
        alert('Por favor selecciona una imagen válida (JPG, PNG, WEBP).');
        return;
      }

      if (file.size > maxSizeInMB * 1024 * 1024) {
        alert('La imagen no debe superar los ${maxSizeInMB}MB.');
        return;
      }

      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        this.previewUrl = result; // con prefijo para mostrar vista previa
        this.base64ImageData = result.split(',')[1]; // sin prefijo para enviar al backend
      };
      reader.readAsDataURL(file);
    }
  }

}
