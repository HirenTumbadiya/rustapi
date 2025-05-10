export enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    PATCH = 'PATCH',
    HEAD = 'HEAD',
    OPTIONS = 'OPTIONS',
  }
  
  export interface ApiRequest {
    url: string;
    method: HttpMethod;
    headers: Record<string, string>;
    params: Record<string, string>;
    body?: any;
    timeout_ms?: number;
  }
  
  export interface ApiResponse {
    status: number;
    headers: Record<string, string>;
    body?: any;
    duration_ms: number;
    size_bytes: number;
  }
  
  export interface RequestCollection {
    id: string;
    name: string;
    requests: SavedRequest[];
  }
  
  export interface SavedRequest {
    id: string;
    name: string;
    request: ApiRequest;
  }
  
  export interface Environment {
    id: string;
    name: string;
    variables: Record<string, string>;
  }