import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CadastroService } from './cadastro.service';
import { CompartilhamentoDadosService } from './../services/compartilhamento-dados.service';
import { CadastroPromiseService } from './../services/cadastro-promise.service';
import { Alimento } from './../model/alimento';
import { lastValueFrom } from 'rxjs';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css'],
  providers: [CadastroPromiseService],
})
export class CadastroComponent implements OnInit, AfterViewInit {
  @ViewChild('titulo', { static: true }) titulo!: ElementRef;
  modoEdicao = false;
  descricao: string;
  quantidade: number;
  unidade: string;
  validade: string;
  id: number;
  alimentos$!: Observable<Alimento[]>;
  alimentosLocais$: Observable<any[]> = new Observable<any[]>();

  
  constructor(
    private route: ActivatedRoute,
    public cadastroService: CadastroService,
    private compartilhamentoDadosService: CompartilhamentoDadosService,
    public cadastroPromiseService: CadastroPromiseService
  ) {
    this.descricao = '';
    this.quantidade = 0;
    this.unidade = '';
    this.validade = '';
    this.id = -1;
  }

  ngOnInit(): void {
    this.alimentosLocais$ = new Observable<any[]>(observer => {
      const alimentosLocais = this.cadastroService.getAllData();
      observer.next(alimentosLocais);
      observer.complete();
    });
    this.alimentos$ = this.cadastroPromiseService.getAll();

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

    this.cadastroService.alimentos$.subscribe((alimentos) => {
      this.compartilhamentoDadosService.atualizarAlimentos(alimentos);
      this.atualizarTabela();

    });
  }

  ngAfterViewInit() {
    if (this.modoEdicao) {
      this.titulo.nativeElement.classList.add('modo-edicao');
    }
    var elems = document.querySelectorAll('select');
    M.FormSelect.init(elems, {});
  }

  async onButtonClick() {
    if (this.modoEdicao) {
        // Se estiver no modo de edição, é chamado o método de atualização
        // Obtendo o id do item em edição
        const id = this.idItemEmEdicao();
        if (id !== -1) {
            await this.onUpdateButtonClick(id);
        } else {
            console.error('ID do item em edição não encontrado.');
        }
    } else {
        // Se não estiver no modo de edição, continua com o comportamento de salvar um novo item
        const alimento: Alimento = {
            descricao: this.descricao,
            quantidade: this.quantidade,
            unidade: this.unidade,
            validade: this.validade,
        };

        try {
            await lastValueFrom(this.cadastroPromiseService.save(alimento));
            const mensagem = `Alimento cadastrado com sucesso!\n\nDescrição: ${this.descricao}\nQuantidade: ${this.quantidade}\nUnidade: ${this.unidade}\nValidade: ${this.validade}`;
            alert(mensagem);
        } catch (error) {
            console.error(error);
            alert(`Erro ao cadastrar alimento: ${error}`);
        }
    }
}

// Função auxiliar para encontrar o id do item em edição
private idItemEmEdicao(): number {
    return this.id;
}

onUpdateButtonClick(id: number) {
  console.log('id:', id);
  console.log('Valores atuais:', this.descricao, this.quantidade, this.unidade, this.validade);

  const mensagem = `Alimento atualizado com sucesso!\n\nDescrição: ${this.descricao}\nQuantidade: ${this.quantidade}\nUnidade: ${this.unidade}\nValidade: ${this.validade}`;
  alert(mensagem);

  // Obter a lista atualizada de alimentos
  this.cadastroPromiseService.getAll().subscribe(alimentos => {
    // Verifique se alimentos é uma array antes de acessá-lo
    if (Array.isArray(alimentos)) {
      // Atualizar os dados do item original com os novos dados
      alimentos[id].descricao = this.descricao;
      alimentos[id].quantidade = this.quantidade;
      alimentos[id].unidade = this.unidade;
      alimentos[id].validade = this.validade;

      // Atualizar no Web Storage
      this.cadastroPromiseService.patch(Object.values(alimentos));
      console.log('Alimentos atualizados:', alimentos);

      // Limpar os campos do formulário e sair do modo de edição
      this.limparForm();
    } else {
      console.error('Erro: Os alimentos não são um array.');
    }
  });
}

  onDeleteButtonClick(id: number) {
    console.log('Chamando onDeleteButtonClick para o id:', id);
  
    const mensagem = `Alimento excluído com sucesso!`;
    alert(mensagem);
  
    // Excluir do Web Storage usando o serviço
    this.cadastroPromiseService.delete(id);
  } 

  onEnterKey() {
    this.onButtonClick();
  }

  onEditButtonClick(id: number) {
    // Use this.cadastroPromiseService em vez de this.cadastroService
    const alimentos$ = this.cadastroPromiseService.getAll();
  
    // Transforme o Observable em uma Promise para aguardar os dados
    lastValueFrom(alimentos$).then(alimentos => {
      const item = alimentos.find(alimento => alimento.id === id);

  if (item) {
    this.id = id;
    this.descricao = item.descricao;
    this.quantidade = item.quantidade;
    this.unidade = item.unidade;
    this.validade = item.validade;
    this.modoEdicao = true;
  } else {
    console.error('Item não encontrado para edição. ID:', id);
  }
    }).catch(error => {
      console.error('Erro ao obter dados para edição:', error);
    });
  }

  onDeleteLocalButtonClick(index: number) {
    const alimentosLocais = this.cadastroService.getAllData();
    alimentosLocais.splice(index, 1);
    this.cadastroService.updateStorage(alimentosLocais);
    const mensagem = 'Exclusão local concluída com sucesso!';
    alert(mensagem);
  }
    
    limparForm() {
    this.descricao = '';
    this.quantidade = 0;
    this.unidade = '';
    this.validade = '';
    this.modoEdicao = false;
  }  

  atualizarTabela() {
    this.alimentos$ = this.cadastroPromiseService.getAll();
  }

}
