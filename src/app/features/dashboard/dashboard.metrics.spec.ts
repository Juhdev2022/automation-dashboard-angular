import { Execucao } from '../../core/models/execucao.model';
import {
  calcularClienteComMaisFalhas,
  calcularExecucoesPorDia,
  calcularTaxaSucesso,
  calcularTempoMedioSegundos,
  filtrarUltimosDias,
  obterExecucoesMaisRecentes,
} from './dashboard.metrics';

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

describe('dashboard.metrics', () => {
  describe('filtrarUltimosDias', () => {
    const referencia = new Date('2026-07-15T12:00:00-03:00');

    it('mantém execuções dentro da janela e descarta as mais antigas', () => {
      const dentroDaJanela = criarExecucao({ id: 'dentro', dataFim: '2026-06-20T10:00:00-03:00' });
      const foraDaJanela = criarExecucao({ id: 'fora', dataFim: '2026-06-10T10:00:00-03:00' });

      const resultado = filtrarUltimosDias([dentroDaJanela, foraDaJanela], 30, referencia);

      expect(resultado).toEqual([dentroDaJanela]);
    });
  });

  describe('calcularTaxaSucesso', () => {
    it('retorna 0 quando não há execuções', () => {
      expect(calcularTaxaSucesso([])).toBe(0);
    });

    it('calcula o percentual de execuções com status SUCESSO', () => {
      const execucoes = [
        criarExecucao({ status: 'SUCESSO' }),
        criarExecucao({ status: 'SUCESSO' }),
        criarExecucao({ status: 'FALHA' }),
        criarExecucao({ status: 'PARCIAL' }),
      ];

      expect(calcularTaxaSucesso(execucoes)).toBe(50);
    });
  });

  describe('calcularTempoMedioSegundos', () => {
    it('retorna 0 quando não há execuções', () => {
      expect(calcularTempoMedioSegundos([])).toBe(0);
    });

    it('calcula a média de duração arredondada', () => {
      const execucoes = [
        criarExecucao({ duracaoSegundos: 10 }),
        criarExecucao({ duracaoSegundos: 15 }),
      ];

      expect(calcularTempoMedioSegundos(execucoes)).toBe(13);
    });
  });

  describe('calcularClienteComMaisFalhas', () => {
    it('retorna null quando não há falhas', () => {
      const execucoes = [criarExecucao({ status: 'SUCESSO' })];
      expect(calcularClienteComMaisFalhas(execucoes)).toBeNull();
    });

    it('retorna o cliente com mais falhas', () => {
      const execucoes = [
        criarExecucao({ cliente: 'BANESTES', status: 'FALHA' }),
        criarExecucao({ cliente: 'ECT', status: 'FALHA' }),
        criarExecucao({ cliente: 'ECT', status: 'FALHA' }),
      ];

      expect(calcularClienteComMaisFalhas(execucoes)).toBe('ECT');
    });

    it('em caso de empate, mantém o primeiro cliente que atingiu o maior total', () => {
      const execucoes = [
        criarExecucao({ cliente: 'TSE', status: 'FALHA' }),
        criarExecucao({ cliente: 'BANESTES', status: 'FALHA' }),
      ];

      expect(calcularClienteComMaisFalhas(execucoes)).toBe('TSE');
    });
  });

  describe('calcularExecucoesPorDia', () => {
    const referencia = new Date('2026-07-15T12:00:00-03:00');

    it('preenche todos os dias do período, com zero para dias sem execuções', () => {
      const resultado = calcularExecucoesPorDia([], 7, referencia);

      expect(resultado.length).toBe(7);
      expect(resultado.every((dia) => dia.total === 0)).toBe(true);
      expect(resultado[6].data).toBe('2026-07-15');
      expect(resultado[0].data).toBe('2026-07-09');
    });

    it('agrupa corretamente as execuções por dia', () => {
      const execucoes = [
        criarExecucao({ dataFim: '2026-07-15T08:00:00-03:00' }),
        criarExecucao({ dataFim: '2026-07-15T20:00:00-03:00' }),
        criarExecucao({ dataFim: '2026-07-14T09:00:00-03:00' }),
        criarExecucao({ dataFim: '2026-06-01T09:00:00-03:00' }),
      ];

      const resultado = calcularExecucoesPorDia(execucoes, 7, referencia);

      const hoje = resultado.find((dia) => dia.data === '2026-07-15');
      const ontem = resultado.find((dia) => dia.data === '2026-07-14');

      expect(hoje?.total).toBe(2);
      expect(ontem?.total).toBe(1);
      expect(resultado.reduce((soma, dia) => soma + dia.total, 0)).toBe(3);
    });
  });

  describe('obterExecucoesMaisRecentes', () => {
    it('ordena por dataFim decrescente e limita à quantidade pedida', () => {
      const execucoes = [
        criarExecucao({ id: 'a', dataFim: '2026-07-10T10:00:00-03:00' }),
        criarExecucao({ id: 'b', dataFim: '2026-07-15T10:00:00-03:00' }),
        criarExecucao({ id: 'c', dataFim: '2026-07-12T10:00:00-03:00' }),
      ];

      const resultado = obterExecucoesMaisRecentes(execucoes, 2);

      expect(resultado.map((execucao) => execucao.id)).toEqual(['b', 'c']);
    });
  });
});
