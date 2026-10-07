using System.Collections.Concurrent;
using TodoApp.Api.Models;

namespace TodoApp.Api.Services
{
    public class TodoService : ITodoService
    {
        private readonly ConcurrentDictionary<int, TodoItem> _items = new();
        private int _lastId;

        public List<TodoItem> GetTodoList()
        {
            return _items.Values.OrderBy(item => item.Id).ToList();
        }

        public TodoItem CreateTodo(CreateTodoRequest request)
        {
            var newItem = new TodoItem
            {
                Id = Interlocked.Increment(ref _lastId),
                ItemName = request.ItemName ?? string.Empty,
                Created = DateTime.UtcNow
            };
            _items[newItem.Id] = newItem;
            return newItem;
        }

        public bool DeleteTodo(int id)
        {
            return _items.TryRemove(id, out _);
        }
    }
}
