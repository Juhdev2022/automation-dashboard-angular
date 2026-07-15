import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../../environments/environment';
import { Execucao } from '../models/execucao.model';
import { ExecucaoService } from './execucao.service';

describe('ExecucaoService', () => {
  let service: ExecucaoService;
  let httpMock: HttpTestingController;

  const mockExecucoes: Execucao[] = [
    {
      id: 'f47ac10b-58cc-4372-a567-0e02b2c3d001',
      cliente: 'BANESTES',
      ambiente: 'PRODUCAO',
      dataInicio: '2026-07-15T07:52:00-03:00',
      dataFim: '2026-07-15T07:52:29-03:00',
      duracaoSegundos: 29,
      status: 'EM_EXECUCAO',
      tipoTeste: 'SFTP_UPLOAD',
      totalEtapas: 5,
      etapasComSucesso: 3,
      etapas: [],
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExecucaoService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ExecucaoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve buscar as execuções via GET na URL configurada em environment', () => {
    service.getExecucoes().subscribe((execucoes) => {
      expect(execucoes).toEqual(mockExecucoes);
    });

    const req = httpMock.expectOne(environment.execucoesUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockExecucoes);
  });
});
