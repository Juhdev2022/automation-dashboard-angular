import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { Cliente } from '../../core/models/execucao.model';

const CLIENTE_CLASSES: Record<string, string> = {
  BANESTES: 'bg-cliente-banestes/10 text-cliente-banestes',
  ECT: 'bg-cliente-ect/10 text-cliente-ect',
  TSE: 'bg-cliente-tse/10 text-cliente-tse',
};

const CLASSES_PADRAO = 'bg-cliente-desconhecido/10 text-cliente-desconhecido';

@Component({
  selector: 'app-cliente-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      [class]="
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ' + classes()
      "
    >
      {{ cliente() }}
    </span>
  `,
})
export class ClienteBadgeComponent {
  readonly cliente = input.required<Cliente>();

  protected readonly classes = computed(() => CLIENTE_CLASSES[this.cliente()] ?? CLASSES_PADRAO);
}
