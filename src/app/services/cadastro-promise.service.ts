import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Alimento } from './../model/alimento';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CompartilhamentoDadosService } from './compartilhamento-dados.service';
import { CadastroService } from './../cadastro/cadastro.service';
import { Subject } from 'rxjs';


@Injectable()
export class CadastroPromiseService {
  
  private alimentosSubject: BehaviorSubject<Alimento[]> = new BehaviorSubject<Alimento[]>([]);
  public alimentos$: Observable<Alimento[]> = this.alimentosSubject.asObservable();
  private alteracoesSubject: Subject<void> = new Subject<void>();
  public alteracoes$: Observable<void> = this.alteracoesSubject.asObservable();

  constructor(
    private httpClient: HttpClient,
    private compartilhamentoDadosService: CompartilhamentoDadosService,
    private cadastroService: CadastroService  // Injete o serviço CadastroService

  ) {}

  save(alimento: Alimento): Observable<Alimento> {
    if (this.isAlimentoVencido(alimento.validade)) {
      return throwError('O alimento está vencido. Por favor, verifique a validade.');
    }

    // Obtém a lista atual de alimentos locais
    const alimentosLocais = this.cadastroService.getAllData();

    // Atribuir uma ID incremental única ao novo alimento
    alimento.id = this.obterProximaId(alimentosLocais);

    // Salvar localmente com a nova ID
    this.cadastroService.save(alimento);
    const mensagem = `Alimento salvo localmente com sucesso!`;
    alert(mensagem);

    // Salvar remotamente
    return this.httpClient.post<Alimento>('http://localhost:3000/alimentos', alimento).pipe(
      catchError((error) => throwError('Erro ao salvar o alimento via API: ' + error)),
      map((alimentoSalvo) => {
        // Atualizar a última ID utilizada com base na ID da API, se disponível
        if (alimentoSalvo && alimentoSalvo.id !== undefined) {
          alimento.id = alimentoSalvo.id!; // Utilize o operador de asserção (!)
          this.cadastroService.updateStorage(this.cadastroService.getAllData()); // Atualizar localmente com a mesma ID
        }

        this.atualizarTotalAlimentos();
        this.alteracoesSubject.next(); // Notifica sobre a modificação
        return alimentoSalvo || alimento; // Retornar o objeto salvo ou o objeto local com a ID temporária
      })
    );
  }
  
  private obterProximaId(alimentosLocais: Alimento[]): number {
    const ultimaIdUtilizada = alimentosLocais.reduce((maxId, alimento) => Math.max(maxId, alimento.id!), 0);
    return ultimaIdUtilizada + 1;
  }

  delete(id: number): Observable<void> {
    this.cadastroService.delete(id);
    const mensagem = `Alimento excluído localmente com sucesso!`;
    alert(mensagem);

    console.log('Chamando função de exclusão para o id:', id);
    console.log('Chamando função de exclusão para o id:', `http://localhost:3000/alimentos/${id}`);
  
    const deleteObservable = this.httpClient.delete<void>(`http://localhost:3000/alimentos/${id}`).pipe(
      catchError((error) => {
        console.error('Erro ao excluir o alimento: ', error);
        return throwError('Erro ao excluir o alimento.');
      }),
      map(() => {
        console.log('Exclusão bem-sucedida');        
        this.atualizarTotalAlimentos();
        this.alteracoesSubject.next(); // Notifica sobre a modificação
      })
    );
  
    const subscription = deleteObservable.subscribe(
      () => {
        console.log('Observador notificado com sucesso.');
      },
      (error) => {
        console.error('Erro no observador:', error);
      },
      () => {
        console.log('Observador concluído.');
      }
    );
  
    return deleteObservable;
  }
  

  patch(alimentos: Alimento[]): void {
    alimentos.forEach(alimento => {
      const url = `http://localhost:3000/alimentos/${alimento.id}`;
      this.httpClient.patch(url, { ...alimento }).subscribe(
        () => {
          console.log(`Dados atualizados para o alimento com ID ${alimento.id} na API`);
          this.atualizarTotalAlimentos();
        },
        (error) => console.error(`Erro ao atualizar dados para o alimento com ID ${alimento.id} na API: `, error)
      );
    });
  }

  atualizarTotalAlimentos(): void {
    this.httpClient.get<Alimento[]>('http://localhost:3000/alimentos').subscribe(
      (alimentos) => {
        this.alimentosSubject.next(alimentos);
        this.compartilhamentoDadosService.atualizarAlimentos(alimentos);
      },
      (error) => console.error('Erro ao atualizar total de alimentos: ', error)
    );
  }

  getAll(): Observable<Alimento[]> {
    return this.httpClient.get<Alimento[]>('http://localhost:3000/alimentos').pipe(
      catchError((error) => {
        console.error('Erro ao obter alimentos: ', error);
        return throwError('Erro ao obter alimentos.');
      })
    );
  }

  isAlimentoVencido(validade: string): boolean {
    const hoje = new Date();
    const dataValidade = new Date(validade);
    return hoje > dataValidade;
  }
}
