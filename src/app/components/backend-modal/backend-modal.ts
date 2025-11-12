// SUBSTITUA SEU backend-modal.ts ATUAL POR ESTA VERSÃO

import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Backend } from '../../models/backend.model';
import { BackendService } from '../../services/backend';

@Component({
  selector: 'app-backend-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './backend-modal.html',
  styleUrls: ['./backend-modal.css']
})
export class BackendModalComponent implements OnInit, OnChanges {
  @Input() backend: Backend | null = null;
  @Input() mode: 'view' | 'create' | 'edit' = 'view';
  @Output() onClose = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<Backend>();
  @Output() onEdit = new EventEmitter<void>();
  @Output() onDelete = new EventEmitter<Backend>();
  
  // === FORMULÁRIO ===
  backendForm!: FormGroup;
  isSubmitting: boolean = false;
  
  // === TESTE DE CONEXÃO ===
  isTestingConnection: boolean = false;
  isDeleting: boolean = false;
  connectionResult: { success: boolean; message: string; responseTime?: number } | null = null;
  
  // === TAGS E FEATURES ===
  newTag: string = '';
  newFeature: string = '';

  constructor(
    private fb: FormBuilder,
    private backendService: BackendService
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.setupForm();
  }

  ngOnChanges() {
    this.setupForm();
    this.connectionResult = null; // Reset connection result when backend changes
  }

