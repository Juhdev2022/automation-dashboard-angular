import { inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';

import { Execucao } from '../models/execucao.model';
import { ExecucaoService } from './execucao.service';

export type EstadoExecucoes =
  | { status: 'carregando' }
  | { status: 'erro' }
  | { status: 'sucesso'; execucoes: Execucao[] };

const ESTADO_INICIAL: EstadoExecucoes = { status: 'carregando' };

export function injetarEstadoExecucoes() {
  const execucaoService = inject(ExecucaoService);

  return toSignal(
    execucaoService.getExecucoes().pipe(
      map((execucoes): EstadoExecucoes => ({ status: 'sucesso', execucoes })),
      catchError(() => of<EstadoExecucoes>({ status: 'erro' })),
    ),
    { initialValue: ESTADO_INICIAL },
  );
}
