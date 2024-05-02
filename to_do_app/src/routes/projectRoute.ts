import express from 'express';
import { home, addProject, addTask, taskList, editTaskDetails, deleteTask, exportProject } from '../controllers/projectController';
import { validateRequest } from '../middleware/validateRequest';
import { addTaskSchema , addProjectSchema, editTaskDetailsSchema} from '../utils/joiSchemas';
import auth from '../middleware/auth';

const router = express.Router();

router.get('/home',auth(), home);
router.post('/add-project',auth(), validateRequest(addProjectSchema), addProject)
router.get('/:project_id',auth(), taskList)
router.patch('/:project_id/:task_id',validateRequest(editTaskDetailsSchema), editTaskDetails)
router.delete('/:project_id/:task_id',auth(), deleteTask )
router.post('/:project_id/add-task', auth(), validateRequest(addTaskSchema), addTask)
router.get('/:project_id/summary', auth(), exportProject)


export default router;
