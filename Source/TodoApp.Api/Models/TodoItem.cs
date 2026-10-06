namespace TodoApp.Api.Models
{
    public class TodoItem
    {
        public int Id { get; set; }
        public string ItemName { get; set; } = string.Empty;
        public DateTime Created { get; set; }
    }
}
