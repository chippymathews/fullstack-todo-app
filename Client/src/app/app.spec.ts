import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  let fixture: ComponentFixture<App>;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    httpTesting.expectOne('/api/todos').flush([]);
    await fixture.whenStable();
    fixture.detectChanges();
  });

  afterEach(() => httpTesting.verify());

  it('shows the TODO heading and empty state', () => {
    const page = fixture.nativeElement as HTMLElement;

    expect(page.querySelector('h1')?.textContent?.trim()).toBe('My Todo List');
    expect(page.textContent).toContain('No tasks yet.');
  });

  it('asks for a task when the form is submitted empty', () => {
    fixture.nativeElement.querySelector('form')?.dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true }),
    );
    fixture.detectChanges();

    const page = fixture.nativeElement as HTMLElement;
    expect(page.querySelector('[role="alert"]')?.textContent).toContain(
      'Enter a task before adding it.',
    );
    httpTesting.expectNone((request) => request.method === 'POST');
  });

  it('adds a task after the API confirms creation', async () => {
    const input = fixture.nativeElement.querySelector('#new-task') as HTMLInputElement;
    input.value = 'Reply to emails';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    fixture.nativeElement.querySelector('form')?.dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true }),
    );

    const request = httpTesting.expectOne('/api/todos');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ itemName: 'Reply to emails' });
    request.flush({ id: 1, itemName: 'Reply to emails', created: '2026-10-07T10:00:00Z' });
    await fixture.whenStable();
    fixture.detectChanges();

    const page = fixture.nativeElement as HTMLElement;
    expect(page.querySelector('td')?.textContent).toContain('Reply to emails');
    expect(page.textContent).toContain('Task added successfully.');
  });

  it('deletes a task after the API confirms deletion', async () => {
    const todo = { id: 2, itemName: 'Update confluence page', created: '2026-10-07T12:00:00Z' };
    fixture.componentInstance.todos = [todo];
    fixture.componentInstance.deleteTodo(todo);

    const request = httpTesting.expectOne('/api/todos/2');
    expect(request.request.method).toBe('DELETE');
    request.flush(null);
    await fixture.whenStable();
    fixture.detectChanges();

    const page = fixture.nativeElement as HTMLElement;
    expect(page.textContent).not.toContain('Update confluence page');
    expect(page.textContent).toContain('Task deleted successfully.');
  });
});