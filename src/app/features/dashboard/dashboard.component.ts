import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';

import { injetarEstadoExecucoes } from '../../core/services/execucoes-estado';
import { ClienteBadgeComponent } from '../../shared/components/cliente-badge.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';
import { DataRelativaPipe } from '../../shared/pipes/data-relativa.pipe';
import { DuracaoPipe } from '../../shared/pipes/duracao.pipe';
import {
  calcularClienteComMaisFalhas,
  calcularExecucoesPorDia,
  calcularTaxaSucesso,
  calcularTempoMedioSegundos,
  filtrarUltimosDias,
  obterExecucoesMaisRecentes,
} from './dashboard.metrics';

const DIAS_METRICAS = 30;
const DIAS_GRAFICO = 7;
const TOTAL_RECENTES = 5;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, StatusBadgeComponent, ClienteBadgeComponent, DuracaoPipe, DataRelativaPipe],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  private readonly estado = injetarEstadoExecucoes();

  protected readonly carregando = computed(() => this.estado().status === 'carregando');
  protected readonly comErro = computed(() => this.estado().status === 'erro');

  private readonly execucoes = computed(() => {
    const estadoAtual = this.estado();
    return estadoAtual.status === 'sucesso' ? estadoAtual.execucoes : [];
  });

  private readonly execucoesUltimos30Dias = computed(() =>
    filtrarUltimosDias(this.execucoes(), DIAS_METRICAS, new Date()),
  );

  protected readonly totalExecucoes = computed(() => this.execucoesUltimos30Dias().length);

  protected readonly taxaSucesso = computed(() =>
    calcularTaxaSucesso(this.execucoesUltimos30Dias()),
  );

  protected readonly tempoMedioSegundos = computed(() =>
    calcularTempoMedioSegundos(this.execucoesUltimos30Dias()),
  );

  protected readonly clienteComMaisFalhas = computed(() =>
    calcularClienteComMaisFalhas(this.execucoesUltimos30Dias()),
  );

  protected readonly execucoesPorDia = computed(() =>
    calcularExecucoesPorDia(this.execucoes(), DIAS_GRAFICO, new Date()),
  );

  protected readonly maiorTotalPorDia = computed(() =>
    Math.max(1, ...this.execucoesPorDia().map((dia) => dia.total)),
  );

  protected readonly execucoesRecentes = computed(() =>
    obterExecucoesMaisRecentes(this.execucoes(), TOTAL_RECENTES),
  );
}
