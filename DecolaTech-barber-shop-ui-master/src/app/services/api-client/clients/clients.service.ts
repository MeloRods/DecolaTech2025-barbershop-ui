import { Injectable } from '@angular/core';
import { ICLientService } from './iclients.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Cliente }  from './client.models';

@Injectable({
  providedIn: 'root'
})
export class ClientsService implements ICLientService {

  private basePath = 'http://localhost:8080/clientes'

  constructor(private http: HttpClient) { }

 
  save(request: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.basePath, request);
  }

  update(id: number, request: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.basePath}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.basePath}/${id}`);
  }

  list(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.basePath);
  }

  findById(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.basePath}/${id}`);
  }
}