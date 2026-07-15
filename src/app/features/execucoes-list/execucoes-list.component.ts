import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs';

import { Ambiente, Cliente, StatusExecucao } from '../../core/models/execucao.model';
import { injetarEstadoExecucoes } from '../../core/services/execucoes-estado';
import { ClienteBadgeComponent } from '../../shared/components/cliente-badge.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';
import { DuracaoPipe } from '../../shared/pipes/duracao.pipe';
import {
  aplicarFiltros,
  ColunaOrdenacao,
  Direcao,
  FILTROS_VAZIOS,
  ordenarExecucoes,
  paginar,
} from './execucoes-list.helpers';

const ITENS_POR_PAGINA = 10;

@Component({
  selector: 'app-execucoes-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, DatePipe, StatusBadgeComponent, ClienteBadgeComponent, DuracaoPipe],
  templateUrl: './execucoes-list.component.html',
})
export class ExecucoesListComponent {
  private readonly router = inject(Router);
  private readonly estado = injetarEstadoExecucoes();

  protected readonly carregando = computed(() => this.estado().status === 'carregando');
  protected readonly comErro = computed(() => this.estado().status === 'erro');

  private readonly execucoes = computed(() => {
    const estadoAtual = this.estado();
    return estadoAtual.status === 'sucesso' ? estadoAtual.execucoes : [];
  });

  protected readonly clientesDisponiveis: Cliente[] = ['BANESTES', 'ECT', 'TSE'];
  protected readonly statusesDisponiveis: StatusExecucao[] = [
    'SUCESSO',
    'FALHA',
    'PARCIAL',
    'EM_EXECUCAO',
  ];

  protected readonly form = new FormGroup({
    clientes: new FormControl<Cliente[]>(FILTROS_VAZIOS.clientes, { nonNullable: true }),
    statuses: new FormControl<StatusExecucao[]>(FILTROS_VAZIOS.statuses, { nonNullable: true }),
    ambiente: new FormControl<Ambiente | 'TODOS'>(FILTROS_VAZIOS.ambiente, { nonNullable: true }),
    dataInicio: new FormControl<string | null>(FILTROS_VAZIOS.dataInicio),
    dataFim: new FormControl<string | null>(FILTROS_VAZIOS.dataFim),
  });

  private readonly filtros = toSignal(
    this.form.valueChanges.pipe(map(() => this.form.getRawValue())),
    { initialValue: this.form.getRawValue() },
  );

  protected readonly ordenacao = signal<ColunaOrdenacao>('dataFim');
  protected readonly direcao = signal<Direcao>('desc');
  protected readonly paginaAtual = signal(1);

  private readonly execucoesFiltradas = computed(() =>
    aplicarFiltros(this.execucoes(), this.filtros()),
  );

  protected readonly execucoesOrdenadas = computed(() =>
    ordenarExecucoes(this.execucoesFiltradas(), this.ordenacao(), this.direcao()),
  );

  protected readonly pagina = computed(() =>
    paginar(this.execucoesOrdenadas(), this.paginaAtual(), ITENS_POR_PAGINA),
  );

  constructor() {
    effect(() => {
      this.filtros();
      this.paginaAtual.set(1);
    });
  }

  protected isClienteSelecionado(cliente: Cliente): boolean {
    return this.form.controls.clientes.value.includes(cliente);
  }

  protected alternarCliente(cliente: Cliente): void {
    const atual = this.form.controls.clientes.value;
    const atualizado = atual.includes(cliente)
      ? atual.filter((valor) => valor !== cliente)
      : [...atual, cliente];
    this.form.controls.clientes.setValue(atualizado);
  }

  protected isStatusSelecionado(status: StatusExecucao): boolean {
    return this.form.controls.statuses.value.includes(status);
  }

  protected alternarStatus(status: StatusExecucao): void {
    const atual = this.form.controls.statuses.value;
    const atualizado = atual.includes(status)
      ? atual.filter((valor) => valor !== status)
      : [...atual, status];
    this.form.controls.statuses.setValue(atualizado);
  }

  protected limparFiltros(): void {
    this.form.reset(FILTROS_VAZIOS);
  }

  protected ordenarPor(coluna: ColunaOrdenacao): void {
    if (this.ordenacao() === coluna) {
      this.direcao.update((direcaoAtual) => (direcaoAtual === 'asc' ? 'desc' : 'asc'));
      return;
    }

    this.ordenacao.set(coluna);
    this.direcao.set(coluna === 'dataFim' ? 'desc' : 'asc');
  }

  protected indicadorOrdenacao(coluna: ColunaOrdenacao): string {
    if (this.ordenacao() !== coluna) {
      return '';
    }

    return this.direcao() === 'asc' ? '▲' : '▼';
  }

  protected irParaPagina(pagina: number): void {
    this.paginaAtual.set(pagina);
  }

  protected abrirDetalhe(id: string): void {
    this.router.navigate(['/execucoes', id]);
  }
}
