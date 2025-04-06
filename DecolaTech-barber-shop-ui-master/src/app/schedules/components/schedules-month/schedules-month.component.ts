import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SchedulesService } from '../../../services/api-client/schedules/schedules.service';
import { ClientsService } from '../../../services/api-client/clients/clients.service';

@Component({
  selector: 'app-schedules-month',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './schedules-month.component.html',
  styleUrls: ['./schedules-month.component.css']
})
export class SchedulesMonthComponent implements OnInit {
  // Definir as propriedades com tipagem básica
  agendamentos: any[] = [];
  clientes: any[] = [];
  currentDate: Date = new Date();
  diasDaSemana: any[] = [];
  horariosDisponiveis: string[] = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
  selectedDay: any = null;
  novoAgendamento: any = { clienteId: null, hora: '' };
  showSchedulePopup: boolean = false;
  showViewPopup: boolean = false;

  constructor(
    private schedulesService: SchedulesService,
    private clientsService: ClientsService
  ) {}

  ngOnInit() {
    this.carregarClientes();
    this.carregarAgendamentos();
  }

  carregarAgendamentos() {
    this.schedulesService.listInMonth().subscribe(data => {
      this.agendamentos = data || []; // Garantir que agendamentos seja sempre um array
      this.atualizarDiasDaSemana();
    });
  }

  carregarClientes() {
    this.clientsService.list().subscribe(data => {
      this.clientes = data || []; // Garantir que clientes seja sempre um array
    });
  }

  mudarSemana(direcao: number) {
    this.currentDate.setDate(this.currentDate.getDate() + (direcao * 7));
    this.currentDate = new Date(this.currentDate);
    this.atualizarDiasDaSemana();
    this.closePopup();
  }

  selecionarDia(dia: any) {
    this.selectedDay = dia;
    this.novoAgendamento = { clienteId: null, hora: '' };
    this.showSchedulePopup = true;
  }

  abrirPopupVisualizar(dia: any) {
    this.selectedDay = dia;
    this.showViewPopup = true;
  }

  getHorariosDisponiveis(): string[] {
    if (!this.selectedDay || !this.selectedDay.dataFormatada) return [];
    let agendamentosDoDia = this.agendamentos.filter((a: any) => {
      if (!a.dataHora) return false;
      let dataAgendamento = new Date(a.dataHora);
      let dataFormatada = `${dataAgendamento.getFullYear()}-${(dataAgendamento.getMonth() + 1).toString().padStart(2, '0')}-${dataAgendamento.getDate().toString().padStart(2, '0')}`;
      return dataFormatada === this.selectedDay.dataFormatada;
    });
    let horariosOcupados = agendamentosDoDia.map((a: any) => {
      if (a.dataHora) {
        return a.dataHora.split('T')[1].substring(0, 5);
      }
      return '';
    });
    return this.horariosDisponiveis.filter((horario: string) => !horariosOcupados.includes(horario));
  }

  criarAgendamento() {
    if (this.novoAgendamento.clienteId && this.novoAgendamento.hora && this.selectedDay && this.selectedDay.dataFormatada) {
      let dataHora = `${this.selectedDay.dataFormatada}T${this.novoAgendamento.hora}`;
      let agendamento = {
        cliente: { id: parseInt(this.novoAgendamento.clienteId) }, // Garantir que clienteId seja um número
        dataHora: dataHora,
        servico: "Corte de cabelo"
      };
      this.schedulesService.save(agendamento).subscribe(() => {
        this.carregarAgendamentos();
        this.closePopup();
      });
    }
  }

  deletarAgendamento(id: number) {
    if (id) {
      this.schedulesService.delete(id).subscribe(() => {
        this.carregarAgendamentos();
      });
    }
  }

  atualizarDiasDaSemana() {
    let diasSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    let startOfWeek = new Date(this.currentDate);
    startOfWeek.setDate(this.currentDate.getDate() - this.currentDate.getDay() + 1);
    this.diasDaSemana = [];

    for (let i = 0; i < 7; i++) {
      let diaSemana = new Date(startOfWeek);
      diaSemana.setDate(startOfWeek.getDate() + i);
      let dataFormatada = `${diaSemana.getFullYear()}-${(diaSemana.getMonth() + 1).toString().padStart(2, '0')}-${diaSemana.getDate().toString().padStart(2, '0')}`;
      let agendamentosDoDia = this.agendamentos.filter((a: any) => {
        if (!a.dataHora) return false;
        let dataAgendamento = new Date(a.dataHora);
        let dataAgendamentoFormatada = `${dataAgendamento.getFullYear()}-${(dataAgendamento.getMonth() + 1).toString().padStart(2, '0')}-${dataAgendamento.getDate().toString().padStart(2, '0')}`;
        return dataAgendamentoFormatada === dataFormatada;
      });
      this.diasDaSemana.push({
        dia: diaSemana.getDate(),
        nomeDia: diasSemana[diaSemana.getDay()],
        dataCompleta: `${diasSemana[diaSemana.getDay()]}, ${diaSemana.getDate().toString().padStart(2, '0')}/${(diaSemana.getMonth() + 1).toString().padStart(2, '0')}/${diaSemana.getFullYear()}`,
        dataFormatada: dataFormatada,
        agendamentos: agendamentosDoDia
      });
    }
  }

  getWeekRange(): string {
    let startOfWeek = new Date(this.currentDate);
    startOfWeek.setDate(this.currentDate.getDate() - this.currentDate.getDay() + 1);
    let endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return `${startOfWeek.getDate().toString().padStart(2, '0')}/${(startOfWeek.getMonth() + 1).toString().padStart(2, '0')}/${startOfWeek.getFullYear()} - ${endOfWeek.getDate().toString().padStart(2, '0')}/${(endOfWeek.getMonth() + 1).toString().padStart(2, '0')}/${endOfWeek.getFullYear()}`;
  }

  closePopup() {
    this.showSchedulePopup = false;
    this.showViewPopup = false;
    this.selectedDay = null;
  }
}