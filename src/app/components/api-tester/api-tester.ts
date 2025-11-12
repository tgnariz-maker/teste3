import { Component, Output, EventEmitter, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BackendService } from '../../services/backend';

@Component({
  selector: 'app-api-tester',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './api-tester.html',
  styleUrls: ['./api-tester.css']
})
export class ApiTesterComponent implements OnInit, OnDestroy {
  @Output() onClose = new EventEmitter<void>();

  private backendService = inject(BackendService);

  // Request Configuration
  requestTitle = 'Solicitação sem título';
  selectedCollection = '';
  requestMethod = 'GET';
  requestUrl = '';
  requestTimeout = 30000;
  followRedirects = true;
  verifySsl = true;

  // Collections
  collections = [
    { id: '1', name: 'SEFAZ APIs' },
    { id: '2', name: 'Testes Locais' }
  ];

  // Tabs
  activeTab = 'params';
  activeResponseTab = 'body';
  responseFormat = 'pretty';

  // Parameters
  queryParams: { key: string; value: string }[] = [];
  pathVariables: { key: string; value: string }[] = [];
  headers: { key: string; value: string }[] = [];
  formData: { key: string; value: string }[] = [];

  // Authentication
  authType = 'none';
  bearerToken = '';
  basicAuth = { username: '', password: '' };
  apiKey = { key: '', value: '', location: 'header' };

  // Body
  bodyType = 'none';
  requestBody = '';

  // Response
  response: any = null;
  isLoading = false;

  // Lifecycle hooks para prevenir scroll
  ngOnInit() {
    // Prevenir scroll da página principal
    document.body.style.overflow = 'hidden';
  }

  ngOnDestroy() {
    // Restaurar scroll da página principal
    document.body.style.overflow = 'auto';
  }

  // Methods for tabs
  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  setActiveResponseTab(tab: string) {
    this.activeResponseTab = tab;
  }

  setResponseFormat(format: string) {
    this.responseFormat = format;
  }

  // Parameter methods
  addQueryParam() {
    this.queryParams.push({ key: '', value: '' });
  }

  removeQueryParam(index: number) {
    this.queryParams.splice(index, 1);
  }

  addPathVariable() {
    this.pathVariables.push({ key: '', value: '' });
  }

  removePathVariable(index: number) {
    this.pathVariables.splice(index, 1);
  }

  addHeader() {
    this.headers.push({ key: '', value: '' });
  }

  removeHeader(index: number) {
    this.headers.splice(index, 1);
  }

  addFormField() {
    this.formData.push({ key: '', value: '' });
  }

  removeFormField(index: number) {
    this.formData.splice(index, 1);
  }

  // Action methods
  createNewCollection() {
    console.log('Criar nova coleção');
  }

  showHistory() {
    console.log('Mostrar histórico');
  }

  exportData() {
    console.log('Exportar dados');
  }

  openSettings() {
    console.log('Abrir configurações');
  }

  goBack() {
    // Restaurar scroll antes de fechar
    document.body.style.overflow = 'auto';
    this.close();
  }

  close() {
    // Restaurar scroll antes de fechar
    document.body.style.overflow = 'auto';
    this.onClose.emit();
  }

  // Request methods
  sendRequest() {
    this.isLoading = true;
    
    // Simular resposta da API
    setTimeout(() => {
      this.response = {
        status: 200,
        statusText: 'OK',
        time: Math.floor(Math.random() * 1000) + 100,
        size: Math.floor(Math.random() * 5000) + 1000,
        headers: {
          'Content-Type': 'application/json',
          'Date': new Date().toISOString(),
          'Server': 'SEFAZ-SE/1.0'
        },
        body: {
          success: true,
          message: 'Resposta simulada da API SEFAZ Sergipe',
          timestamp: new Date().toISOString(),
          data: {
            contribuinte: {
              cnpj: '12.345.678/0001-90',
              razaoSocial: 'Empresa Exemplo LTDA',
              situacao: 'Ativa'
            },
            tributos: [
              { codigo: 'ICMS', valor: 1250.50 },
              { codigo: 'ISS', valor: 350.00 }
            ]
          }
        }
      };
      this.isLoading = false;
    }, 1500);
  }

  // Response utility methods
  getStatusClass(status: number): string {
    if (status >= 200 && status < 300) return 'status-2xx';
    if (status >= 300 && status < 400) return 'status-3xx';
    if (status >= 400 && status < 500) return 'status-4xx';
    if (status >= 500) return 'status-5xx';
    return 'status-unknown';
  }

  formatSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  formatResponseBody(): string {
    if (!this.response?.body) return '';
    
    try {
      if (this.responseFormat === 'pretty') {
        return JSON.stringify(this.response.body, null, 2);
      } else {
        return JSON.stringify(this.response.body);
      }
    } catch (e) {
      return String(this.response.body);
    }
  }

  copyResponse() {
    if (this.response?.body) {
      navigator.clipboard.writeText(this.formatResponseBody()).then(() => {
        console.log('Resposta copiada para clipboard');
      });
    }
  }
}
