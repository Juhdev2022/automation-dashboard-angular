import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Execucao } from '../models/execucao.model';

@Injectable({ providedIn: 'root' })
export class ExecucaoService {
  private readonly http = inject(HttpClient);

  getExecucoes(): Observable<Execucao[]> {
    return this.http.get<Execucao[]>(environment.execucoesUrl);
  }
}
