import {
  Component,
  EventEmitter,
  Output,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { CadastroService } from './../cadastro/cadastro.service';
import { CadastroPromiseService } from './../services/cadastro-promise.service';
import { Observable } from 'rxjs';
import { Alimento } from './../model/alimento';
import { of } from 'rxjs';


@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.css'],
  providers: [CadastroPromiseService],
})
export class ConsultaComponent implements OnInit {
  @Output() editarItem = new EventEmitter<any>();
  alimentos: any[] = [];
  alimentos$!: Observable<Alimento[]>;
  alimentosLocais$: Observable<any[]> = of([]);

  constructor(
    private router: Router,
    public cadastroPromiseService: CadastroPromiseService,
    private cadastroService: CadastroService

  ) {}

  ngOnInit(): void {
    this.alimentos$ = this.cadastroPromiseService.getAll();
    this.alimentosLocais$ = this.cadastroService.alimentos$;

  }

  novoRegistro() {
    this.router.navigate(['/cadastro/novo']);
  }

  editarRegistro(item: any) {
    this.router.navigate([
      '/cadastro/editar',
      { item: JSON.stringify(item), modo: 'editar' },
    ]);
  }

  excluirRegistro(item: any) {
    // Obtenha o ID do item para excluir
    const id = item.id;

    // Chame a função delete do serviço para excluir via API
    this.cadastroPromiseService.delete(id).subscribe(
      () => {
        console.log('Exclusão concluída');
      },
      (error) => {
        console.error('Erro ao excluir o alimento:', error);
      }
    );
  } 

  excluirRegistroLocal(item: any) {
    const id = item.id;
    // Obtenha o índice do item local
    const index = this.cadastroService.getIndexById(id);

    if (index !== -1) {
      // Implemente a lógica para excluir o item localmente
      // Aqui, você pode usar o método delete do serviço CadastroService
      // Certifique-se de atualizar a lista após a exclusão
      // Exemplo:
      this.cadastroService.delete(index);
    }
  }
}
