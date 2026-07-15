import { Ambiente, Cliente, Execucao, StatusExecucao } from '../../core/models/execucao.model';

export interface FiltrosExecucoes {
  clientes: Cliente[];
  statuses: StatusExecucao[];
  ambiente: Ambiente | 'TODOS';
  dataInicio: string | null;
  dataFim: string | null;
}

export const FILTROS_VAZIOS: FiltrosExecucoes = {
  clientes: [],
  statuses: [],
  ambiente: 'TODOS',
  dataInicio: null,
  dataFim: null,
};

export function aplicarFiltros(execucoes: Execucao[], filtros: FiltrosExecucoes): Execucao[] {
  return execucoes.filter((execucao) => {
    if (filtros.clientes.length > 0 && !filtros.clientes.includes(execucao.cliente)) {
      return false;
    }

    if (filtros.statuses.length > 0 && !filtros.statuses.includes(execucao.status)) {
      return false;
    }

    if (filtros.ambiente !== 'TODOS' && execucao.ambiente !== filtros.ambiente) {
      return false;
    }

    const dataDaExecucao = execucao.dataFim.slice(0, 10);

    if (filtros.dataInicio && dataDaExecucao < filtros.dataInicio) {
      return false;
    }

    if (filtros.dataFim && dataDaExecucao > filtros.dataFim) {
      return false;
    }

    return true;
  });
}

export type ColunaOrdenacao =
  | 'cliente'
  | 'tipoTeste'
  | 'ambiente'
  | 'dataFim'
  | 'duracaoSegundos'
  | 'status';

export type Direcao = 'asc' | 'desc';

function obterValorOrdenacao(execucao: Execucao, coluna: ColunaOrdenacao): string | number {
  switch (coluna) {
    case 'dataFim':
      return new Date(execucao.dataFim).getTime();
    case 'duracaoSegundos':
      return execucao.duracaoSegundos;
    default:
      return execucao[coluna];
  }
}

export function ordenarExecucoes(
  execucoes: Execucao[],
  coluna: ColunaOrdenacao,
  direcao: Direcao,
): Execucao[] {
  const fator = direcao === 'asc' ? 1 : -1;

  return [...execucoes].sort((a, b) => {
    const valorA = obterValorOrdenacao(a, coluna);
    const valorB = obterValorOrdenacao(b, coluna);

    if (valorA < valorB) {
      return -1 * fator;
    }

    if (valorA > valorB) {
      return 1 * fator;
    }

    return 0;
  });
}

export interface PaginaResultado<T> {
  itens: T[];
  totalItens: number;
  totalPaginas: number;
  paginaAtual: number;
}

export function paginar<T>(
  itens: T[],
  paginaAtual: number,
  itensPorPagina: number,
): PaginaResultado<T> {
  const totalPaginas = Math.max(1, Math.ceil(itens.length / itensPorPagina));
  const paginaValida = Math.min(Math.max(1, paginaAtual), totalPaginas);
  const inicio = (paginaValida - 1) * itensPorPagina;

  return {
    itens: itens.slice(inicio, inicio + itensPorPagina),
    totalItens: itens.length,
    totalPaginas,
    paginaAtual: paginaValida,
  };
}
