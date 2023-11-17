import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Alimento } from './../model/alimento';


@Injectable({
  providedIn: 'root',
})
export class CadastroService {
  private storageKey = 'cadastroData';
  private alimentosSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public alimentos$: Observable<any[]> = this.alimentosSubject.asObservable();
  private alimentosLocaisSubject: Subject<Alimento[]> = new Subject<Alimento[]>();
  public alimentosLocais$: Observable<Alimento[]> = this.alimentosLocaisSubject.asObservable();

  constructor() {
    // Carregar dados do armazenamento quando o serviço é inicializado
    this.loadDataFromStorage();
  }

  // Método para salvar um novo item no Web Storage
  save(data: any): void {
    const currentData = this.getAllData();
    currentData.push(data);
    this.updateStorage(currentData);
    this.atualizarAlimentosLocais(); // Notifica sobre a modificação
  }

  // Método para atualizar um item no Web Storage
  update(id: number, data: any): void {
  const currentData = this.getAllData();
  const index = currentData.findIndex(item => item.id === id);

  if (index !== -1) {
    currentData[index] = data;
    this.updateStorage(currentData);
    this.atualizarAlimentosLocais(); // Notifica sobre a modificação
  } else {
    console.error('Erro: Item não encontrado para atualização. ID:', id);
  }
}


  // Método para excluir um item do Web Storage
  delete(id: number): void {
    // Excluir localmente usando a ID do servidor
    this.alimentos$.subscribe(alimentos => {
      const index = alimentos.findIndex(item => item.id === id);
      if (index !== -1) {
        alimentos.splice(index, 1);
        this.updateStorage(alimentos);
        this.atualizarAlimentosLocais(); // Notifica sobre a modificação
      }
    });
  }   

  // Método para obter todos os dados do Web Storage
  getAllData(): any[] {
    const dataString = localStorage.getItem(this.storageKey);
    const data = dataString ? JSON.parse(dataString) : [];
    this.alimentosSubject.next(data); // Atualizar BehaviorSubject
    return data;
  }

  // Método auxiliar para atualizar o Web Storage
   updateStorage(data: any[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
    this.alimentosSubject.next(data);
  }  

  // Método para carregar dados do armazenamento ao iniciar o serviço
  private loadDataFromStorage(): void {
    const dataString = localStorage.getItem(this.storageKey);
    const data = dataString ? JSON.parse(dataString) : [];
    this.alimentosSubject.next(data);
  }

  // Método para obter a quantidade de alimentos cadastrados
  getQuantidadeAlimentos(): Observable<number> {
    return this.alimentos$.pipe(
      map((alimentos: any[]) => alimentos.length)
    );
  }

  getIndexById(id: number): number {
    const currentData = this.getAllData();
    return currentData.findIndex(item => item.id === id);
  }

  private atualizarAlimentosLocais(): void {
    const alimentosLocais = this.getAllData();
    this.alimentosLocaisSubject.next(alimentosLocais);
  }
  
}