  createForm() {
    this.backendForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      version: ['', [Validators.required, Validators.pattern(/^v?\d+\.\d+\.\d+$/)]],
      environment: ['Production', Validators.required],
      status: ['Healthy', Validators.required],
      uptime: ['99.9%', [Validators.required, Validators.pattern(/^\d+(\.\d+)?%$/)]],
      apis: [1, [Validators.required, Validators.min(1)]],
      tags: this.fb.array([]),
      features: this.fb.array([])
    });
  }

  setupForm() {
    if (this.backend && (this.mode === 'edit' || this.mode === 'view')) {
      this.backendForm.patchValue({
        name: this.backend.name,
        description: this.backend.description,
        version: this.backend.version,
        environment: this.backend.environment,
        status: this.backend.status,
        uptime: this.backend.uptime,
        apis: this.backend.apis
      });

      // Setup tags
      const tagsArray = this.backendForm.get('tags') as FormArray;
      tagsArray.clear();
      this.backend.tags.forEach(tag => {
        tagsArray.push(this.fb.control(tag, Validators.required));
      });

      // Setup features
      const featuresArray = this.backendForm.get('features') as FormArray;
      featuresArray.clear();
      this.backend.features.forEach(feature => {
        featuresArray.push(this.fb.control(feature, Validators.required));
      });
    } else if (this.mode === 'create') {
      this.backendForm.reset({
        name: '',
        description: '',
        version: 'v1.0.0',
        environment: 'Development',
        status: 'Healthy',
        uptime: '99.9%',
        apis: 1
      });
      (this.backendForm.get('tags') as FormArray).clear();
      (this.backendForm.get('features') as FormArray).clear();
    }

    // Disable form in view mode
    if (this.mode === 'view') {
      this.backendForm.disable();
    } else {
      this.backendForm.enable();
    }
  }

  // === GETTERS PARA FORM ARRAYS ===
  get tagsArray(): FormArray {
    return this.backendForm.get('tags') as FormArray;
  }

  get featuresArray(): FormArray {
    return this.backendForm.get('features') as FormArray;
  }

  // === GERENCIAMENTO DE TAGS ===
  addTag() {
    if (this.newTag && this.newTag.trim()) {
      const tagControl = this.fb.control(this.newTag.trim(), Validators.required);
      this.tagsArray.push(tagControl);
      this.newTag = '';
    }
  }

  removeTag(index: number) {
    this.tagsArray.removeAt(index);
  }

  onTagKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addTag();
    }
  }

  // === GERENCIAMENTO DE FEATURES ===
  addFeature() {
    if (this.newFeature && this.newFeature.trim()) {
      const featureControl = this.fb.control(this.newFeature.trim(), Validators.required);
      this.featuresArray.push(featureControl);
      this.newFeature = '';
    }
  }

  removeFeature(index: number) {
    this.featuresArray.removeAt(index);
  }

  onFeatureKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addFeature();
    }
  }

  // === TESTE DE CONEXÃO ===
  async testConnection() {
    if (!this.backend && this.mode === 'view') return;

    this.isTestingConnection = true;
    this.connectionResult = null;

    // Para modo view, usa o backend atual
    // Para modo edit/create, cria um backend temporário com os dados do form
    const backendToTest = this.mode === 'view' && this.backend ? 
      this.backend : 
      this.createBackendFromForm();

    try {
      this.backendService.testConnection(backendToTest).subscribe({
        next: (result) => {
          this.connectionResult = result;
          this.isTestingConnection = false;
        },
        error: (error) => {
          this.connectionResult = {
            success: false,
            message: 'Erro ao testar conexão: ' + error.message
          };
          this.isTestingConnection = false;
        }
      });
    } catch (error) {
      this.connectionResult = {
        success: false,
        message: 'Erro inesperado ao testar conexão'
      };
      this.isTestingConnection = false;
    }
  }

  createBackendFromForm(): Backend {
    const formValue = this.backendForm.value;
    return {
      id: this.backend?.id || 'temp-id',
      name: formValue.name,
      description: formValue.description,
      version: formValue.version,
      environment: formValue.environment,
      status: formValue.status,
      uptime: formValue.uptime,
      apis: formValue.apis,
      tags: formValue.tags || [],
      features: formValue.features || [],
      lastUpdate: new Date()
    };
  }

  // === AÇÕES DO MODAL ===
  close() {
    this.onClose.emit();
  }

  edit() {
    this.onEdit.emit();
  }

  save() {
    if (this.backendForm.valid) {
      this.isSubmitting = true;
      const backendData = this.createBackendFromForm();
      
      setTimeout(() => {
        this.onSave.emit(backendData);
        this.isSubmitting = false;
      }, 500); // Simular delay de salvamento
    } else {
      this.markFormGroupTouched();
    }
  }

  deleteBackend() {
    if (!this.backend) return;
    
    const confirmMessage = `Tem certeza que deseja excluir o backend "${this.backend.name}"?\n\nEsta ação não pode ser desfeita.`;
    
    if (confirm(confirmMessage)) {
      this.isDeleting = true;
      
      // Simular delay de exclusão para UX
      setTimeout(() => {
        if (this.backend) {
          this.onDelete.emit(this.backend);
        }
        this.isDeleting = false;
      }, 800);
    }
  }

  markFormGroupTouched() {
    Object.keys(this.backendForm.controls).forEach(key => {
      const control = this.backendForm.get(key);
      control?.markAsTouched();
    });
  }

  // === MÉTODOS AUXILIARES ORIGINAIS ===
  getStatusClass(): string {
    const status = this.backend?.status || this.backendForm.get('status')?.value;
    switch (status) {
      case 'Healthy':
        return 'status-healthy';
      case 'Warning':
        return 'status-warning';
      case 'Error':
        return 'status-error';
      default:
        return 'status-offline';
    }
  }

  getEnvironmentClass(): string {
    const environment = this.backend?.environment || this.backendForm.get('environment')?.value;
    switch (environment) {
      case 'Production':
        return 'production';
      case 'Staging':
        return 'staging';
      case 'Development':
        return 'development';
      default:
        return 'development';
    }
  }

  getFeatures(): string[] {
    if (this.mode === 'view' && this.backend) {
      return this.backend.features || [];
    }
    return this.featuresArray?.value || [];
  }

  getTags(): string[] {
    if (this.mode === 'view' && this.backend) {
      return this.backend.tags || [];
    }
    return this.tagsArray?.value || [];
  }

  getUptimeClass(): string {
    const uptime = this.backend?.uptime || this.backendForm.get('uptime')?.value || '0%';
    const uptimeValue = parseFloat(uptime.replace('%', ''));
    
    if (uptimeValue >= 99) return 'uptime-excellent';
    if (uptimeValue >= 95) return 'uptime-good';
    if (uptimeValue >= 90) return 'uptime-warning';
    return 'uptime-critical';
  }

  // === VALIDAÇÃO HELPERS ===
  isFieldInvalid(fieldName: string): boolean {
    const field = this.backendForm?.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }

  getFieldError(fieldName: string): string {
    const field = this.backendForm?.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) return `${this.getFieldLabel(fieldName)} é obrigatório`;
      if (field.errors['minlength']) return `${fieldName} deve ter pelo menos ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['pattern']) return `Formato de ${fieldName} inválido`;
      if (field.errors['min']) return `${fieldName} deve ser maior que ${field.errors['min'].min}`;
    }
    return '';
  }

  // === GETTERS PARA TEMPLATE ===
  get modalTitle(): string {
    switch (this.mode) {
      case 'create':
        return 'Novo Backend';
      case 'edit':
        return `Editar ${this.backend?.name || 'Backend'}`;
      default:
        return this.backend?.name || 'Backend';
    }
  }

  get isViewMode(): boolean {
    return this.mode === 'view';
  }

  get isEditMode(): boolean {
    return this.mode === 'edit';
  }

  get isCreateMode(): boolean {
    return this.mode === 'create';
  }
  trackByIndex(index: number, item: any): number {
    return index;
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      'name': 'Nome',
      'description': 'Descrição', 
      'version': 'Versão',
      'uptime': 'Uptime',
      'apis': 'Número de APIs'
    };
    return labels[fieldName] || fieldName;
  }
}
