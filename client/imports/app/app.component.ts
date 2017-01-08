import { Component, style } from '@angular/core';
import appTemplate from './app.component.html';
import universalStyle from './app.component.scss';

@Component({
  selector: 'app',
  template: appTemplate,
  styles:[universalStyle]
})
export class AppComponent {
  constructor() {}
}