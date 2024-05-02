# To Do App
To Do App developed using React, Node.js, Typescript, PostgreSQL, ORM - Prisma, and JWT.

Features
*User registration and login
*User can create multiple projects
*User can add tasks to a project
*Mark existing tasks as completed or pending
*Delete existing tasks

# Getting Started

### Prerequisites

- Node.js and npm installed
- PostgreSQL installed and running

### Installation

1. Clone the repository: 

```bash
git clone 'git@github.com:Sahilk101/To-Do-App.git'

npm install -     Install dependencies

Set up environment variables:
DATABASE_URL="postgresql://user:password@localhost:5432/todo"
JWT_SECRET='secret'


npm run dev - start server


# API Endpoints

This project has several API endpoints that handle different functionalities. Below is a brief description of each endpoint:

1. `POST /register`: This endpoint is used for user registration. It validates the request using the `registerSchema`.

2. `POST /login`: This endpoint is used for user login. It validates the request using the `loginSchema`.

3. `GET /home`: This endpoint is used to retrieve the home page. It requires authentication.

4. `POST /add-project`: This endpoint is used to add new projects. It requires authentication and validates the request using the `addProjectSchema`.

5. `GET /:project_id`: This endpoint is used to retrieve a list of tasks for a specific project. It requires authentication.

6. `PATCH /:project_id/:task_id`: This endpoint is used to edit the status of a specific task. It validates the request using the `editTaskDetailsSchema`.

7. `DELETE /:project_id/:task_id`: This endpoint is used to delete a specific task. It requires authentication.

8. `POST /:project_id/add-task`: This endpoint is used to add a new task to a specific project. It requires authentication and validates the request using the `addTaskSchema`.

9. `GET /":project_id/summary` : This endpoint is used to get the summary of project. Completed and pending task details are fetched and a markdown file is created in the local with the project summary details.Authentication is required.
