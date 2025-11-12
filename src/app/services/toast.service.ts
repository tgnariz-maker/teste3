import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.toastsSubject.asObservable();

  showSuccess(title: string, message: string, duration = 4000) {
    this.addToast('success', title, message, duration);
  }

  showError(title: string, message: string, duration = 6000) {
    this.addToast('error', title, message, duration);
  }

  showWarning(title: string, message: string, duration = 5000) {
    this.addToast('warning', title, message, duration);
  }

  showInfo(title: string, message: string, duration = 4000) {
    this.addToast('info', title, message, duration);
  }

  private addToast(type: Toast['type'], title: string, message: string, duration: number) {
    const toast: Toast = {
      id: Date.now().toString(),
      type,
      title,
      message,
      duration
    };

    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next([...currentToasts, toast]);

    // Auto remove toast
    setTimeout(() => {
      this.removeToast(toast.id);
    }, duration);
  }

  removeToast(id: string) {
    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next(currentToasts.filter(t => t.id !== id));
  }
}