import { EtapaExecucao, StatusEtapa } from '../../core/models/execucao.model';

export interface EtapaStatusConfig {
  label: string;
  classes: string;
}

const ETAPA_STATUS_CONFIG: Record<StatusEtapa, EtapaStatusConfig> = {
  SUCESSO: { label: 'Sucesso', classes: 'bg-status-sucesso/10 text-status-sucesso' },
  FALHA: { label: 'Falha', classes: 'bg-status-falha/10 text-status-falha' },
  PULADA: { label: 'Pulada', classes: 'bg-gray-100 text-gray-500' },
};

export function obterConfigStatusEtapa(status: StatusEtapa): EtapaStatusConfig {
  return ETAPA_STATUS_CONFIG[status];
}

export function ordenarEtapas(etapas: EtapaExecucao[]): EtapaExecucao[] {
  return [...etapas].sort((a, b) => a.ordem - b.ordem);
}
