
import { Directive, HostListener, Input, ElementRef, Renderer2 } from '@angular/core';

@Directive({ selector: '[rfAnimateOnClick]' })
/** on click apply animate class
 *  and remove it once animation is complete */
export class AnimateOnClickDirective {
  @Input('rfAnimateOnClick') animateClass = 'animate';

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  @HostListener('click', ['$event'])
  onClick() {
    const { el, renderer, animateClass, currentClass } = this;

    renderer.removeClass(el.nativeElement, currentClass);
    this.currentClass = animateClass || 'animate';
    renderer.addClass(el.nativeElement, animateClass || 'animate');
  }

  @HostListener('webkitAnimationEnd', ['$event'])
  @HostListener('mozAnimationEnd', ['$event'])
  @HostListener('MSAnimationEnd', ['$event'])
  @HostListener('oanimationend', ['$event'])
  @HostListener('animationend', ['$event'])
  onAnimationComplete(event) {
    const { el: { nativeElement: el }, renderer, animateClass } = this;
    renderer.removeClass(el, this.currentClass);
    this.currentClass = null;
  }

  private currentClass: string;
}
