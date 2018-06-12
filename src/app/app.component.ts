import {
  Component,
  OnInit,
  ViewEncapsulation,
  HostBinding,
  Inject,
  Renderer2
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  transition,
  trigger,
  query,
  style,
  animate,
  group,
  animateChild
} from '@angular/animations';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('routerTransition', [
      transition('* <=> *', [
        query(
          ':enter, :leave',
          style({ position: 'fixed', width: '100%'}),
          { optional: true }
        ),
        group([ // block executes in parallel
        query(':enter', [
          style({ transform: 'translateX(100%)', opacity: 0 }),
          animate('350ms 600ms ease-out', style({ transform: 'translateX(0)', opacity: 1 })),
        ], { optional: true }),
        query(':leave', [
          style({ transform: 'translateX(0%)', opacity: 1 }),
          animate('350ms 300ms ease-in', style({ transform: 'translateX(-50%)', opacity: 0 })),
        ], { optional: true })
        ])
      ], { params: { transition_durlation: '0.5s'}})
    ])
  ],
})
export class AppComponent implements OnInit {
  // @HostBinding('class.app-loading') appLoading = false;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2) {
  }

  ngOnInit() {
    setTimeout(() =>
      this.renderer.addClass(this.document.body, 'app-loaded'),  0);
  }

  getState(outlet: RouterOutlet) {
    return outlet.isActivated
      ? outlet.activatedRoute.snapshot.component['name'] : '';
  }

}
