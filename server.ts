import { PORT } from './config';
import app from './src';

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
