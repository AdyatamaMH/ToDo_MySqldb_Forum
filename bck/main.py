from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import mysql.connector


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET","POST","PUT","DELETE"],
    allow_headers=["*"],
)


db_config = {
    'host': '127.0.0.1',
    'user': 'root',
    'password': 'Labmda767',
    'database': 'todoschema'
}


connection = mysql.connector.connect(**db_config)


cursor = connection.cursor()


class Task(BaseModel):
    id: int
    title: str
    status: bool


@app.get("/users/{user_id}/tasks/", response_model=List[Task])
async def get_user_tasks(user_id: int):
    query = "SELECT id, title, status FROM tasks WHERE user_id = %s"
    cursor.execute(query, (user_id,))
    user_tasks = cursor.fetchall()
    if not user_tasks:
        raise HTTPException(status_code=404, detail="User tasks not found")
    return user_tasks

@app.get("/tasks/", response_model=List[Task])
async def get_tasks():
    query = "SELECT id, title, status FROM tasks"
    cursor.execute(query)
    tasks = cursor.fetchall()
    return tasks

@app.get("/tasks/{task_id}", response_model=Task)
async def get_task(task_id: int):
    query = "SELECT id, title, status FROM tasks WHERE id = %s"
    cursor.execute(query, (task_id,))
    task = cursor.fetchone()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@app.post("/tasks/", response_model=Task)
async def create_task(task: Task):
    query = "INSERT INTO tasks (title, status) VALUES (%s, %s)"
    cursor.execute(query, (task.title, task.status))
    connection.commit()
    task.id = cursor.lastrowid
    return task

@app.put("/tasks/{task_id}", response_model=Task)
async def update_task(task_id: int, task: Task):
    query = "UPDATE tasks SET title = %s, status = %s WHERE id = %s"
    cursor.execute(query, (task.title, task.status, task_id))
    connection.commit()
    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@app.delete("/tasks/{task_id}")
async def delete_task(task_id: int):
    query = "DELETE FROM tasks WHERE id = %s"
    cursor.execute(query, (task_id,))
    connection.commit()
    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"message": "Task deleted successfully"}
