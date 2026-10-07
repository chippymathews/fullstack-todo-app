using System.ComponentModel.DataAnnotations;

namespace TodoApp.Api.Models
{
    public class CreateTodoRequest
    {
        [Required]
        [MaxLength(200)]
        public string? ItemName { get; set; } = string.Empty;
    }
}
