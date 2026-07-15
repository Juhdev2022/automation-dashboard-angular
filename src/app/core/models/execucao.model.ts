export type Cliente = 'BANESTES' | 'ECT' | 'TSE' | string;

export type Ambiente = 'PRODUCAO' | 'HOMOLOGACAO' | 'DESENVOLVIMENTO';

export type StatusExecucao = 'SUCESSO' | 'FALHA' | 'PARCIAL' | 'EM_EXECUCAO';

export type StatusEtapa = 'SUCESSO' | 'FALHA' | 'PULADA';

export interface EtapaExecucao {
  ordem: number;
  nome: string;
  status: StatusEtapa;
  duracaoSegundos: number;
  mensagem?: string;
}

export interface Execucao {
  id: string;
  cliente: Cliente;
  ambiente: Ambiente;
  dataInicio: string;
  dataFim: string;
  duracaoSegundos: number;
  status: StatusExecucao;
  tipoTeste: string;
  etapas: EtapaExecucao[];
  totalEtapas: number;
  etapasComSucesso: number;
  observacoes?: string;
}
