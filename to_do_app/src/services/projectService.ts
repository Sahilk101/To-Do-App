import { PrismaClient, Project, Task } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import { TaskStatus } from '@prisma/client';

const prisma = new PrismaClient();

export const getProjects = (userId: string) => {
    const data = prisma.project.findMany({
     where: {
        created_by: userId
      },
      select: {
        id: true,
        name : true,
        description : true
      }
    });
    return data;
};

export const createProject = async ({ name, description, userId }: { name: string, description: string, userId: string }) => {
    try {
        const newProject = await prisma.project.create({
          data: {
            name,
            description,
            created_by: userId
         }
        });
        return newProject;
    } catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Error creating project');
    }
};

export const createTask = async ({ title, description, projectId, userId }: { title: string, description: string, projectId: number, userId: string }) => {
    try {
        const newTask = await prisma.task.create({
          data: {
            title,
            description,
            project_id: projectId, 
            created_by: userId
         }
        });
        return newTask;
    } catch (error) {
        console.error(error);
        throw new ApiError(httpStatus.BAD_REQUEST, 'Error creating task');
    }
};
  
export const editTask = async ({ taskId, status }: { taskId: number,status: TaskStatus }) => {
    try {
        console.log(taskId, status);
        const updatedTask = await prisma.task.update({
          where: {
            id: taskId
          },
          data: {
            status
          }
        });
        return updatedTask;
    } catch (error) {
        console.error(error);
        throw new ApiError(httpStatus.BAD_REQUEST, 'Error updating task');
    }
};


export const getTaskList = async (project_id: number, userId: string) => {
  const data = prisma.task.findMany({
   where: {
     project_id: project_id,
     created_by: userId
    },
    select: {
      id: true ,
      title : true,
      description : true,
      status: true,
    }
  });
  return data;
};

export const deleteTaskById = async (taskId: number, project_id: number) => {
  try {
    const deletedTask = await prisma.task.delete({
      where: {
        id: taskId,
        project_id: project_id
      }
    });
    return deletedTask;
  } catch (error) {
    console.error(error);
    throw new ApiError(httpStatus.BAD_REQUEST, 'Error deleting task');
  }
};

export const generateMarkdown = async (userId: string, project_id:number,) => {
  const project = await getProject(project_id);
  const tasks = await getTaskList(project_id, userId);
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED');
  const pendingTasks = tasks.filter(t => t.status !== 'COMPLETED');
  const summary = `# Project name - ${project.name} \n\n## Summary\n\n${completedTasks.length} / ${tasks.length} tasks completed\n\n## Pending Tasks\n\n${pendingTasks.map(t => `- [ ] ${t.title}`).join('\n')}\n\n## Completed Tasks\n\n${completedTasks.map(t => `- [x] ${t.title}`).join('\n')}`;
  return summary;
};

 export const getProject = async(project_id: number) => {
  const data = prisma.project.findUniqueOrThrow({
   where: {
      id: project_id
    },
    select: {
      id: true,
      name : true,
      description : true,
      created_by: true
    }
  });
  return data;
};
    