    // SUBSTITUA SEU toast.component.ts POR ESTA VERSÃO SEM ANIMAÇÃO

    import { Component, OnInit, OnDestroy } from '@angular/core';
    import { CommonModule } from '@angular/common';
    import { ToastService, Toast } from '../../services/toast.service';
    import { Subscription } from 'rxjs';

    @Component({
    selector: 'app-toast',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="toast-container">
        <div 
            *ngFor="let toast of toasts; trackBy: trackById"
            class="toast"
            [ngClass]="'toast-' + toast.type">
            
            <div class="toast-icon">
            <!-- Success -->
            <svg *ngIf="toast.type === 'success'" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="20,6 9,17 4,12"></polyline>
            </svg>
            <!-- Error -->
            <svg *ngIf="toast.type === 'error'" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            <!-- Warning -->
            <svg *ngIf="toast.type === 'warning'" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <!-- Info -->
            <svg *ngIf="toast.type === 'info'" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            </div>
            
            <div class="toast-content">
            <h4 class="toast-title">{{ toast.title }}</h4>
            <p class="toast-message">{{ toast.message }}</p>
            </div>
            
            <button class="toast-close" (click)="removeToast(toast.id)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            </button>
        </div>
        </div>
    `,
    styles: [`
        .toast-container {
        position: fixed;
        top: 1rem;
        right: 1rem;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        max-width: 400px;
        }

        .toast {
        background: white;
        border-radius: 12px;
        padding: 1rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        border-left: 4px solid;
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        opacity: 0;
        animation: slideInRight 0.3s ease-out forwards;
        }

        .toast-success { border-left-color: #10b981; }
        .toast-error { border-left-color: #ef4444; }
        .toast-warning { border-left-color: #f59e0b; }
        .toast-info { border-left-color: #3b82f6; }

        .toast-icon {
        width: 1.5rem;
        height: 1.5rem;
        flex-shrink: 0;
        margin-top: 0.125rem;
        }

        .toast-success .toast-icon { color: #10b981; }
        .toast-error .toast-icon { color: #ef4444; }
        .toast-warning .toast-icon { color: #f59e0b; }
        .toast-info .toast-icon { color: #3b82f6; }

        .toast-content {
        flex: 1;
        }

        .toast-title {
        margin: 0 0 0.25rem 0;
        font-size: 0.875rem;
        font-weight: 600;
        color: #1f2937;
        }

        .toast-message {
        margin: 0;
        font-size: 0.8rem;
        color: #6b7280;
        line-height: 1.4;
        }

        .toast-close {
        background: none;
        border: none;
        color: #9ca3af;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 4px;
        width: 1.5rem;
        height: 1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
        }

        .toast-close:hover {
        color: #6b7280;
        background: #f3f4f6;
        }

        .toast-close svg {
        width: 0.875rem;
        height: 0.875rem;
        }

        @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
        }

        @media (max-width: 640px) {
        .toast-container {
            top: 0;
            left: 0;
            right: 0;
            max-width: none;
            margin: 1rem;
        }
        }
    `]
    })
    export class ToastComponent implements OnInit, OnDestroy {
    toasts: Toast[] = [];
    private subscription: Subscription = new Subscription();

    constructor(private toastService: ToastService) {}

    ngOnInit() {
        this.subscription = this.toastService.toasts$.subscribe(toasts => {
        this.toasts = toasts;
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    trackById(index: number, toast: Toast): string {
        return toast.id;
    }

    removeToast(id: string) {
        this.toastService.removeToast(id);
    }
    }