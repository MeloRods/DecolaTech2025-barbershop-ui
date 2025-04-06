import { Observable } from "rxjs";
import { Cliente } from './client.models';

export interface ICLientService {

    save(request: Cliente): Observable<Cliente>

    update(id: number, request: Cliente): Observable<Cliente>

    delete(id: number): Observable<void>

    list(): Observable<Cliente[]>

    findById(id: number): Observable<Cliente>

}