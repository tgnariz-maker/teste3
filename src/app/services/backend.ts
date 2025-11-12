// SUBSTITUA SEU backend.ts ATUAL POR ESTA VERSÃO COMPLETA

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Backend, ApiStats } from '../models/backend.model';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  private apiUrl = 'https://api.sefaz.se.gov.br/v1';
  private backendsSubject = new BehaviorSubject<Backend[]>([]);
  public backends$ = this.backendsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadMockData();
  }

  // ========== SEUS MÉTODOS ORIGINAIS (mantidos) ==========

  private loadMockData() {
    const mockBackends: Backend[] = [
      {
        id: '1',
        name: 'Auth Service',
        description: 'Serviço de autenticação e autorização',
        version: 'v2.1.0',
        environment: 'Production',
        status: 'Healthy',
        uptime: '99.9%',
        apis: 8,
        tags: ['Auth', 'Security', 'Microservice'],
        features: [
          'Cadastro de Usuários: Gerenciamento de contas, perfis e permissões de acesso.',
          'Autenticação e Autorização: Controle de login, tokens de sessão e segurança.',
          'Gestão de Contratos: Criação, suporte e atualização de contratos.',
          'Agendamento de Tarefas: Organização de compromissos e papéis timbrados automaticamente.',
          'Notificações: Envio de alertas por e-mail, SMS ou push.',
          'Relatórios e Estatísticas: Gerenciamento de relatórios em tempo real com indicadores de desempenho.',
          'Atendimento ao Cliente: Cadastro e acompanhamento de clientes ou solicitações.',
          'Pagamentos e Faturação: Processamento de cobranças, emissão de bilhetes e notas fiscais.',
          'Integrações externas: Conexão com APIs e sistemas de terceiros.'
        ],
        lastUpdate: new Date()
      },
      {
        id: '2',
        name: 'Payment Gateway',
        description: 'Gateway de pagamento integrado',
        version: 'v1.8.3',
        environment: 'Production',
        status: 'Warning',
        uptime: '98.2%',
        apis: 12,
        tags: ['Payment', 'Gateway', 'External'],
        features: [
          'Processamento de Pagamentos: Aceitação de cartões de crédito, débito e carteiras digitais.',
          'Gestão de Transações: Acompanhamento em tempo real de pagamentos aprovados, pendentes ou recusados.',
          'Reembolsos e Estornos: Solicitação e acompanhamento de devoluções de valores.',
          'Relatórios Financeiros: Geração de extratos, balanços e relatórios detalhados de movimentações.',
          'Controle de Taxas: Exibição de tarifas aplicadas por tipo de transação.',
          'Integração com APIs: Suporte para integrações com e-commerce, aplicativos e ERPs.',
          'Autenticação Segura (3DS/Tokenização): Camadas extras de segurança para transações.',
          'Gestão de Disputas (Chargebacks): Abertura e acompanhamento de contestações de clientes.',
          'Suporte a Múltiplas Moedas: Processamento de pagamentos em diferentes moedas.'
        ],
        lastUpdate: new Date()
      },
      {
        id: '3',
        name: 'User Management',
        description: 'Gerenciamento de usuários e perfis',
        version: 'v3.2.1',
        environment: 'Production',
        status: 'Healthy',
        uptime: '99.5%',
        apis: 15,
        tags: ['Users', 'Profiles', 'Core'],
        features: [
          'Cadastro de Usuários: Inclusão de novos perfis no sistema.',
          'Edição de Perfis: Atualização de dados pessoais e informações de conta.',
          'Gerenciamento de Permissões: Definição de papéis e níveis de acesso.',
          'Ativação e Desativação: Controle de status de contas em uso.',
          'Recuperação de Senhas: Redefinição de credenciais de acesso.',
          'Monitoramento de Atividades: Registro e auditoria de acessos e ações.',
          'Integração com Autenticação Externa: Suporte a SSO, LDAP e OAuth.'
        ],
        lastUpdate: new Date()
      }
    ];
    
    this.backendsSubject.next(mockBackends);
  }

  getBackends(): Observable<Backend[]> {
    return this.backends$;
  }

  getBackendById(id: string): Observable<Backend | undefined> {
    return new Observable(observer => {
      const backends = this.backendsSubject.value;
      observer.next(backends.find(b => b.id === id));
      observer.complete();
    });
  }

  getStats(): Observable<ApiStats> {
    return new Observable(observer => {
      const backends = this.backendsSubject.value;
      const stats: ApiStats = {
        totalBackends: backends.length,
        healthyServices: backends.filter(b => b.status === 'Healthy').length,
        totalApis: backends.reduce((sum, b) => sum + b.apis, 0),
        averageUptime: this.calculateAverageUptime(backends)
      };
      observer.next(stats);
      observer.complete();
    });
  }

  testApi(url: string, method: string, headers: any, body: any): Observable<any> {
    const options = {
      headers: headers,
      body: method !== 'GET' ? body : undefined
    };
    
    return this.http.request(method, url, options);
  }

  // ========== NOVOS MÉTODOS CRUD ==========

  createBackend(backendData: Omit<Backend, 'id' | 'lastUpdate'>): Observable<Backend> {
    return new Observable(observer => {
      try {
        const currentBackends = this.backendsSubject.value;
        const newBackend: Backend = {
          ...backendData,
          id: this.generateId(),
          lastUpdate: new Date()
        };

        const updatedBackends = [...currentBackends, newBackend];
        this.backendsSubject.next(updatedBackends);

        observer.next(newBackend);
        observer.complete();
      } catch (error) {
        observer.error(error);
      }
    });
  }

  updateBackend(id: string, backendData: Partial<Backend>): Observable<Backend> {
    return new Observable(observer => {
      try {
        const currentBackends = this.backendsSubject.value;
        const backendIndex = currentBackends.findIndex(b => b.id === id);

        if (backendIndex === -1) {
          observer.error(new Error(`Backend com ID ${id} não encontrado`));
          return;
        }

        const updatedBackend: Backend = {
          ...currentBackends[backendIndex],
          ...backendData,
          id,
          lastUpdate: new Date()
        };

        const updatedBackends = [...currentBackends];
        updatedBackends[backendIndex] = updatedBackend;
        this.backendsSubject.next(updatedBackends);

        observer.next(updatedBackend);
        observer.complete();
      } catch (error) {
        observer.error(error);
      }
    });
  }

  deleteBackend(id: string): Observable<boolean> {
    return new Observable(observer => {
      try {
        const currentBackends = this.backendsSubject.value;
        const backendIndex = currentBackends.findIndex(b => b.id === id);

        if (backendIndex === -1) {
          observer.error(new Error(`Backend com ID ${id} não encontrado`));
          return;
        }

        const updatedBackends = currentBackends.filter(b => b.id !== id);
        this.backendsSubject.next(updatedBackends);

        observer.next(true);
        observer.complete();
      } catch (error) {
        observer.error(error);
      }
    });
  }

  testConnection(backend: Backend): Observable<{success: boolean, message: string, responseTime?: number}> {
    return new Observable(observer => {
      const startTime = Date.now();
      
      setTimeout(() => {
        const responseTime = Date.now() - startTime;
        const success = Math.random() > 0.3;
        
        if (success) {
          observer.next({
            success: true,
            message: `Conexão com ${backend.name} estabelecida com sucesso!`,
            responseTime
          });
        } else {
          observer.next({
            success: false,
            message: `Falha ao conectar com ${backend.name}. Verifique se o serviço está ativo.`,
            responseTime
          });
        }
        observer.complete();
      }, Math.random() * 2000 + 500);
    });
  }

  // ========== MÉTODOS PARA FILTROS ==========

  getEnvironments(): string[] {
    const backends = this.backendsSubject.value;
    const environments = backends.map(b => b.environment);
    return [...new Set(environments)];
  }

  getAllTags(): string[] {
    const backends = this.backendsSubject.value;
    const allTags = backends.flatMap(b => b.tags);
    return [...new Set(allTags)].sort();
  }

  getBackendsByStatus(status: Backend['status']): Backend[] {
    return this.backendsSubject.value.filter(b => b.status === status);
  }

  getBackendsByEnvironment(environment: Backend['environment']): Backend[] {
    return this.backendsSubject.value.filter(b => b.environment === environment);
  }

  // ========== MÉTODOS AUXILIARES ==========

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  private calculateAverageUptime(backends: Backend[]): string {
    if (backends.length === 0) return '0%';
    
    const totalUptime = backends.reduce((sum, backend) => {
      const uptime = parseFloat(backend.uptime.replace('%', ''));
      return sum + uptime;
    }, 0);

    const average = totalUptime / backends.length;
    return `${average.toFixed(1)}%`;
  }
}