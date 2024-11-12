from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import json, logging, os
from pymongo import MongoClient

class TodoDatabase:
    def __init__(self):
        mongo_uri = f'mongodb://{os.environ["MONGO_HOST"]}:{os.environ["MONGO_PORT"]}'
        self.client = MongoClient(mongo_uri)
        self.db = self.client['test_db']
        self.todos = self.db['todos']

    def get_all_todos(self):
        return self.todos.find()

    def create_todo(self, description):
        new_todo = {"description": description}
        result = self.todos.insert_one(new_todo)
        new_todo["_id"] = str(result.inserted_id)
        return new_todo

class TodoListView(APIView):
    def __init__(self):
        self.todo_db = TodoDatabase()

    def get(self, request):
        todos = self.todo_db.get_all_todos()
        todo_list = [{"id": str(todo["_id"]), "description": todo["description"]} for todo in todos]
        return Response(todo_list, status=status.HTTP_200_OK)

    def post(self, request):
        description = request.data.get("description", "")
        if not description:
            return Response({"error": "Description is required"}, status=status.HTTP_400_BAD_REQUEST)
        new_todo = self.todo_db.create_todo(description)
        return Response({"message": "TODO created successfully", "todo": new_todo}, status=status.HTTP_201_CREATED)
