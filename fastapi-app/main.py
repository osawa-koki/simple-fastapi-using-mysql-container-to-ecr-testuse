import os
from typing import Union

from fastapi import FastAPI
import mysql.connector
from pydantic import BaseModel


class DatabaseRequest(BaseModel):
    database: str


app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}


@app.get("/databases")
def get_databases():
    try:
        conn = mysql.connector.connect(
            host=os.getenv("DB_HOST"),
            port=os.getenv("DB_PORT"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            database=os.getenv("DB_DATABASE")
        )

        cursor = conn.cursor()
        cursor.execute("SHOW DATABASES;")
        return {"databases": cursor.fetchall()}
    except Exception as e:
        return {"error": str(e)}


@app.post("/databases")
def create_database(database: DatabaseRequest):
    try:
        db_name = database.database
        conn = mysql.connector.connect(
            host=os.getenv("DB_HOST"),
            port=os.getenv("DB_PORT"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
        )

        cursor = conn.cursor()
        cursor.execute(f"CREATE DATABASE {db_name};")
        return {"message": f"Database {db_name} created"}
    except Exception as e:
        return {"error": str(e)}
