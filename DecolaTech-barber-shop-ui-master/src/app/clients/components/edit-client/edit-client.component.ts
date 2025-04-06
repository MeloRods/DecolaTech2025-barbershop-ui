import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientsService } from '../../../services/api-client/clients/clients.service';
import { Cliente } from '../../../services/api-client/clients/client.models';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-client',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-client.component.html',
  styleUrls: ['./edit-client.component.css']
})
export class EditClientComponent implements OnInit {
  cliente: Cliente = { nome: '', email: '', telefone: '' };
  id: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientsService: ClientsService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.clientsService.findById(Number(this.id)).subscribe(data => {
        this.cliente = data;
      });
    }
  }

  onSubmit(): void {
    if (this.id) {
      this.clientsService.update(Number(this.id), this.cliente).subscribe(() => {
        this.router.navigate(['/clients/list']);
      });
    }
  }
}