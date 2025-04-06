import { Cliente } from '../clients/client.models';

export interface Agendamento {
  id?: number;
  cliente?: Cliente;
  dataHora?: string;
  servico?: string;
}

export interface AgendamentoParaEnvio {
  cliente: { id: number };
  dataHora: string;
  servico: string;
}