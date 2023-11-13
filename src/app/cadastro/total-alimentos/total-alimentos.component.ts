import { Component, OnInit } from '@angular/core';
import { CadastroPromiseService } from 'src/app/services/cadastro-promise.service';

@Component({
  selector: 'app-total-alimentos',
  template: `
    <div>
      Total de Alimentos Cadastrados: {{ totalAlimentos }}
    </div>
  `,
  styles: [
    `
      div {
        font-weight: bold;
        margin-top: 10px;
      }
    `,
  ],
})
export class TotalAlimentosComponent implements OnInit {
  totalAlimentos: number = 0;

  constructor(private cadastroPromiseService: CadastroPromiseService) {}

  ngOnInit() {
    this.cadastroPromiseService.atualizarTotalAlimentos();
    this.cadastroPromiseService.alimentos$.subscribe((alimentos) => {
      this.totalAlimentos = alimentos.length;
    });
  }
}
