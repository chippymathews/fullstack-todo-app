using TodoApp.Api.Models;

namespace TodoApp.Api.Services
{
    public interface ITodoService
    {
        public List<TodoItem> GetAll();
        public TodoItem Create(CreateTodoRequest request);
        public bool Delete(int id);
    }
}
