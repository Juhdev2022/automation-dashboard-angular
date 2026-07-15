import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { injetarEstadoExecucoes } from '../../core/services/execucoes-estado';
import { ClienteBadgeComponent } from '../../shared/components/cliente-badge.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';
import { DuracaoPipe } from '../../shared/pipes/duracao.pipe';
import { obterConfigStatusEtapa, ordenarEtapas } from './execucao-detalhe.helpers';

@Component({
  selector: 'app-execucao-detalhe',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, DatePipe, ClienteBadgeComponent, StatusBadgeComponent, DuracaoPipe],
  templateUrl: './execucao-detalhe.component.html',
})
export class ExecucaoDetalheComponent {
  readonly id = input.required<string>();

  private readonly estado = injetarEstadoExecucoes();

  protected readonly carregando = computed(() => this.estado().status === 'carregando');
  protected readonly comErro = computed(() => this.estado().status === 'erro');

  protected readonly execucao = computed(() => {
    const estadoAtual = this.estado();

    if (estadoAtual.status !== 'sucesso') {
      return null;
    }

    return estadoAtual.execucoes.find((execucao) => execucao.id === this.id()) ?? null;
  });

  protected readonly naoEncontrada = computed(
    () => this.estado().status === 'sucesso' && this.execucao() === null,
  );

  protected readonly etapasOrdenadas = computed(() => {
    const execucaoAtual = this.execucao();
    return execucaoAtual ? ordenarEtapas(execucaoAtual.etapas) : [];
  });

  protected readonly obterConfigStatusEtapa = obterConfigStatusEtapa;
}
