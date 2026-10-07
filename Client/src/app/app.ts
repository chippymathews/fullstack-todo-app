import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TodoApi, TodoItem } from './todo-api';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  todos: TodoItem[] = [];
  newTodo = '';
  isLoading = true;
  errorMessage = '';
  successMessage = '';

  constructor(
    private readonly todoApi: TodoApi,
    private readonly changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.todoApi.getTodos().subscribe({
      next: (todos) => {
        this.todos = todos;
        this.isLoading = false;
        this.changeDetector.markForCheck();
      },
      error: () => {
        this.errorMessage = 'Could not load tasks. Check that the API is running.';
        this.isLoading = false;
        this.changeDetector.markForCheck();
      },
    });
  }

  addTodo(): void {
    const itemName = this.newTodo.trim();

    if (!itemName) {
      this.errorMessage = 'Enter a task before adding it.';
      this.successMessage = '';
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    this.todoApi.addTodo(itemName).subscribe({
      next: (todo) => {
        this.todos = [...this.todos, todo];
        this.newTodo = '';
        this.successMessage = 'Task added successfully.';
        this.changeDetector.markForCheck();
      },
      error: () => {
        this.errorMessage = 'Could not add task. Please try again.';
        this.changeDetector.markForCheck();
      },
    });
  }

  deleteTodo(todo: TodoItem): void {
    this.errorMessage = '';
    this.successMessage = '';

    this.todoApi.deleteTodo(todo.id).subscribe({
      next: () => {
        this.todos = this.todos.filter((item) => item.id !== todo.id);
        this.successMessage = 'Task deleted successfully.';
        this.changeDetector.markForCheck();
      },
      error: () => {
        this.errorMessage = 'Could not delete task. Please try again.';
        this.changeDetector.markForCheck();
      },
    });
  }
}