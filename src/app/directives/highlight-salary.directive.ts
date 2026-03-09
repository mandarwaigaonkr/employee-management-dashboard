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
      this.renderer.setStyle(this.el.nativeElement, 'background-color', 'rgba(34, 197, 94, 0.14)');
      this.renderer.setStyle(this.el.nativeElement, 'font-weight', '600');
      this.renderer.setStyle(this.el.nativeElement, 'color', '#86efac');
      this.renderer.setStyle(this.el.nativeElement, 'border-left', '2px solid rgba(74, 222, 128, 0.7)');
    } else {
      this.renderer.removeStyle(this.el.nativeElement, 'background-color');
      this.renderer.removeStyle(this.el.nativeElement, 'font-weight');
      this.renderer.removeStyle(this.el.nativeElement, 'color');
      this.renderer.removeStyle(this.el.nativeElement, 'border-left');
    }
  }
}
