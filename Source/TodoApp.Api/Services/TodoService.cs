using System.Collections.Concurrent;
using TodoApp.Api.Models;

namespace TodoApp.Api.Services
{
    public class TodoService : ITodoService
    {
        private readonly ConcurrentDictionary<int, TodoItem> _items = new();
        private int _lastId;

        public List<TodoItem> GetAll()
        {
            return _items.Values.OrderBy(item => item.Id).ToList();
        }

        public TodoItem Create(CreateTodoRequest request)
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

        public bool Delete(int id)
        {
            return _items.TryRemove(id, out _);
        }
    }
}
