import { Injectable } from '@angular/core';
import { IScheduleService } from './ischedules.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Agendamento, AgendamentoParaEnvio } from './schedule.models';

@Injectable({
  providedIn: 'root'
})
export class SchedulesService implements IScheduleService {

  private basePath = 'http://localhost:8080/agendamentos'

  constructor(private http: HttpClient) { }

  update(id: number, agendamento: Agendamento): Observable<Agendamento> {
    return this.http.put<Agendamento>(`${this.basePath}/${id}`, agendamento);
  }
  save(agendamento: AgendamentoParaEnvio): Observable<Agendamento> {
    return this.http.post<Agendamento>(this.basePath, agendamento)
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.basePath}/${id}`)
  }
  listInMonth(): Observable<Agendamento[]> {
    return this.http.get<Agendamento[]>(this.basePath)
  }
  findById(id: number): Observable<Agendamento> {
    return this.http.get<Agendamento>(`${this.basePath}/${id}`);
  }
}
