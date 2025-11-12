import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Backend } from '../../models/backend.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-backend-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule
  ],
  templateUrl: './backend-card.html',
  styleUrls: ['./backend-card.css']
})
export class BackendCardComponent {
  @Input() backend!: Backend;
  @Output() onViewDetails = new EventEmitter<Backend>();

  getStatusClass(): string {
    switch (this.backend.status) {
      case 'Healthy':
        return 'status-healthy';
      case 'Warning':
        return 'status-warning';
      case 'Error':
        return 'status-error';
      default:
        return 'status-unknown';
    }
  }

  getStatusIcon(): string {
    switch (this.backend.status) {
      case 'Healthy':
        return 'check_circle';
      case 'Warning':
        return 'warning';
      case 'Error':
        return 'error';
      default:
        return 'help';
    }
  }

  viewDetails() {
    this.onViewDetails.emit(this.backend);
  }
}