import { Execucao } from '../../core/models/execucao.model';

export interface ExecucoesPorDia {
  data: string;
  rotulo: string;
  total: number;
}

const UM_DIA_MS = 24 * 60 * 60 * 1000;
const ROTULOS_DIA_SEMANA = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];

function inicioDoDia(data: Date): Date {
  return new Date(data.getFullYear(), data.getMonth(), data.getDate());
}

function formatarChaveDoDia(data: Date): string {
  const ano = data.getFullYear();
  const mes = (data.getMonth() + 1).toString().padStart(2, '0');
  const dia = data.getDate().toString().padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

export function filtrarUltimosDias(
  execucoes: Execucao[],
  dias: number,
  referencia: Date,
): Execucao[] {
  const limite = inicioDoDia(referencia).getTime() - (dias - 1) * UM_DIA_MS;
  return execucoes.filter((execucao) => new Date(execucao.dataFim).getTime() >= limite);
}

export function calcularTaxaSucesso(execucoes: Execucao[]): number {
  if (execucoes.length === 0) {
    return 0;
  }

  const totalComSucesso = execucoes.filter((execucao) => execucao.status === 'SUCESSO').length;
  return Math.round((totalComSucesso / execucoes.length) * 100);
}

export function calcularTempoMedioSegundos(execucoes: Execucao[]): number {
  if (execucoes.length === 0) {
    return 0;
  }

  const totalSegundos = execucoes.reduce((soma, execucao) => soma + execucao.duracaoSegundos, 0);
  return Math.round(totalSegundos / execucoes.length);
}

/**
 * Em caso de empate no número de falhas, mantém o cliente que atingiu o maior
 * total primeiro (ordem de aparição na lista) — decisão arbitrária, já que o
 * requisito original não especifica critério de desempate.
 */
export function calcularClienteComMaisFalhas(execucoes: Execucao[]): string | null {
  const falhasPorCliente = new Map<string, number>();

  for (const execucao of execucoes) {
    if (execucao.status !== 'FALHA') {
      continue;
    }

    falhasPorCliente.set(execucao.cliente, (falhasPorCliente.get(execucao.cliente) ?? 0) + 1);
  }

  let clienteComMaisFalhas: string | null = null;
  let maiorTotal = 0;

  for (const [cliente, total] of falhasPorCliente) {
    if (total > maiorTotal) {
      clienteComMaisFalhas = cliente;
      maiorTotal = total;
    }
  }

  return clienteComMaisFalhas;
}

export function calcularExecucoesPorDia(
  execucoes: Execucao[],
  dias: number,
  referencia: Date,
): ExecucoesPorDia[] {
  const hoje = inicioDoDia(referencia);
  const buckets: ExecucoesPorDia[] = [];

  for (let i = dias - 1; i >= 0; i--) {
    const data = new Date(hoje.getTime() - i * UM_DIA_MS);
    buckets.push({ data: formatarChaveDoDia(data), rotulo: ROTULOS_DIA_SEMANA[data.getDay()], total: 0 });
  }

  const indicePorChave = new Map(buckets.map((bucket, indice) => [bucket.data, indice]));

  for (const execucao of execucoes) {
    const chave = formatarChaveDoDia(new Date(execucao.dataFim));
    const indice = indicePorChave.get(chave);

    if (indice !== undefined) {
      buckets[indice].total++;
    }
  }

  return buckets;
}

export function obterExecucoesMaisRecentes(execucoes: Execucao[], quantidade: number): Execucao[] {
  return [...execucoes]
    .sort((a, b) => new Date(b.dataFim).getTime() - new Date(a.dataFim).getTime())
    .slice(0, quantidade);
}
