const express = require('express');

const app = express();

const bodyParser = require('body-parser');

const placesRoute = require('./routes/places-route');

const usersRoute = require('./routes/users-routes');

const httpError = require('./models/http-errors');

app.use(bodyParser.json());

app.use('/api/places', placesRoute);

app.use('/api/users', usersRoute);

app.use((req, res, next)=> {
    const error = new httpError('Could not find this route!!', 404);
    throw error;
});

app.use((error, req, res, next)=>{
    if(res.headerSent){
        return next(error);
    }
    res.status(error.code || 500)
    res.json({message: error.message || 'An unknown Error ocurred!!'});
});

app.listen(5000);