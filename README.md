TodoApp
=======

Release 1.0 - 07 Oct 2026


Introduction
------------

TodoApp is a small task-list application built with Angular and ASP.NET Core Web API. Users can view TODO items, add a task and delete a task. The API stores items in memory, so the list is reset when the API process stops.


Installation and Requirements
-----------------------------

- .NET 10 SDK
- Node.js 22 or newer
- npm


Architecture
------------

The repository separates the browser client, API, and tests:

- `Client` - Angular single-page application
- `API/TodoApp.Api` - ASP.NET Core Web API, organized into controllers, models, and services
- `Tests/TodoApp.Tests` - API integration tests
- `TodoApp.sln` - solution file at the repository root

The Angular component manages page state and user actions. A small API service sends HTTP requests to the Web API. The API controller delegates task operations to an in-memory service.


How To Run
----------

Open two PowerShell terminals at the repository root.

In the first terminal, start the API:

```powershell
dotnet run --project .\API\TodoApp.Api\TodoApp.Api.csproj -- --urls http://localhost:5080
```

In the second terminal, install dependencies and start the Angular client with the API proxy:

```powershell
Set-Location .\Client
npm install
npm start -- --port 4201 --proxy-config .\proxy.conf.json
```

Open http://localhost:4201. Keep both terminals running. The proxy forwards requests under `/api` to `http://localhost:5080`.


Build and Test
--------------

Run the API integration tests from the repository root:

```powershell
dotnet test .\TodoApp.sln
```

Run the Angular tests and production build from the `Client` directory:

```powershell
Set-Location .\Client
npm test -- --watch=false
npm run build
```


Web Services
------------

The API base URL is `http://localhost:5080`. The TODO endpoints are:

1. Get TODO list

   Method: `GET /api/todos`

   Output: List of TODO items.

2. Create TODO item

   Method: `POST /api/todos`

   Input: JSON such as `{ "itemName": "Investigate production issue" }`.

   Output: `201 Created` and the new TODO item. The item name is required and has a maximum length of 200 chars.

3. Delete TODO item

   Method: `DELETE /api/todos/{id}`

   Output: `204 No Content` when deleted, or `404 Not Found` if the ID does not exist.


Web Application - UI
--------------------

The Angular page contains:

- A form for adding a task
- A task count and a table showing task names
- A Delete action on each task row
- Empty-list, loading, validation, error and success messages


Version Features
----------------

1.0:

- Added an Angular client for viewing, adding, and deleting TODO items.
- Added an ASP.NET Core API with in-memory task storage.
- Added API integration tests for creating, listing, and deleting tasks as well as rejecting an empty task name.
- Added a development proxy so the Angular client can call the API locally.


References
----------

- Angular framework and CLI: https://angular.dev and https://angular.dev/tools/cli
- Angular template-driven forms: https://angular.dev/guide/forms/template-driven-forms
- Angular HTTP client: https://angular.dev/guide/http
- RxJS observables: https://rxjs.dev/guide/overview


Disclaimer
----------

This application was developed for assessment purposes, so limited emphasis was placed on cosmetic features. It does not support user accounts or persistent storage; TODO items are stored in memory and are lost when the API process stops, eliminating the need for database setup. If persistent storage becomes necessary, the service can be updated to use asynchronous database operations.