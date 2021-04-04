const uuid = require('uuid');

const { validationResult } = require('express-validator');

const httpError = require('../models/http-errors');


let DUMMY_USERS = [
    {
        id: "u1",
        name: "Abdallah",
        email: "a@a.com",
        password: "123456"
    }
];


const getUsers = (req, res, next)=> {
    res.json({users: DUMMY_USERS});
};

const signup = (req, res, next)=> {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        throw new httpError('Invalid input please check your data!', 422);
    }
    const {name, email, password} = req.body;
    const hasUser = DUMMY_USERS.find(u => u.email === email);
    if(hasUser){
        throw new httpError('Could not creat a user because email already exists', 422);
    }
    const createdUser = {
        id: uuid.v4(),
        name,
        email,
        password,
    }
    DUMMY_USERS.push(createdUser);
    res.json({ user: createdUser });
};

const login = (req, res, next)=> {
    const {email, password} = req.body;
    const identifiedUser = DUMMY_USERS.find(u => u.email === email);
    if(!identifiedUser || identifiedUser.password !== password){
        throw new httpError('Could not identify user credential seems to wrong', 401);
    }
    res.json({message: 'Logged in'});
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;