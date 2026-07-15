import { EtapaExecucao } from '../../core/models/execucao.model';
import { obterConfigStatusEtapa, ordenarEtapas } from './execucao-detalhe.helpers';

function criarEtapa(parciais: Partial<EtapaExecucao>): EtapaExecucao {
  return {
    ordem: 1,
    nome: 'Etapa padrão',
    status: 'SUCESSO',
    duracaoSegundos: 5,
    ...parciais,
  };
}

describe('execucao-detalhe.helpers', () => {
  describe('obterConfigStatusEtapa', () => {
    it('retorna rótulo e classes para cada status de etapa', () => {
      expect(obterConfigStatusEtapa('SUCESSO').label).toBe('Sucesso');
      expect(obterConfigStatusEtapa('FALHA').label).toBe('Falha');
      expect(obterConfigStatusEtapa('PULADA').label).toBe('Pulada');
    });
  });

  describe('ordenarEtapas', () => {
    it('ordena as etapas pela propriedade ordem, crescente', () => {
      const etapas = [
        criarEtapa({ ordem: 3, nome: 'Terceira' }),
        criarEtapa({ ordem: 1, nome: 'Primeira' }),
        criarEtapa({ ordem: 2, nome: 'Segunda' }),
      ];

      const resultado = ordenarEtapas(etapas);

      expect(resultado.map((etapa) => etapa.nome)).toEqual(['Primeira', 'Segunda', 'Terceira']);
    });

    it('não muta o array original', () => {
      const etapas = [criarEtapa({ ordem: 2 }), criarEtapa({ ordem: 1 })];
      const copiaOriginal = [...etapas];

      ordenarEtapas(etapas);

      expect(etapas).toEqual(copiaOriginal);
    });
  });
});
