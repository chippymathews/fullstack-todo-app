import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface TodoItem {
  id: number;
  itemName: string;
  created: string;
}

@Injectable({ providedIn: 'root' })
export class TodoApi {
  private readonly url = '/api/todos';

  constructor(private readonly http: HttpClient) {}

  getTodos(): Observable<TodoItem[]> {
    return this.http.get<TodoItem[]>(this.url);
  }

  addTodo(itemName: string): Observable<TodoItem> {
    return this.http.post<TodoItem>(this.url, { itemName });
  }

  deleteTodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}