export class Alimento {
    id?: number;
    constructor(
      public descricao: string,
      public quantidade: number,
      public unidade: string,
      public validade: string
    ) {
      this.descricao = descricao;
      this.quantidade = quantidade;
      this.unidade = unidade;
      this.validade = validade;
    }
  }
  