import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="p-8">
      <h1 class="text-2xl font-bold text-corporate">Dashboard</h1>
      <p class="text-gray-600">Métricas, gráfico e execuções recentes chegam no M5.</p>
    </div>
  `,
})
export class DashboardComponent {}
