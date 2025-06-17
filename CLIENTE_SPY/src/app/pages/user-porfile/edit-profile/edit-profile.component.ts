import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { ApiService } from '../../../../services/api.service';
import { AlertsComponent } from '../../alerts/alerts.component';

@Component({
  standalone: true,
  selector: 'app-edit-profile',
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
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent implements OnInit {
  @Output() refreshUsuario = new EventEmitter<void>();
  @ViewChild('alertsComp') alertsComp!: AlertsComponent;

  editFrom: FormGroup;
  hidePassword = true;
  previewUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  userImage: string = '';
  userId: number = 0;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private apiService: ApiService
  ) {
    this.editFrom = this.fb.group({
      firstName: [''],
      lastName: [''],
      documentNumber: [''],
      phone: [''],
      email: [''],
      password: ['']
    });
  }

  editprofile(): void {
    if (!this.userId) {
      this.alertsComp.showAlert('No se pudo obtener el ID del usuario', 'error');
      return;
    }

    const userData: any = {};
    Object.keys(this.editFrom.controls).forEach(key => {
      const value = this.editFrom.get(key)?.value;
      if (value !== null && value !== '') {
        switch (key) {
          case 'firstName': userData.Nombres = value; break;
          case 'lastName': userData.Apellidos = value; break;
          case 'documentNumber': userData.NumeroIdentificacionUsuarios = value; break;
          case 'phone': userData.Telefono = Number(value); break;
          case 'email': userData.Email = value; break;
          case 'password': userData.Password = value; break;
        }
      }
    });

    if (this.userImage) {
      userData.Imagen = this.userImage;
    }

    this.apiService.put(`usuarios/${this.userId}`, userData).subscribe({
      next: (res: any) => {
        const data = res.Data;
        if (data) {
          localStorage.setItem('usuario', JSON.stringify(data));
          this.alertsComp.showAlert('✅ Perfil actualizado con éxito', 'success', 2000);
          this.refreshUsuario.emit();
        }
      },
      error: (err) => {
        console.error('Error en la actualización:', err);
        this.alertsComp.showAlert('❌ Hubo un error al actualizar los datos', 'error', 3000);
      }
    });
  }

  ngOnInit(): void {
    const user = this.authService.getUsuarioActual();
    if (user && user.Id) {
      this.userId = user.Id;
      console.log('ID del usuario:', this.userId);
    } else {
      console.error('No se pudo obtener el ID del usuario');
      this.alertsComp.showAlert('❌ Error: inicia sesión nuevamente', 'warning', 3000, () => {
        this.router.navigate(['/login']);
      });
    }
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      const maxSize = 2 * 1024 * 1024;

      if (!validTypes.includes(file.type)) {
        this.alertsComp.showAlert('⚠️ Formato de imagen no permitido', 'warning');
        return;
      }

      if (file.size > maxSize) {
        this.alertsComp.showAlert('⚠️ La imagen excede el tamaño permitido (2MB)', 'warning');
        return;
      }

      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        this.previewUrl = base64;
        this.userImage = base64.split(',')[1];
      };
      reader.readAsDataURL(file);
    }
  }
}
