import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'execucoes',
    loadComponent: () =>
      import('./features/execucoes-list/execucoes-list.component').then(
        (m) => m.ExecucoesListComponent,
      ),
  },
  {
    path: 'execucoes/:id',
    loadComponent: () =>
      import('./features/execucao-detalhe/execucao-detalhe.component').then(
        (m) => m.ExecucaoDetalheComponent,
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
