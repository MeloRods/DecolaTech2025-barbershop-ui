import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClientsService } from '../../../services/api-client/clients/clients.service';
import { Cliente } from '../../../services/api-client/clients/client.models';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-clients',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './list-clients.component.html',
  styleUrls: ['./list-clients.component.css']
})
export class ListClientsComponent implements OnInit {
  clientes: Cliente[] = [];

  constructor(
    private clientsService: ClientsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarClientes();
  }

  carregarClientes(): void {
    this.clientsService.list().subscribe(data => {
      this.clientes = data;
    });
  }

  editar(id: number): void {
    this.router.navigate(['/clients/edit-client', id]);
  }

  deletar(id: number): void {
    this.clientsService.delete(id).subscribe(() => {
      this.carregarClientes();
    });
  }

  novoCliente(): void {
    this.router.navigate(['/clients/new-client']);
  }
}