// sobre.component.ts
import { Component, OnInit } from '@angular/core';
import { CompartilhamentoDadosService } from './../services/compartilhamento-dados.service';

@Component({
  selector: 'app-sobre',
  templateUrl: './sobre.component.html',
  styleUrls: ['./sobre.component.css'],
})
export class SobreComponent implements OnInit {
  alimentos: any[] = [];

  constructor(private compartilhamentoDadosService: CompartilhamentoDadosService) {}

  ngOnInit(): void {
    this.compartilhamentoDadosService.alimentos$.subscribe((alimentos) => {
      this.alimentos = alimentos;
    });
  }
}
