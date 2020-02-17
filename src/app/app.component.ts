import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `<mat-toolbar color="primary">
              <span>ToDo PWA</span>
            </mat-toolbar>
            <app-todo></app-todo>`,
  styles: []
})
export class AppComponent {
  title = 'todo-pwa';
}
