import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css'],
})
export class CadastroComponent implements OnInit, AfterViewInit {
  descricao: string;
  quantidade: number;
  unidade: string;
  validade: Date | undefined;

  constructor() {
    this.descricao = '';
    this.quantidade = 0;
    this.unidade = '';
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    var elems = document.querySelectorAll('select');
    M.FormSelect.init(elems, {});
  }

  onButtonClick() {
    const mensagem = `Alimento cadastrado com sucesso!\n\nDescrição: ${this.descricao}\nQuantidade: ${this.quantidade}\nUnidade: ${this.unidade}\nValidade: ${this.validade}`;
    alert(mensagem);
  }

  onEnterKey() {
    this.onButtonClick();
  }
}
