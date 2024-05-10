from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import mysql.connector
from fastapi.responses import JSONResponse

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
    user_id: int

class User(BaseModel):
    email: str
    password: str

@app.post("/register/", response_model=User)
async def register(user: User):
    query = "SELECT * FROM todoschema.authdetails WHERE email = %s"
    cursor.execute(query, (user.email,))
    existing_user = cursor.fetchone()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already exists")

    insert_query = "INSERT INTO todoschema.authdetails (email, password) VALUES (%s, %s)"
    cursor.execute(insert_query, (user.email, user.password))
    connection.commit()
    return user

@app.post("/login/")
async def login(user: User):
    login_query = "SELECT id FROM todoschema.authdetails WHERE email = %s AND password = %s"
    cursor.execute(login_query, (user.email, user.password))
    user_id = cursor.fetchone()
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {"user_id": user_id[0], "message": "Login successful"}

@app.get("/auth/check")
async def auth_check():
    user_authenticated = True
    if user_authenticated:
        return {"authenticated": True, "user": {"email": "user@example.com"}}
    else:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not authenticated")
    

@app.get("/tasks/", response_model=List[Task])
async def get_tasks(user_id: int = Depends(login)):
    query = "SELECT id, title, status FROM todoschema.tasks WHERE user_id = %s"
    cursor.execute(query, (user_id,))
    tasks = cursor.fetchall()
    task_list = [{"id": task[0], "title": task[1], "status": task[2], "user_id": user_id} for task in tasks]
    return task_list

@app.get("/tasks/{task_id}", response_model=Task)
async def get_task(task_id: int):
    query = "SELECT id, title, status, user_id FROM todoschema.tasks WHERE id = %s"
    cursor.execute(query, (task_id,))
    task = cursor.fetchone()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"id": task[0], "title": task[1], "status": task[2], "user_id": task[3]}

@app.post("/tasks/", response_model=Task)
async def create_task(task: Task):
    query = "INSERT INTO todoschema.tasks (title, status, user_id) VALUES (%s, %s, %s)"
    cursor.execute(query, (task.title, task.status, task.user_id))
    connection.commit()
    task.id = cursor.lastrowid
    return task

@app.put("/tasks/{task_id}", response_model=Task)
async def update_task(task_id: int, task: Task):
    query = "UPDATE todoschema.tasks SET title = %s, status = %s WHERE id = %s"
    cursor.execute(query, (task.title, task.status, task_id))
    connection.commit()
    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Task not found")
    task.id = task_id
    return task

@app.delete("/tasks/{task_id}")
async def delete_task(task_id: int):
    query = "DELETE FROM todoschema.tasks WHERE id = %s"
    cursor.execute(query, (task_id,))
    connection.commit()
    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"message": "Task deleted successfully"}
