import { Component, EventEmitter, Output, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.css']
})
export class ConsultaComponent {
  //Requisito da Atividade #09
  //Output responsável por enviar a descrição do item para o componente pai
  //Quando um item for editado, o título da página de cadastro irá ser alterado, informando o modo de edição
  @Output() editarItem = new EventEmitter<any>(); 
  alimentos = [
    { descricao: 'Arroz', quantidade: 1, unidade: 'kg', validade: '2023-10-30' },
    { descricao: 'Feijão', quantidade: 0.5, unidade: 'kg', validade: '2023-11-05' },
    { descricao: 'Tomate', quantidade: 1, unidade: 'kg', validade: '2023-12-07' },
    { descricao: 'Ovos', quantidade: 1, unidade: 'dz', validade: '2023-12-01' },
    { descricao: 'Maçã', quantidade: 6, unidade: 'un', validade: '2023-10-31' },
    //alimentos foram instanciados - ainda não foi implementado os métodos necessários para adicionar um alimento na lista
  ];

  constructor(private router: Router) {}

  //Método responsável em encaminhar o usuário para tela de cadastro
  novoRegistro() {
    this.router.navigate(['/cadastro/novo']);
  }

  //Requisito da Atividade #09
  //Método responsável por enviar dados entre componentes
  //As informações são recuperadas na tela de cadastro (cadastro.component.ts)
  //Faz uso de rota, e envia as informações necessárias do item em ediçao e o modo de edição
  editarRegistro(item: any) {
    this.router.navigate(['/cadastro/editar', { item: JSON.stringify(item), modo: 'editar' }]);
  }  

  //Método responsável em excluir um item da lista
  //É responsável por encontrar o o índice do item na lista e excluir
  excluirRegistro(item: any) {
    const index = this.alimentos.indexOf(item);
    if (index !== -1) {
      this.alimentos.splice(index, 1);
    }
  }
}
