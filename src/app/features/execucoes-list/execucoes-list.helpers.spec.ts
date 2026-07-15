import { Execucao } from '../../core/models/execucao.model';
import {
  aplicarFiltros,
  FILTROS_VAZIOS,
  ordenarExecucoes,
  paginar,
} from './execucoes-list.helpers';

function criarExecucao(parciais: Partial<Execucao>): Execucao {
  return {
    id: 'id-padrao',
    cliente: 'BANESTES',
    ambiente: 'PRODUCAO',
    dataInicio: '2026-07-10T10:00:00-03:00',
    dataFim: '2026-07-10T10:01:00-03:00',
    duracaoSegundos: 60,
    status: 'SUCESSO',
    tipoTeste: 'SFTP_UPLOAD',
    totalEtapas: 3,
    etapasComSucesso: 3,
    etapas: [],
    ...parciais,
  };
}

describe('execucoes-list.helpers', () => {
  describe('aplicarFiltros', () => {
    const execucoes = [
      criarExecucao({ id: 'a', cliente: 'BANESTES', status: 'SUCESSO', ambiente: 'PRODUCAO', dataFim: '2026-07-10T10:00:00-03:00' }),
      criarExecucao({ id: 'b', cliente: 'ECT', status: 'FALHA', ambiente: 'HOMOLOGACAO', dataFim: '2026-07-12T10:00:00-03:00' }),
      criarExecucao({ id: 'c', cliente: 'TSE', status: 'PARCIAL', ambiente: 'PRODUCAO', dataFim: '2026-07-14T10:00:00-03:00' }),
    ];

    it('sem filtros, retorna todas as execuções', () => {
      expect(aplicarFiltros(execucoes, FILTROS_VAZIOS)).toEqual(execucoes);
    });

    it('filtra por cliente', () => {
      const resultado = aplicarFiltros(execucoes, { ...FILTROS_VAZIOS, clientes: ['ECT'] });
      expect(resultado.map((e) => e.id)).toEqual(['b']);
    });

    it('filtra por status', () => {
      const resultado = aplicarFiltros(execucoes, { ...FILTROS_VAZIOS, statuses: ['FALHA', 'PARCIAL'] });
      expect(resultado.map((e) => e.id)).toEqual(['b', 'c']);
    });

    it('filtra por ambiente', () => {
      const resultado = aplicarFiltros(execucoes, { ...FILTROS_VAZIOS, ambiente: 'PRODUCAO' });
      expect(resultado.map((e) => e.id)).toEqual(['a', 'c']);
    });

    it('filtra por intervalo de datas', () => {
      const resultado = aplicarFiltros(execucoes, {
        ...FILTROS_VAZIOS,
        dataInicio: '2026-07-11',
        dataFim: '2026-07-13',
      });
      expect(resultado.map((e) => e.id)).toEqual(['b']);
    });

    it('combina múltiplos filtros', () => {
      const resultado = aplicarFiltros(execucoes, {
        ...FILTROS_VAZIOS,
        clientes: ['TSE'],
        statuses: ['PARCIAL'],
      });
      expect(resultado.map((e) => e.id)).toEqual(['c']);
    });
  });

  describe('ordenarExecucoes', () => {
    const execucoes = [
      criarExecucao({ id: 'a', dataFim: '2026-07-10T10:00:00-03:00', duracaoSegundos: 30 }),
      criarExecucao({ id: 'b', dataFim: '2026-07-14T10:00:00-03:00', duracaoSegundos: 10 }),
      criarExecucao({ id: 'c', dataFim: '2026-07-12T10:00:00-03:00', duracaoSegundos: 20 }),
    ];

    it('ordena por data decrescente', () => {
      const resultado = ordenarExecucoes(execucoes, 'dataFim', 'desc');
      expect(resultado.map((e) => e.id)).toEqual(['b', 'c', 'a']);
    });

    it('ordena por duração crescente', () => {
      const resultado = ordenarExecucoes(execucoes, 'duracaoSegundos', 'asc');
      expect(resultado.map((e) => e.id)).toEqual(['b', 'c', 'a']);
    });

    it('não muta o array original', () => {
      const copiaOriginal = [...execucoes];
      ordenarExecucoes(execucoes, 'dataFim', 'asc');
      expect(execucoes).toEqual(copiaOriginal);
    });
  });

  describe('paginar', () => {
    const itens = Array.from({ length: 25 }, (_, indice) => indice + 1);

    it('retorna a primeira página com o tamanho pedido', () => {
      const resultado = paginar(itens, 1, 10);
      expect(resultado.itens).toEqual(Array.from({ length: 10 }, (_, i) => i + 1));
      expect(resultado.totalPaginas).toBe(3);
      expect(resultado.totalItens).toBe(25);
    });

    it('retorna a última página parcial', () => {
      const resultado = paginar(itens, 3, 10);
      expect(resultado.itens).toEqual([21, 22, 23, 24, 25]);
    });

    it('corrige para a página 1 quando a lista está vazia', () => {
      const resultado = paginar([], 5, 10);
      expect(resultado.paginaAtual).toBe(1);
      expect(resultado.totalPaginas).toBe(1);
      expect(resultado.itens).toEqual([]);
    });

    it('corrige uma página além do total para a última página válida', () => {
      const resultado = paginar(itens, 99, 10);
      expect(resultado.paginaAtual).toBe(3);
      expect(resultado.itens).toEqual([21, 22, 23, 24, 25]);
    });
  });
});
