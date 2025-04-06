import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClientsService } from '../../../services/api-client/clients/clients.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-client',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './new-client.component.html',
  styleUrls: ['./new-client.component.css']
})
export class NewClientComponent {
  cliente = { nome: '', email: '', telefone: '' };
  showPopup = false;
  popupMessage = '';

  constructor(
    private clientsService: ClientsService,
    private router: Router
  ) {}

  onSubmit() {
    this.clientsService.save(this.cliente).subscribe({
      next: () => {
        this.popupMessage = 'Cliente cadastrado com sucesso!';
        this.showPopup = true;
        this.cliente = { nome: '', email: '', telefone: '' };
      },
      error: () => {
        this.popupMessage = 'Erro ao cadastrar cliente';
        this.showPopup = true;
      }
    });
  }

  closePopup() {
    this.showPopup = false;
    if (this.popupMessage.includes('sucesso')) {
      this.router.navigate(['/clients/list']);
    }
  }
}