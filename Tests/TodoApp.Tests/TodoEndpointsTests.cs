using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using TodoApp.Api.Models;

namespace TodoApp.Tests;

public class TodoEndpointsTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public TodoEndpointsTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task Todo_can_be_created_listed_and_deleted()
    {
        var createResponse = await _client.PostAsJsonAsync("/api/todos",
            new { itemName = "Review PRs" });

        Assert.Equal(HttpStatusCode.Created, createResponse.StatusCode);

        var createdTodo = await createResponse.Content.ReadFromJsonAsync<TodoItem>();
        Assert.NotNull(createdTodo);
        Assert.Equal("Review PRs", createdTodo.ItemName);

        var listedTodos = await _client.GetFromJsonAsync<List<TodoItem>>("/api/todos");
        Assert.NotNull(listedTodos);
        Assert.Contains(listedTodos, todo => todo.Id == createdTodo.Id);

        var deleteResponse = await _client.DeleteAsync($"/api/todos/{createdTodo.Id}");
        Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);

        var remainingTodos = await _client.GetFromJsonAsync<List<TodoItem>>("/api/todos");
        Assert.NotNull(remainingTodos);
        Assert.DoesNotContain(remainingTodos, todo => todo.Id == createdTodo.Id);
    }

    [Fact]
    public async Task Create_rejects_an_empty_item_name()
    {
        var response = await _client.PostAsJsonAsync("/api/todos", new { itemName = "" });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }
}