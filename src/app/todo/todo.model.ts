export class Todo {

    constructor(
        public id: Number,
        public description: String,
        public done: Boolean,
        public date: Date
    ) { }

    public toString = (): string => {
        return `Todo (id: ${this.id}, description: ${this.description}, done: ${this.done}, date: ${this.date})`;
    }
}