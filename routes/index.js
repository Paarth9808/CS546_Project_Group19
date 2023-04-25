import gameRoutes from './games.js'
import userRouter from './user.js';

const constructor=(app)=>{
    app.use('/games',gameRoutes);
    app.use('/user', userRouter);
    app.use('*', (req, res) => {
        res.status(404).json({error: 'Route Not found'});
      });

}

export default constructor;