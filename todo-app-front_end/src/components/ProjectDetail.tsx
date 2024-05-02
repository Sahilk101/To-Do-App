import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ProjectDetail.css'

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
}

interface TaskRequest {
    title: string;
    description: string;
}

const ProjectDetailPage: React.FC = () => {
  const { projectId } = useParams<'projectId'>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<TaskRequest>({ title: '', description: '' });
  console.log(projectId);

  useEffect(() => {
    fetchTasks();
  },[projectId]);

    const fetchTasks = async () => {
        console.log('Fetching tasks');
      try {
        const response = await fetch(`http://localhost:4000/v1/project/${projectId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.token}`,
          }
        });
        const data = await response.json();
        setTasks(data.data);
      } catch (error) {
        console.error('Failed to fetch tasks', error);
      }
    };
  
    const handleAddTask = async () => {
        try {
          const response = await fetch(`http://localhost:4000/v1/project/${projectId}/add-task`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.token}`,
            },
            body: JSON.stringify(newTask)
          });
          if (response.ok) {
            const data = await response.json();
            setTasks([...tasks, data.data]); 
            setNewTask({ title: '', description: '', }); 
          }
        } catch (error) {
          console.error('Failed to add task', error);
        }
      };
      
  const handleDeleteTask = async (taskId: number) => {
    try {
      const response = await fetch(`http://localhost:4000/v1/project/${projectId}/${taskId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.token}`,
          },
      });
      if (response.ok) {
        setTasks(tasks.filter(task => task.id !== taskId));
      }
    } catch (error) {
      console.error('Failed to delete task', error);
    }
  };

  const handleEditTask = async (taskId: number, status: string) => {
    const taskStatus = status ===  'COMPLETED' ? 'PENDING' : 'COMPLETED'
    try {
      const response = await fetch(`http://localhost:4000/v1/project/${projectId}/${taskId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.token}`,
        },
        body: JSON.stringify({ status: taskStatus })
      });
      if (response.ok) {
        const data = await response.json();
        setTasks(tasks.map(task => task.id === taskId ? { ...task, status: data.data.status } : task));
      }
    } catch (error) {
      console.error('Failed to edit task', error);
    }
  };

  const handleProjectSummary = async () => {
    try {
       await fetch(`http://localhost:4000/v1/project/${projectId}/summary`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.token}`,
        },
      });
      
    } catch (error) {
      console.error('Failed to edit task', error);
    }
  };

  return (
    <div className="project-details-container">
      <h1>Project Tasks</h1>
      <div>
        <input
          type="text"
          className="input-field"
          value={newTask.title}
          onChange={(e) => setNewTask({...newTask, title: e.target.value})}
          placeholder="Task Title"
        />
        <textarea
          className="textarea-field"
          value={newTask.description}
          onChange={(e) => setNewTask({...newTask, description: e.target.value})}
          placeholder="Task Description"
        />
        <button className="button" onClick={handleAddTask}>Add Task</button>
        <button className="button" onClick={() => handleProjectSummary()}>Project Summary</button>

      </div>
      {tasks.length > 0 ? (
        <div className="task-list">
          <div className="task-header">
            <span className="header-title">Title</span>
            <span className="header-description">Description</span>
            <span className="header-status">Status</span>
            <span className="header-action">Action</span>
          </div>
          {tasks.map(task => (
            <div className="task-row" key={task.id}>
              <span className="task-title">{task.title}</span>
              <span className="task-description">{task.description}</span>
              <span className="task-status">{task.status}</span>
              <span className="task-action">
                <button className="button" onClick={() => handleDeleteTask(task.id)}>Delete</button>
                <button className="button" onClick={() => handleEditTask(task.id, task.status)}>{`Mark as ${task.status ===  'COMPLETED' ? 'Pending' : 'Completed'}`}</button>
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p>No tasks found. Please add some tasks.</p>
      )}
    </div>
  );
}
export default ProjectDetailPage;
