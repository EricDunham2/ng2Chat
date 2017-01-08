import { Component } from '@angular/core';
import homeTemplate from './home.component.html';
import homeStyle from './home.component.scss';
 
@Component({
  selector: 'home',
  template: homeTemplate,
  styles:[homeStyle]
})

export class HomeComponent{
    constructor() {}
}