import { Environment } from './environment.model';

// Fase 2: execucoesUrl passa a apontar para a fonte publicada pelo TestRunner (SharePoint, GitHub privado ou API).
export const environment: Environment = {
  production: true,
  execucoesUrl: 'assets/mock-execucoes.json',
};
