import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHighlightSalary]',
  standalone: true
})
export class HighlightSalaryDirective implements OnChanges {
  @Input() salary!: number;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(): void {
    if (this.salary > 100000) {
      this.renderer.setStyle(this.el.nativeElement, 'background-color', '#e8f5e9'); // Light green
      this.renderer.setStyle(this.el.nativeElement, 'font-weight', 'bold');
      this.renderer.setStyle(this.el.nativeElement, 'color', '#2e7d32');
    } else {
      this.renderer.removeStyle(this.el.nativeElement, 'background-color');
      this.renderer.removeStyle(this.el.nativeElement, 'font-weight');
      this.renderer.removeStyle(this.el.nativeElement, 'color');
    }
  }
}
