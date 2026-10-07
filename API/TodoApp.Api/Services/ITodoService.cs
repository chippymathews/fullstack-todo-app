using TodoApp.Api.Models;

namespace TodoApp.Api.Services
{
    public interface ITodoService
    {
        public List<TodoItem> GetTodoList();
        public TodoItem CreateTodo(CreateTodoRequest request);
        public bool DeleteTodo(int id);
    }
}
