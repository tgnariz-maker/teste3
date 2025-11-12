// dashboard.ts CORRIGIDO
import { ToastService } from '../../services/toast.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Backend, ApiStats } from '../../models/backend.model';
import { BackendService } from '../../services/backend';
import { BackendCardComponent } from '../backend-card/backend-card';
import { BackendModalComponent } from '../backend-modal/backend-modal';
import { ApiTesterComponent } from '../api-tester/api-tester';
import { ToastComponent } from '../toast/toast.component'; // ← ADICIONE ESTA LINHA

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BackendCardComponent,
    BackendModalComponent,
    ApiTesterComponent,
    ToastComponent // ← ADICIONE ESTA LINHA
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  backends: Backend[] = [];
  stats: ApiStats | null = null;
  searchTerm: string = '';
  selectedBackend: Backend | null = null;
  showModal: boolean = false;
  showApiTester: boolean = false;
  loading: boolean = true;
  
  // === NOVOS FILTROS ===
  selectedFilter: string = 'all';
  selectedEnvironment: string = 'all';
  selectedTag: string = 'all';
  showFilters: boolean = false;
  availableEnvironments: string[] = [];
  availableTags: string[] = [];
  
  // === MODO DO MODAL ===
  modalMode: 'view' | 'create' | 'edit' = 'view';

  constructor(private backendService: BackendService, 
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadData();
    this.loadFilterOptions();
  }

  loadData() {
    this.loading = true;
    
    this.backendService.getBackends().subscribe({
      next: (backends: Backend[]) => {
        this.backends = backends;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Erro ao carregar backends:', error);
        this.loading = false;
      }
    });

    this.backendService.getStats().subscribe({
      next: (stats: ApiStats) => {
        this.stats = stats;
      },
      error: (error: any) => {
        console.error('Erro ao carregar estatísticas:', error);
      }
    });
  }

  // === CARREGA OPÇÕES PARA FILTROS ===
  loadFilterOptions() {
    this.availableEnvironments = this.backendService.getEnvironments();
    this.availableTags = this.backendService.getAllTags();
  }

  // === SISTEMA DE FILTROS MELHORADO ===
  get filteredBackends(): Backend[] {
    let filtered = this.backends;

    // Filtro por status
    if (this.selectedFilter !== 'all') {
      filtered = filtered.filter(backend => backend.status === this.selectedFilter);
    }

    // Filtro por ambiente
    if (this.selectedEnvironment !== 'all') {
      filtered = filtered.filter(backend => backend.environment === this.selectedEnvironment);
    }

    // Filtro por tag
    if (this.selectedTag !== 'all') {
      filtered = filtered.filter(backend => 
        backend.tags.includes(this.selectedTag)
      );
    }

    // Filtro por termo de busca
    if (this.searchTerm) {
      filtered = filtered.filter(backend => 
        backend.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        backend.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        backend.tags.some(tag => tag.toLowerCase().includes(this.searchTerm.toLowerCase()))
      );
    }

    return filtered;
  }

  // === MÉTODOS DE FILTROS ===
  setFilter(filter: string) {
    this.selectedFilter = filter;
  }

  setEnvironmentFilter(environment: string) {
    this.selectedEnvironment = environment;
  }

  setTagFilter(tag: string) {
    this.selectedTag = tag;
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  clearFilters() {
    this.selectedFilter = 'all';
    this.selectedEnvironment = 'all';
    this.selectedTag = 'all';
    this.searchTerm = '';
  }

  // === MÉTODOS DE MODAL ===
  openBackendDetails(backend: Backend) {
    this.selectedBackend = backend;
    this.modalMode = 'view';
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedBackend = null;
    this.modalMode = 'view';
  }

  // === NOVO BACKEND ===
  addNewBackend() {
    this.selectedBackend = null;
    this.modalMode = 'create';
    this.showModal = true;
  }

  // === CALLBACK DO MODAL PARA SALVAR - ATUALIZADO COM TOAST ===
  onBackendSaved(backend: Backend) {
    if (this.modalMode === 'create') {
      this.backendService.createBackend({
        name: backend.name,
        description: backend.description,
        version: backend.version,
        environment: backend.environment,
        status: backend.status,
        uptime: backend.uptime,
        apis: backend.apis,
        tags: backend.tags,
        features: backend.features
      }).subscribe({
        next: (newBackend) => {
          this.toastService.showSuccess(
            'Backend Criado',
            `"${newBackend.name}" foi criado com sucesso!`
          );
          this.loadData();
          this.loadFilterOptions();
          this.closeModal();
        },
        error: (error) => {
          this.toastService.showError(
            'Erro ao Criar',
            'Não foi possível criar o backend. Tente novamente.'
          );
          console.error('Erro ao criar backend:', error);
        }
      });
    } else if (this.modalMode === 'edit' && this.selectedBackend) {
      this.backendService.updateBackend(this.selectedBackend.id, {
        name: backend.name,
        description: backend.description,
        version: backend.version,
        environment: backend.environment,
        status: backend.status,
        uptime: backend.uptime,
        apis: backend.apis,
        tags: backend.tags,
        features: backend.features
      }).subscribe({
        next: (updatedBackend) => {
          this.toastService.showSuccess(
            'Backend Atualizado',
            `"${updatedBackend.name}" foi atualizado com sucesso!`
          );
          this.loadData();
          this.loadFilterOptions();
          this.closeModal();
        },
        error: (error) => {
          this.toastService.showError(
            'Erro ao Atualizar',
            'Não foi possível atualizar o backend. Tente novamente.'
          );
          console.error('Erro ao atualizar backend:', error);
        }
      });
    }
  }
  
  // === CALLBACK DO MODAL PARA DELETE - ATUALIZADO COM TOAST ===
  onBackendDeleted(backend: Backend) {
    this.backendService.deleteBackend(backend.id).subscribe({
      next: (success) => {
        if (success) {
          this.toastService.showSuccess(
            'Backend Excluído',
            `"${backend.name}" foi excluído com sucesso.`
          );
          this.loadData();
          this.loadFilterOptions();
          this.closeModal();
        }
      },
      error: (error) => {
        this.toastService.showError(
          'Erro ao Excluir',
          'Não foi possível excluir o backend. Tente novamente.'
        );
        console.error('Erro ao excluir backend:', error);
      }
    });
  }

  // === API TESTER ===
  openApiTester() {
    this.showApiTester = true;
  }

  closeApiTester() {
    this.showApiTester = false;
  }

  // === UTILITÁRIOS ===
  refreshData() {
    this.loadData();
    this.loadFilterOptions();
  }

  // === CONTADORES PARA FILTROS ===
  getStatusCount(status: string): number {
    return this.backends.filter(b => b.status === status).length;
  }

  getEnvironmentCount(environment: string): number {
    return this.backends.filter(b => b.environment === environment).length;
  }

  getTagCount(tag: string): number {
    return this.backends.filter(b => b.tags.includes(tag)).length;
  }
}