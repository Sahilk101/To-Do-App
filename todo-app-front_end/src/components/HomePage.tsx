import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './HomePage.css'

interface Project {
  id: number;
  name: string;
  description: string;
}

const HomePage: React.FC = () => {
  const [project, setProject] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const response = await fetch('http://localhost:4000/v1/project/home', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.token}`,
      },
    });
    const data = await response.json();
    setProject(data.data);
  };

  const createProject = async () => {
    const response = await fetch('http://localhost:4000/v1/project/add-project', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.token}`,
      },
      body: JSON.stringify({
        name: projectName,
        description: projectDescription,
      })
    });
    const data = await response.json();    
    setProject([...project, data.data]);
    setShowForm(false);
  };

  return (
    <div>
      <h1>Projects</h1>
      {project ? (
        <ul>
          {project.map(project => (
           <Link to={`/projects/${project.name}/${project.id}`} key={project.id}>
           <li>
           {project.name}
           </li>
           </Link>
          ))}
        </ul>
      ) : (
        <p>Please create a project</p>
      )}
      <button onClick={() => setShowForm(!showForm)}>Create Project</button>
      {showForm && (
        <div>
          <input
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Project name"
          />
          <input
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            placeholder="Project description"
          />
          <button onClick={createProject}>Submit</button>
          
        </div>
      )}
      <button onClick={() => {
            localStorage.removeItem('token')
            navigate('/login')
          }}>Logout</button>
    </div>
  );
};

export default HomePage;
