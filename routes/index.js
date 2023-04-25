import userRouter from './comment.js';

const constructorMethod = (app) => {
    app.use('/', userRouter);
    app.use('*', (req, res) => {
      res.status(404).json({error: 'Route Not found'});
    });
  };
  
  export default constructorMethod;
