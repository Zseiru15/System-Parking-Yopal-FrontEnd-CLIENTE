import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
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
import { MidService } from '../../../../services/mid.service';

@Component({
  selector: 'app-edit-parking-profile',
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
  templateUrl: './edit-parking-profile.component.html',
  styleUrl: './edit-parking-profile.component.css'
})
export class EditParkingProfileComponent implements OnInit {
  @Output() refreshParqueaderos = new EventEmitter<void>();
  @Input() parqueadero: any = null;

  registerForm: FormGroup;
  previewUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  base64ImageData: string = '';

  constructor(private router: Router, private fb: FormBuilder, private authService: AuthService, private apiService: ApiService, private midService: MidService) {
    this.registerForm = this.fb.group({
      parkingName: [''],
      number: [''],
      latitude: [''],
      length: [''],
      email: [''],
      address: [''],
      cars: [''],
      motorcycles: [''],
      bicycles: [''],
      long: [''],
      broad: [''],
      height: [''],
      type: [''],
      floor: [''],
      shade: [''],
      description: [''],
    });
  }

  ngOnInit(): void {
    if (this.parqueadero) {
      this.registerForm.patchValue({
        parkingName: this.parqueadero.Nombres,
        number: this.parqueadero.Telefono,
        latitude: this.parqueadero.Latitud,
        length: this.parqueadero.Longitud,
        email: this.parqueadero.Email,
        address: this.parqueadero.Direccion,
        cars: this.parqueadero.Carros,
        motorcycles: this.parqueadero.Motos,
        bicycles: this.parqueadero.Bicicletas,
        long: this.parqueadero.Largo,
        broad: this.parqueadero.Ancho,
        height: this.parqueadero.Altura,
        type: this.parqueadero.Tipo,
        floor: this.parqueadero.Pisos,
        shade: this.parqueadero.Sombra,
        description: this.parqueadero.Descripcion
      });

      if (this.parqueadero.Imagen) {
        this.previewUrl = this.getBase64ImageSrc(this.parqueadero.Imagen);
        this.base64ImageData = this.parqueadero.Imagen;
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
        alert('Formato de imagen no permitido.');
        return;
      }

      if (file.size > maxSizeInMB * 1024 * 1024) {
        alert(`Imagen muy pesada, máximo ${maxSizeInMB}MB.`);
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
    if (!this.parqueadero?.Id) {
      alert('Error: No se proporcionó un ID válido');
      return;
    }

    const formValue = this.registerForm.value;
    const dataToSend: any = {};

    for (const key in formValue) {
      if (formValue[key] !== null && formValue[key] !== '') {
        switch (key) {
          case 'parkingName': dataToSend['Nombres'] = formValue[key]; break;
          case 'number': dataToSend['Telefono'] = formValue[key]; break;
          case 'latitude': dataToSend['Latitud'] = formValue[key]; break;
          case 'length': dataToSend['Longitud'] = formValue[key]; break;
          case 'email': dataToSend['Email'] = formValue[key]; break;
          case 'address': dataToSend['Direccion'] = formValue[key]; break;
          case 'cars': dataToSend['Carros'] = formValue[key]; break;
          case 'motorcycles': dataToSend['Motos'] = formValue[key]; break;
          case 'bicycles': dataToSend['Bicicletas'] = formValue[key]; break;
          case 'long': dataToSend['Largo'] = formValue[key]; break;
          case 'broad': dataToSend['Ancho'] = formValue[key]; break;
          case 'height': dataToSend['Altura'] = formValue[key]; break;
          case 'type': dataToSend['Tipo'] = formValue[key]; break;
          case 'floor': dataToSend['Pisos'] = formValue[key]; break;
          case 'shade': dataToSend['Sombra'] = formValue[key]; break;
          case 'description': dataToSend['Descripcion'] = formValue[key]; break;
        }
      }
    }

    if (this.base64ImageData) {
      dataToSend['Imagen'] = this.base64ImageData;
    }

    this.midService.updateParqueadero(this.parqueadero.Id, dataToSend).subscribe({
      next: (res) => {
        console.log('✅ Parqueadero actualizado', res);
        alert('Parqueadero actualizado correctamente');
        this.refreshParqueaderos.emit();
      },
      error: (err) => {
        console.error('❌ Error al actualizar parqueadero:', err);
        alert('Error al actualizar el parqueadero');
      }
    });
  }

}
