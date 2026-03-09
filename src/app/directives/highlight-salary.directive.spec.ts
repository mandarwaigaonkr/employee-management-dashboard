import { ElementRef, Renderer2 } from '@angular/core';
import { HighlightSalaryDirective } from './highlight-salary.directive';

describe('HighlightSalaryDirective', () => {
  it('should create an instance', () => {
    const elementRef = new ElementRef(document.createElement('td'));
    const renderer = jasmine.createSpyObj<Renderer2>('Renderer2', ['setStyle', 'removeStyle']);
    const directive = new HighlightSalaryDirective(elementRef, renderer);
    expect(directive).toBeTruthy();
  });
});
