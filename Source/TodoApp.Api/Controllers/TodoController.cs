using Microsoft.AspNetCore.Mvc;
using TodoApp.Api.Models;
using TodoApp.Api.Services;

namespace TodoApp.Api.Controllers
{
    [ApiController]
    [Route("api/todos")]
    [Produces("application/json")]
    public class TodoController : ControllerBase
    {
        private readonly ITodoService _todoService;
        private readonly ILogger<TodoController> _logger;

        public TodoController(ITodoService todoService, ILogger<TodoController> logger)
        {
            _todoService = todoService;
            _logger = logger;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public ActionResult<List<TodoItem>> GetAll()
        {
            return Ok(_todoService.GetAll());
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<TodoItem> Create([FromBody] CreateTodoRequest request)
        {
            var item = _todoService.Create(request);
            _logger.LogInformation("Created todo {TodoId}", item.Id);

            return Created($"/api/todos/{item.Id}", item);
        }

        [HttpDelete("{id:int}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult Delete(int id)
        {
            if (! _todoService.Delete(id))
            {
                return NotFound();
            }

            _logger.LogInformation("Deleted todo {TodoId}", id);
            return NoContent();
        }
    }
}