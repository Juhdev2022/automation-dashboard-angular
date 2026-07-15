# Automation Dashboard (Angular)

Dashboard web para consulta de resultados de execuções de testes automatizados (ex: testes de transferência de arquivos via SFTP/FTP/FTPS). Consolida métricas gerais, oferece uma lista filtrável de execuções e o detalhe individual de cada uma, com a timeline das etapas executadas.

Projeto de portfólio e de aprendizado — primeiro projeto em Angular, construído a partir de uma base sólida em React/TypeScript.

## Como rodar localmente

Pré-requisitos: Node 20+ e npm.

```bash
npm install
npm start
```

Abra `http://localhost:4200`. A aplicação recarrega automaticamente a cada alteração nos arquivos-fonte.

## Rodando os testes

```bash
npm test
```

Em modo não-interativo (CI):

```bash
npx ng test --watch=false --browsers=ChromeHeadless
```

## Build de produção

```bash
npm run build
```

Os artefatos ficam em `dist/automation-dashboard-angular`.

## Estrutura de pastas

```
src/app/
├── core/
│   ├── models/               # tipos de domínio (Execucao, EtapaExecucao, enums de status)
│   └── services/             # ExecucaoService (HTTP) e o estado compartilhado de carregamento
├── features/                 # uma pasta por tela
│   ├── dashboard/
│   ├── execucoes-list/
│   └── execucao-detalhe/
├── shared/
│   ├── components/            # StatusBadgeComponent, ClienteBadgeComponent
│   └── pipes/                 # DuracaoPipe, DataRelativaPipe
├── app.routes.ts               # rotas com lazy loading
└── app.config.ts
```

Cada feature segue o mesmo padrão: um `*.component.ts` fino (orquestra estado via Signals), um `*.component.html` separado, e — quando há cálculo não-trivial — um arquivo `*.helpers.ts` (ou `*.metrics.ts`) com funções puras testáveis, isoladas do Angular.

## Decisões arquiteturais principais

- **Signals-first.** Todo estado reativo dos componentes usa `signal`/`computed`/`effect`, sem gerenciamento manual de subscriptions. RxJS aparece só na borda com HTTP (`ExecucaoService`), convertido para Signal via `toSignal()` assim que entra no componente.
- **Discriminated union para estado assíncrono.** Em vez de variáveis independentes (`loading`, `error`, `data`), o carregamento é modelado como um único tipo — `{status: 'carregando'} | {status: 'erro'} | {status: 'sucesso', execucoes}` (`core/services/execucoes-estado.ts`) — o que torna estados inconsistentes (ex: `loading` e `error` simultâneos) irrepresentáveis, não apenas evitados por convenção.
- **Cálculo extraído em funções puras.** Filtros, ordenação, paginação e métricas (`dashboard.metrics.ts`, `execucoes-list.helpers.ts`, `execucao-detalhe.helpers.ts`) vivem fora dos componentes, testáveis diretamente, sem `TestBed`.
- **Gráfico em SVG manual.** Sem biblioteca de charting (decisão de escopo do projeto) — o gráfico de execuções por dia usa `viewBox` para ser responsivo sem media queries.
- **Tokens semânticos no Tailwind.** Cores de status e de cliente são registradas como tokens nomeados (`status-sucesso`, `cliente-banestes`, etc.) em `tailwind.config.js`, em vez de classes de cor genéricas — mantém coerência visual e um ponto único de mudança.
- **Fonte de dados configurável via `environment.ts`.** Hoje aponta para um JSON mockado em `src/assets`; a troca para uma fonte real é uma mudança de uma linha (ver abaixo).

## Como trocar a fonte de dados (mock → real)

Editar `execucoesUrl` em `src/environments/environment.ts` (produção) e `src/environments/environment.development.ts` (desenvolvimento) para apontar para a URL real. O contrato de dados esperado está em `src/app/core/models/execucao.model.ts` (interfaces `Execucao` e `EtapaExecucao`).

> Atenção: `environment.ts` é substituído por `environment.development.ts` em builds de desenvolvimento via `fileReplacements` (`angular.json`). Qualquer tipo compartilhado entre os dois arquivos deve viver em um terceiro arquivo (`environment.model.ts`) — importar um tipo de `environment.ts` dentro de `environment.development.ts` cria uma referência circular nesse mecanismo de substituição.

## Próximas fases

- **Fase 2 (backlog, sem prazo definido):** integração real com o sistema que gera esses dados de execução — publicar o JSON de resultados em um local acessível e apontar `execucoesUrl` para lá. Nenhuma decisão da fase atual assume que essa integração vai acontecer; o projeto tem valor próprio como aprendizado e portfólio.
- Autenticação, disparo de novas execuções pelo dashboard e pipeline de CI/CD estão fora do escopo deste projeto.
