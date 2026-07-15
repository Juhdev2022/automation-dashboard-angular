import { DataRelativaPipe } from './data-relativa.pipe';

describe('DataRelativaPipe', () => {
  const pipe = new DataRelativaPipe();
  const agora = new Date('2026-07-15T12:00:00-03:00');

  beforeEach(() => {
    jasmine.clock().install();
    jasmine.clock().mockDate(agora);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('retorna "agora mesmo" para instantes recentes', () => {
    const dataIso = new Date(agora.getTime() - 10 * 1000).toISOString();
    expect(pipe.transform(dataIso)).toBe('agora mesmo');
  });

  it('retorna minutos decorridos', () => {
    const dataIso = new Date(agora.getTime() - 5 * 60 * 1000).toISOString();
    expect(pipe.transform(dataIso)).toBe('há 5 minutos');
  });

  it('retorna horas decorridas', () => {
    const dataIso = new Date(agora.getTime() - 3 * 60 * 60 * 1000).toISOString();
    expect(pipe.transform(dataIso)).toBe('há 3 horas');
  });

  it('retorna dias decorridos', () => {
    const dataIso = new Date(agora.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString();
    expect(pipe.transform(dataIso)).toBe('há 2 dias');
  });
});
