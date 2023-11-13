import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgxMaskModule, IConfig } from 'ngx-mask';

import { AppRoutingModule } from './app-routing.module';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { FooterComponent } from './footer/footer.component';
import { CadastroComponent } from './cadastro/cadastro.component';
import { ConsultaComponent } from './consulta/consulta.component';
import { SobreComponent } from './sobre/sobre.component';
import { TotalAlimentosComponent } from './cadastro/total-alimentos/total-alimentos.component';
import { CadastroPromiseService } from './services/cadastro-promise.service';

const routes: Routes = [
  { path: 'cadastro', component: CadastroComponent },
  { path: 'consulta', component: ConsultaComponent },
  { path: 'sobre', component: SobreComponent },
  { path: '', redirectTo: '/cadastro', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    FooterComponent,
    CadastroComponent,
    ConsultaComponent,
    SobreComponent,
    TotalAlimentosComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    NgxMaskModule.forRoot(),
    RouterModule.forRoot(routes)
  ],
  providers: [CadastroPromiseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
