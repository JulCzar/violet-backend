import { PORT } from './config';
import server from './src';

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
