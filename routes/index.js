import userRouter from './user.js';
import gameRoutes from './games.js'

const constructor = (app) => {
    app.use('/', userRouter);
    app.use('/games', gameRoutes);
    app.use('*', (req, res) => {
      res.status(404).json({error: 'Route Not found'});
    });
  };
  
  export default constructor;
