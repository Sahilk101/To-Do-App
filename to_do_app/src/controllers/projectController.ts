import { Request, Response } from 'express';
import {
getProjects,
createProject,
createTask,
getTaskList,
editTask,
deleteTaskById,
generateMarkdown } from '../services/projectService';

import { User } from '@prisma/client';
import httpStatus from 'http-status';
import fs from 'fs/promises';
import axios from 'axios';


export const home = async (req: Request, res: Response) => {
    const user = req.user as User;
    const userId = user?.id;
   
    try {
    const userProjects = await getProjects(userId);
    const response = {
        message: 'Projects fetched successfully',
        data: userProjects
      };
    
    if(userProjects.length === 0){
        const response = {
            message: 'Projects fetched successfully',
            data: [],
          };
        res.status(httpStatus.OK).send(response);
    } else {
        res.status(httpStatus.OK).send(response)
    }
    } catch (error) {
        res.status(httpStatus.BAD_REQUEST).send('Error getting projects');
    }
};

export const addProject = async (req: Request, res: Response) => {
    const { name, description } = req.body;
    const user = req.user as User;
    const userId = user?.id;

    try {
        const newProject = await createProject({ name, description, userId });
        const response = {
            message: 'New project created successfully',
            data: newProject
          };
        res.status(httpStatus.CREATED).send(response);
    } catch (error) {
        res.status(httpStatus.BAD_REQUEST).send('Error creating project');
    }
};

export const addTask = async (req: Request, res: Response) => {
    const { title, description } = req.body;
    const projectId = Number(req.params.project_id);
    const user = req.user as User;
    const userId = user?.id

    if(!projectId){
        res.status(httpStatus.BAD_REQUEST).send('Project id is required');
    }
    try {
        const newTask = await createTask({ title, description, projectId, userId });
        const response = {
            message: 'New task added successfully',
            data: newTask
          };
        res.status(httpStatus.CREATED).send(response);
    } catch (error) {
        console.log(error);
        res.status(httpStatus.BAD_REQUEST).send('Error adding task');
    }
};

export const taskList = async (req: Request, res: Response) => {
    const userId = '5cea3471-359b-4ac4-a38d-c4c293cd8dec';
    const project_id = Number(req.params.project_id);
    try {
    const taskList = await getTaskList(project_id, userId);
    const response = {
        message: 'Tasks fetched successfully',
        data: taskList
      };
    
    if(taskList.length === 0){
        res.status(httpStatus.OK).send("No tasks found");
    } else {
        res.status(httpStatus.OK).send(response)
    }
    } catch (error) {
        res.status(httpStatus.BAD_REQUEST).send('Error getting projects');
    }
};

export const editTaskDetails = async (req: Request, res: Response) => {
    const { status } = req.body;
    const taskId = Number(req.params.task_id);
    try {
        const updatedTask = await editTask({ taskId, status });
        const response = {
            message: 'Task updated successfully',
            data: updatedTask
          };
        res.status(httpStatus.OK).send(response);
    } catch (error) {
        console.log(error);
        res.status(httpStatus.BAD_REQUEST).send('Error updating task');
    }
};

export const deleteTask = async (req: Request, res: Response) => {
    const taskId = Number(req.params.task_id);
    const project_id =Number(req.params.project_id);
    try {
        const deletedTask = await deleteTaskById(taskId, project_id);
        const response = {
            message: 'Task deleted successfully',
            data: deletedTask
          };
        res.status(httpStatus.OK).send(response);
    } catch (error) {
        res.status(httpStatus.BAD_REQUEST).send('Error deleting task');
    }
};

export const exportProject = async (req:Request, res: Response) => {
    const projectId = Number(req.params.project_id);
    const user = req.user as User;
    const userId = user?.id
    
    try {
      const markdown = await generateMarkdown(userId,projectId);
      
      await fs.writeFile(`${projectId}.md`, markdown);
      
      res.status(httpStatus.OK).send(markdown);
    } catch (error) {
        console.log(error);
      res.status(httpStatus.BAD_REQUEST).send('Error exporting project');
    }
  };