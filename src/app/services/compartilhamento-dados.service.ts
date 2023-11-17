import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CompartilhamentoDadosService {
  private alimentosSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public alimentos$: Observable<any[]> = this.alimentosSubject.asObservable();

  private quantidadeAlimentosSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public quantidadeAlimentos$: Observable<number> = this.quantidadeAlimentosSubject.asObservable();

  constructor() {}

  atualizarAlimentos(alimentos: any[]): void {
    this.alimentosSubject.next(alimentos);
    this.atualizarQuantidadeAlimentos(alimentos.length);
  }

  private atualizarQuantidadeAlimentos(quantidade: number): void {
    this.quantidadeAlimentosSubject.next(quantidade);
  }
}
