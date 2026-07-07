import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Nagrik.OS Grid API Server running on port ${PORT}`);
  console.log(`🔒 Identity, Spatial Asset Registry, and AI Grid loaded`);
  console.log(`====================================================`);
});

export default server;
