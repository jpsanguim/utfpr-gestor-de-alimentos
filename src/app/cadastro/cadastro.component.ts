import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CadastroService } from './cadastro.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css'],
})
export class CadastroComponent implements OnInit, AfterViewInit {
  @ViewChild('titulo', { static: true }) titulo!: ElementRef;
  modoEdicao = false;
  descricao: string;
  quantidade: number;
  unidade: string;
  validade: string;

  constructor(private route: ActivatedRoute, public cadastroService: CadastroService) {
    this.descricao = '';
    this.quantidade = 0;
    this.unidade = '';
    this.validade = '';
  }

  ngOnInit(): void {
    const modo = this.route.snapshot.params['modo'];

    if (modo === 'editar') {
      this.modoEdicao = true;
      const itemParam = this.route.snapshot.paramMap.get('item');
      if (itemParam) {
        const item = JSON.parse(itemParam);
        this.descricao = item.descricao;
        this.quantidade = item.quantidade;
        this.unidade = item.unidade;
        this.validade = new Date(item.validade).toISOString().split('T')[0];
      }
    }
  }

  ngAfterViewInit() {
    if (this.modoEdicao) {
      this.titulo.nativeElement.classList.add('modo-edicao');
    }
    var elems = document.querySelectorAll('select');
    M.FormSelect.init(elems, {});
  }

  onButtonClick() {
    const mensagem = `Alimento cadastrado com sucesso!\n\nDescrição: ${this.descricao}\nQuantidade: ${this.quantidade}\nUnidade: ${this.unidade}\nValidade: ${this.validade}`;
    alert(mensagem);
    // Salvar no Web Storage usando o serviço
    const data = {
      descricao: this.descricao,
      quantidade: this.quantidade,
      unidade: this.unidade,
      validade: this.validade,
    };
    this.cadastroService.save(data);
  }

  onUpdateButtonClick(index: number) {
    const mensagem = `Alimento atualizado com sucesso!\n\nDescrição: ${this.descricao}\nQuantidade: ${this.quantidade}\nUnidade: ${this.unidade}\nValidade: ${this.validade}`;
    alert(mensagem);
    // Atualizar no Web Storage usando o serviço
    const data = {
      descricao: this.descricao,
      quantidade: this.quantidade,
      unidade: this.unidade,
      validade: this.validade,
    };
    this.cadastroService.update(index, data);
  }

  onDeleteButtonClick(index: number) {
    const mensagem = `Alimento excluído com sucesso!`;
    alert(mensagem);
    // Excluir do Web Storage usando o serviço
    this.cadastroService.delete(index);
  }

  onEnterKey() {
    this.onButtonClick();
  }

  onEditButtonClick(index: number) {
    const item = this.cadastroService.getAllData()[index];
    this.descricao = item.descricao;
    this.quantidade = item.quantidade;
    this.unidade = item.unidade;
    this.validade = item.validade;
    this.modoEdicao = true;
  }

}
