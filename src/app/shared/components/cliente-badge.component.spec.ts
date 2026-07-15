import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cliente } from '../../core/models/execucao.model';
import { ClienteBadgeComponent } from './cliente-badge.component';

@Component({
  standalone: true,
  imports: [ClienteBadgeComponent],
  template: `<app-cliente-badge [cliente]="cliente" />`,
})
class HostComponent {
  cliente: Cliente = 'BANESTES';
}

describe('ClienteBadgeComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HostComponent] });
    fixture = TestBed.createComponent(HostComponent);
  });

  it('exibe o nome do cliente recebido', () => {
    fixture.componentInstance.cliente = 'TSE';
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent.trim()).toBe('TSE');
  });

  it('aplica classes específicas para clientes conhecidos', () => {
    fixture.componentInstance.cliente = 'ECT';
    fixture.detectChanges();

    const span: HTMLElement = fixture.nativeElement.querySelector('span');
    expect(span.className).toContain('text-cliente-ect');
  });

  it('aplica classes padrão para clientes não mapeados', () => {
    fixture.componentInstance.cliente = 'CLIENTE_NOVO';
    fixture.detectChanges();

    const span: HTMLElement = fixture.nativeElement.querySelector('span');
    expect(span.className).toContain('text-cliente-desconhecido');
  });
});
