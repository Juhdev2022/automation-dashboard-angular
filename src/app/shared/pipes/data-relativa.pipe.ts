import { Pipe, PipeTransform } from '@angular/core';

const MINUTO = 60;
const HORA = 60 * MINUTO;
const DIA = 24 * HORA;

@Pipe({
  name: 'dataRelativa',
  standalone: true,
})
export class DataRelativaPipe implements PipeTransform {
  transform(dataIso: string): string {
    const diferencaSegundos = Math.floor((Date.now() - new Date(dataIso).getTime()) / 1000);

    if (diferencaSegundos < MINUTO) {
      return 'agora mesmo';
    }

    if (diferencaSegundos < HORA) {
      const minutos = Math.floor(diferencaSegundos / MINUTO);
      return `há ${minutos} ${minutos === 1 ? 'minuto' : 'minutos'}`;
    }

    if (diferencaSegundos < DIA) {
      const horas = Math.floor(diferencaSegundos / HORA);
      return `há ${horas} ${horas === 1 ? 'hora' : 'horas'}`;
    }

    const dias = Math.floor(diferencaSegundos / DIA);
    return `há ${dias} ${dias === 1 ? 'dia' : 'dias'}`;
  }
}
