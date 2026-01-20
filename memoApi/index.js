import express from 'express';
import memoRouter from './memos.js';  

const app = express();  

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} ${JSON.stringify(req.body)}`);
    next();
});

app.use(express.json());

app.use('/memos', memoRouter);

app.use((req, res) => res.status(404).json({
    success: false,
    message: 'Route not found'
}));

app.listen(4000);
