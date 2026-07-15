import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusExecucao } from '../../core/models/execucao.model';
import { StatusBadgeComponent } from './status-badge.component';

@Component({
  standalone: true,
  imports: [StatusBadgeComponent],
  template: `<app-status-badge [status]="status" />`,
})
class HostComponent {
  status: StatusExecucao = 'SUCESSO';
}

describe('StatusBadgeComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HostComponent] });
    fixture = TestBed.createComponent(HostComponent);
  });

  it('exibe o rótulo correspondente ao status', () => {
    fixture.componentInstance.status = 'FALHA';
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent.trim()).toBe('Falha');
  });

  it('aplica a classe de cor correspondente ao status', () => {
    fixture.componentInstance.status = 'EM_EXECUCAO';
    fixture.detectChanges();

    const span: HTMLElement = fixture.nativeElement.querySelector('span');
    expect(span.className).toContain('text-status-em-execucao');
  });
});
