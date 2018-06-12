import { Directive, HostListener, HostBinding} from '@angular/core';

@Directive({ selector: '[rfTabNavigation]' })
/** detects tab event and adds keyboard-interaction class to element 
 * and removes it on mousemove event */
export class TabNavigationDirective {

  @HostBinding('class.keyboard-interaction') isTabbed = false;

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Tab' && !this.isTabbed) {
      this.isTabbed = true;
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isTabbed) {
      this.isTabbed = false;
    }
  }
}
