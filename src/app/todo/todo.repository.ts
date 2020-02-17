import { Todo } from './todo.model';

export class TodoRepository {
    public todos: Todo[] = [];

    constructor() {
        this.load();
    }

    generateId() {
        const id = this.todos.reduce((max, item) => item.id > max ? item.id : max, 0);
        return Number(id) + 1;
    }

    public add(todo: Todo) {
        if (todo.id === -1) {
            todo.id = this.generateId();
            this.todos.push(todo);
        } else {
            const index = this.todos.indexOf(this.get(todo.id));
            this.todos.splice(index, 1, todo);
        }
        this.save();
    }

    public delete(todo: Todo) {
        const index = this.todos.indexOf(todo);
        if (index !== -1) {
            this.todos.splice(index, 1);
            this.save();
        }
    }

    public deleteAll() {
        localStorage.removeItem('todos');
    }

    public save() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    public load() {
        const data = localStorage.getItem('todos');
        this.todos = data ? JSON.parse(data) : [];
        return this.todos;
    }

    public get(id: Number) {
        const item = this.todos.filter(todo => todo.id === id);
        return item[0];
    }

}