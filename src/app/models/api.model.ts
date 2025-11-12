export interface ApiRequest {
    id?: string;
    title: string;
    method: HttpMethod;
    url: string;
    headers: KeyValue[];
    queryParams: KeyValue[];
    pathVariables: KeyValue[];
    body?: string;
    bodyType: BodyType;
    formData: KeyValue[];
    auth: AuthConfig;
    config: RequestConfig;
    collectionId?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface ApiResponse {
    status: number;
    statusText: string;
    headers: { [key: string]: string };
    body: any;
    time: number;
    size: number;
    timestamp: Date;
  }
  
  export interface KeyValue {
    key: string;
    value: string;
    enabled?: boolean;
  }
  
  export interface AuthConfig {
    type: AuthType;
    bearerToken?: string;
    basicAuth?: {
      username: string;
      password: string;
    };
    apiKey?: {
      key: string;
      value: string;
      location: 'header' | 'query';
    };
  }
  
  export interface RequestConfig {
    timeout: number;
    followRedirects: boolean;
    verifySsl: boolean;
  }
  
  export interface Collection {
    id: string;
    name: string;
    description?: string;
    requests: string[]; // IDs dos requests
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface RequestHistory {
    id: string;
    request: ApiRequest;
    response: ApiResponse;
    timestamp: Date;
  }
  
  export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
  
  export type AuthType = 'none' | 'bearer' | 'basic' | 'api-key';
  
  export type BodyType = 'none' | 'json' | 'xml' | 'form' | 'raw';
  
  export type TabType = 'params' | 'auth' | 'headers' | 'body' | 'config';
  
  export type ResponseTabType = 'body' | 'headers';
  
  export type ResponseFormat = 'pretty' | 'raw';