import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { catchError, map, of } from 'rxjs';

import { Execucao } from '../../core/models/execucao.model';
import { ExecucaoService } from '../../core/services/execucao.service';
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

type EstadoExecucoes =
  | { status: 'carregando' }
  | { status: 'erro' }
  | { status: 'sucesso'; execucoes: Execucao[] };

const DIAS_METRICAS = 30;
const DIAS_GRAFICO = 7;
const TOTAL_RECENTES = 5;
const ESTADO_INICIAL: EstadoExecucoes = { status: 'carregando' };

@Component({
  selector: 'app-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, StatusBadgeComponent, ClienteBadgeComponent, DuracaoPipe, DataRelativaPipe],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  private readonly execucaoService = inject(ExecucaoService);

  private readonly estado = toSignal(
    this.execucaoService.getExecucoes().pipe(
      map((execucoes): EstadoExecucoes => ({ status: 'sucesso', execucoes })),
      catchError(() => of<EstadoExecucoes>({ status: 'erro' })),
    ),
    { initialValue: ESTADO_INICIAL },
  );

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
