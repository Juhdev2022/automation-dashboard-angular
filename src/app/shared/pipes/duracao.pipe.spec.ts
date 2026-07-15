import { DuracaoPipe } from './duracao.pipe';

describe('DuracaoPipe', () => {
  const pipe = new DuracaoPipe();

  it('formata segundos menores que um minuto', () => {
    expect(pipe.transform(45)).toBe('45s');
  });

  it('formata minutos e segundos', () => {
    expect(pipe.transform(154)).toBe('2m 34s');
  });

  it('formata horas e minutos', () => {
    expect(pipe.transform(3725)).toBe('1h 02m');
  });

  it('retorna "0s" para valores negativos ou inválidos', () => {
    expect(pipe.transform(-10)).toBe('0s');
    expect(pipe.transform(NaN)).toBe('0s');
  });
});
