import { Observable } from "rxjs";
import { Agendamento, AgendamentoParaEnvio } from "./schedule.models";

export interface IScheduleService {

    save(agendamento: AgendamentoParaEnvio): Observable<Agendamento>

    update(id: number, agendamento: Agendamento): Observable<Agendamento>

    delete(id: number): Observable<void>

    listInMonth(): Observable<Agendamento[]>

    findById(id: number): Observable<Agendamento>
}