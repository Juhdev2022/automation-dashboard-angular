import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { ROTULOS_STATUS_EXECUCAO, StatusExecucao } from '../../core/models/execucao.model';

interface StatusConfig {
  label: string;
  classes: string;
}

const STATUS_CONFIG: Record<StatusExecucao, StatusConfig> = {
  SUCESSO: { label: ROTULOS_STATUS_EXECUCAO.SUCESSO, classes: 'bg-status-sucesso/10 text-status-sucesso' },
  FALHA: { label: ROTULOS_STATUS_EXECUCAO.FALHA, classes: 'bg-status-falha/10 text-status-falha' },
  PARCIAL: { label: ROTULOS_STATUS_EXECUCAO.PARCIAL, classes: 'bg-status-parcial/10 text-status-parcial' },
  EM_EXECUCAO: {
    label: ROTULOS_STATUS_EXECUCAO.EM_EXECUCAO,
    classes: 'bg-status-em-execucao/10 text-status-em-execucao',
  },
};

@Component({
  selector: 'app-status-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      [class]="
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ' +
        config().classes
      "
    >
      {{ config().label }}
    </span>
  `,
})
export class StatusBadgeComponent {
  readonly status = input.required<StatusExecucao>();

  protected readonly config = computed(() => STATUS_CONFIG[this.status()]);
}
