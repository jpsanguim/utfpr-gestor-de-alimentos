import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css'],
})
export class CadastroComponent implements OnInit, AfterViewInit {
  //Requisito da Atividade #09 - Variável de template e anotação ViewChild para título da página de Cadastro
  @ViewChild('titulo', { static: true }) titulo!: ElementRef;
  //Variável para controle do modo de edição
  modoEdicao = false;
  descricao: string;
  quantidade: number;
  unidade: string;
  validade: string;

  constructor(private route: ActivatedRoute) {
    this.descricao = '';
    this.quantidade = 0;
    this.unidade = '';
    this.validade = '';
  }

  //Requisito da Atividade #09
  //Método responsável por receber dados entre componentes (enviado através do consulta.component.ts)
  ngOnInit(): void {
    const modo = this.route.snapshot.params['modo'];

    if (modo === 'editar') {
      //Se o modo for editar, então o modoEdicao será true
      //O título da página será alterado para replicar esse modo
      this.modoEdicao = true;
      const itemParam = this.route.snapshot.paramMap.get('item');
      if (itemParam) {
        //Se o itemParam for diferente de null, então o item será recuperado
        const item = JSON.parse(itemParam);
        this.descricao = item.descricao;
        this.quantidade = item.quantidade;
        this.unidade = item.unidade;
        this.validade = new Date(item.validade).toISOString().split('T')[0];
      }
    }
  }

  //Requisito da Atividade #09 - Variável de template e anotação ViewChild para título da página de Cadastro
  ngAfterViewInit() {
    //Se o modo for edição, então o título da página será alterado
    if (this.modoEdicao) {
      this.titulo.nativeElement.classList.add('modo-edicao');
    }
    //Inicialização do componente de seleção de unidade
    var elems = document.querySelectorAll('select');
    M.FormSelect.init(elems, {});
  }

  onButtonClick() {
    //Método responsável por exibir uma mensagem de sucesso após cadastro do alimento
    //O cadastro ainda não é replicado na tela de consulta
    const mensagem = `Alimento cadastrado com sucesso!\n\nDescrição: ${this.descricao}\nQuantidade: ${this.quantidade}\nUnidade: ${this.unidade}\nValidade: ${this.validade}`;
    alert(mensagem);
  }

  onEnterKey() {
    this.onButtonClick();
  }
}
