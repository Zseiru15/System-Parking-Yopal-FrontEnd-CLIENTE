import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})
export class AlertsComponent {
  visible = false;
  message = '';
  type: 'success' | 'error' | 'warning' | 'info' = 'info';
  private timeoutId: any;

  showAlert(
    message: string,
    type: 'success' | 'error' | 'warning' | 'info' = 'info',
    duration: number = 3000,
    callback?: () => void
  ) {
    this.message = message;
    this.type = type;
    this.visible = true;

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(() => {
      this.close();
      if (callback) callback();
    }, duration);
  }

  close() {
    this.visible = false;
    this.message = '';
  }

  getIcon(): string {
    switch (this.type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '🔔';
    }
  }
}
