const uuid = require('uuid');
const { validationResult } = require('express-validator');
const httpError = require('../models/http-errors');


let DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Empire state Building',
        description: 'One of the most famous place in the world',
        location: {
            lat: 40.7484474,
            lng: -73.9871516
        },
        address: '20 W 34th St, New York, NY 10001',
        creator: 'u1'
    }
];

//Get 
const getPlaceById = (req, res, next)=>{
    const placeId = req.params.pid;
    const place = DUMMY_PLACES.find(p => {
        return p.id === placeId;
    });
    if(!place){
        throw new httpError('Could not find a place for the provided id!!', 404);
    }
    res.json({place}); //hai hek lazim tkoon {place: place} lakin el javascript lama eykoono elqiam hai nafs ba3ed w tektobhom b wa7ad zai hek {place} 3adi 
}

//Get
const getPlacesByUserId = (req, res, next)=>{
    const userId = req.params.uid;
    const places = DUMMY_PLACES.filter(p => {
        return p.creator === userId;
    });
    if(!places || places.length === 0){
        return next(
           new httpError('Could not find places for the provided userid!!', 404)
            );
    }
    res.json({places}); //hai hek lazim tkoon {place: place} lakin el javascript lama eykoono elqiam hai nafs ba3ed w tektobhom b wa7ad zai hek {place} 3adi
}

//POST Create
const createPlace = (req, res, next)=>{
const errors = validationResult(req);
if(!errors.isEmpty()){
    console.log(errors);
    throw new httpError('Invalid input please check your data!', 422);
}
  const {title, description, coordinates, address, creator} =  req.body;
  const createdPlace = {
      id: uuid.v4(),
      title,
      description,
      location: coordinates,
      address,
      creator,
  };
  DUMMY_PLACES.push(createdPlace);
  res.status(201).json(createdPlace);
}

//PATCH Update
const updatePlace = (req, res, next)=> {
    const errors = validationResult(req);
if(!errors.isEmpty()){
    console.log(errors);
    throw new httpError('Invalid input please check your data!', 422);
}
    const {title, description} =  req.body;
    const placeId = req.params.pid;
    const updatedPlace = {...DUMMY_PLACES.find(p => p.id === placeId)}
    const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId);
    updatedPlace.title = title;
    updatedPlace.description = description;
    DUMMY_PLACES[placeIndex] = updatedPlace;
    res.status(200).json({place: updatedPlace}); 
};

//Delete
const deletePlace = (req, res, next)=> {
    const placeId = req.params.pid;
    if(!DUMMY_PLACES.find(p => p.id === placeId)){
        throw new httpError('Could not find a place for that id!!', 404);
    }
    DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== placeId);
    res.status(200).json({message: 'Delete a place'});
};


exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;