import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CadastroComponent } from './cadastro/cadastro.component';
import { ConsultaComponent } from './consulta/consulta.component';
import { SobreComponent } from './sobre/sobre.component';

//Aqui é definido as rotas da aplicação - Requisito da Atividade #09
const routes: Routes = [
  {
    //Aqui é definido o caminho para o componente CadastroComponent
    //O caminho é definido como cadastro/:modo, onde :modo é um parâmetro
    //identificando se estamos em um novo cadastro ou em edição
    path: 'cadastro/:modo',
    component: CadastroComponent    
  },
  //rota para o componente ConsultaComponent
  { path: 'consulta', component: ConsultaComponent },
  //rota para o componente SobreComponent
  { path: 'sobre', component: SobreComponent },
  //rota padrão, caso o usuário digite um caminho inválido, será redirecionado para a página de cadastro
  { path: '', redirectTo: '/cadastro', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
