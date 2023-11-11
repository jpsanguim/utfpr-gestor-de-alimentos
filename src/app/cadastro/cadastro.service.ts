import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CadastroService {
  private storageKey = 'cadastroData';

  constructor() {}

  // Método para salvar um novo item no Web Storage
  save(data: any): void {
    const currentData = this.getAllData();
    currentData.push(data);
    this.updateStorage(currentData);
  }

  // Método para atualizar um item no Web Storage
  update(index: number, data: any): void {
    const currentData = this.getAllData();
    currentData[index] = data;
    this.updateStorage(currentData);
  }

  // Método para excluir um item do Web Storage
  delete(index: number): void {
    const currentData = this.getAllData();
    currentData.splice(index, 1);
    this.updateStorage(currentData);
  }

  // Método para obter todos os dados do Web Storage
  getAllData(): any[] {
    const dataString = localStorage.getItem(this.storageKey);
    return dataString ? JSON.parse(dataString) : [];
  }

  // Método auxiliar para atualizar o Web Storage
  private updateStorage(data: any[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }
}
