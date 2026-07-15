import { Component, input } from '@angular/core';

@Component({
  selector: 'app-execucao-detalhe',
  template: `
    <div class="p-8">
      <h1 class="text-2xl font-bold text-corporate">Detalhe da execução</h1>
      <p class="text-gray-600">Timeline de etapas chega no M7. ID recebido da rota: {{ id() }}</p>
    </div>
  `,
})
export class ExecucaoDetalheComponent {
  readonly id = input.required<string>();
}
