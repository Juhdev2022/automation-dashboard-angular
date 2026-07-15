import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duracao',
  standalone: true,
})
export class DuracaoPipe implements PipeTransform {
  transform(segundos: number): string {
    if (!Number.isFinite(segundos) || segundos < 0) {
      return '0s';
    }

    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segundosRestantes = Math.floor(segundos % 60);

    if (horas > 0) {
      return `${horas}h ${minutos.toString().padStart(2, '0')}m`;
    }

    if (minutos > 0) {
      return `${minutos}m ${segundosRestantes.toString().padStart(2, '0')}s`;
    }

    return `${segundosRestantes}s`;
  }
}
