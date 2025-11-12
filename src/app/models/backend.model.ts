export interface Backend {
    id: string;
    name: string;
    description: string;
    version: string;
    environment: 'Production' | 'Development' | 'Staging';
    status: 'Healthy' | 'Warning' | 'Error';
    uptime: string;
    apis: number;
    tags: string[];
    features: string[];
    lastUpdate: Date;
  }
  
  export interface ApiStats {
    totalBackends: number;
    healthyServices: number;
    totalApis: number;
    averageUptime: string;
  }
  
  export interface ApiTestRequest {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    headers?: { [key: string]: string };
    body?: any;
  }
  
  export interface ApiTestResponse {
    status: number;
    statusText: string;
    headers: { [key: string]: string };
    body: any;
    responseTime: number;
  }