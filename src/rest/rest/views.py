from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import json, logging, os
from pymongo import MongoClient

# Set up MongoDB connection
mongo_uri = 'mongodb://' + os.environ["MONGO_HOST"] + ':' + os.environ["MONGO_PORT"]
db = MongoClient(mongo_uri)['test_db']

class TodoListView(APIView):

    def get(self, request):
        todos = db.todos.find()  
        todo_list = [{"id": str(todo["_id"]), "description": todo["description"]} for todo in todos]
        return Response(todo_list, status=status.HTTP_200_OK)
        
    def post(self, request):
        description = request.data.get("description", "")
        if not description:
            return Response({"error": "Description is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        new_todo = {"description": description}
        result = db.todos.insert_one(new_todo)
        new_todo["_id"] = str(result.inserted_id)  
        
        return Response({"message": "TODO created successfully", "todo": new_todo}, status=status.HTTP_201_CREATED)
