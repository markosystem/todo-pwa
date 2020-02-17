import { Component, OnInit } from '@angular/core';
import { Todo } from './todo.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TodoRepository } from './todo.repository';
import { DatePipe } from '@angular/common';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {

  public todos: Todo[] = [];
  public form: FormGroup;
  public mode = 'list';
  public repository = new TodoRepository();

  constructor(private fb: FormBuilder, private flashMessage: FlashMessagesService, public datepipe: DatePipe) {
    this.loadValidators();
    this.init();
  }

  init() {
    this.todos = this.repository.load();
  }

  loadValidators() {
    this.form = this.fb.group({
      id: [''],
      description: ['', Validators.compose([
        Validators.minLength(3),
        Validators.maxLength(40),
        Validators.required,
      ])],
      done: ['', Validators.compose([
        Validators.required,
      ])]
    });
  }

  isValid() {
    if (this.form.invalid) {
      this.showMessageFlash('Todos os campos são obrigatórios.', 'alert-danger');
      return false;
    }
    const id = this.form.controls['id'].value;
    const description = this.form.controls['description'].value;
    if (this.todos.filter(todo => id === null && todo.description.toLocaleLowerCase() === description.toLocaleLowerCase())[0]) {
      this.showMessageFlash(`A Tarefa "${description}" já foi informada!`, 'alert-danger');
      return false;
    }
    return true;
  }

  add() {
    if (!this.isValid()) {
      return;
    }
    const objectSave = this.produceObject();
    const id = objectSave.id;
    this.repository.add(objectSave);
    this.changeMode('list');
    this.form.reset();
    this.showMessageFlash('Tarefa ' + (id === -1 ? 'adicionada' : 'atualizada') + ' com sucesso!', 'alert-success');
    this.init();
  }

  remove(todo: Todo) {
    this.repository.delete(todo);
    this.showMessageFlash('Tarefa removida com sucesso!', 'alert-success');
    this.init();
  }

  markAsDone(todo: Todo) {
    todo.done = true;
    this.repository.save();
    this.showMessageFlash('Tarefa concluída com sucesso!', 'alert-success');
    this.changeMode('list');
    this.init();
  }

  markAsUndone(todo: Todo) {
    todo.done = false;
    this.repository.save();
    this.showMessageFlash('Tarefa reaberta com sucesso!', 'alert-success');
    this.changeMode('list');
    this.init();
  }

  removelAll() {
    this.repository.deleteAll();
    this.repository.load();
    this.changeMode('list');
    this.showMessageFlash('Tarefas removidas com sucesso!', 'alert-success');
    this.init();
  }

  changeMode(mode: string) {
    if (mode === 'add') {
      this.form.reset();
    }
    this.mode = mode;
  }

  produceObject() {
    const id = this.form.controls['id'].value ? this.form.controls['id'].value : -1;
    const description = this.form.controls['description'].value;
    const done = this.form.controls['done'].value === true;
    return new Todo(id, description, done, new Date());
  }

  setDataForm(todo: Todo) {
    this.changeMode('add');
    this.form.controls['id'].setValue(todo.id);
    this.form.controls['description'].setValue(todo.description);
    this.form.controls['done'].setValue(todo.done);
  }

  showMessageFlash(msg: string, type: string) {
    this.flashMessage.show(msg, { cssClass: type, timeout: 2000 });
  }

  ngOnInit() {
  }

}
