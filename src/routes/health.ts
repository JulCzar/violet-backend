import { Router } from 'express';
import { HealthController } from '../controllers/health';

const healthRequests = Router();
const healthController = new HealthController();

healthRequests.get('/', (_, res) => res.json({ message: 'OK health' }));
healthRequests.get('/index', healthController.index);
healthRequests.post('/create', healthController.create);
healthRequests.get('/find/:id', healthController.find);
healthRequests.put('/update/:id', healthController.update);
healthRequests.delete('/delete/:id', healthController.destroy);

export default healthRequests;
