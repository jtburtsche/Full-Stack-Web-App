import 'dotenv/config';
import * as exercises from './exercises_model.mjs';
import express from 'express';

const PORT = process.env.PORT;

const app = express();

app.use(express.json());


app.post('/exercises', (req, res) => {
    exercises.createExercises(req.body.name, req.body.reps, req.body.weight, req.body.unit, req.body.date)
        .then(exercise => {


            if (req.body.reps <= 0 ){
                res.status(400).json({ Error: 'Invalid Request' });
            }
            else if (isDateValid(req.body.date) != true){
                res.status(400).json({ Error: 'Invalid Request' })
            } 
            else if (req.body.weight <= 0 ){
                res.status(400).json({ Error: 'Invalid Request' });
            }
            else if (isUnitValid(req.body.unit) !=true){
                res.status(400).json({ Error: 'Invalid Request' });
            }
            else {
                res.status(201).json(exercise);
            }
        })
        .catch(error => {
            console.error(error);

            res.status(400).json({ Error: 'Invalid Request' });
        });
});



app.get('/exercises/:_id', (req, res) => {
    const exercisesID = req.params._id
    exercises.findExerciseByID(exercisesID)
    .then(exercise => {
        if (exercise !==null) {
            res.json(exercise)
        } else{
            res.status(404).json({Error : 'Resource not found'})
        }
    })
    .catch(error => {
        console.error(error);

        res.status(400).json({ Error: 'Request failed' });
    });
});


app.get('/exercises', (req, res) => {
    let filter = {};

    exercises.findExercises(filter)

    .then(exercises => {
        res.json(exercises)
   
        })
    
    .catch(error => {
        console.error(error);

        res.status(400).json({ Error: 'Request failed' });
    });
    
});



app.put('/exercises/:_id', (req, res) => {
    exercises.replaceExercise(req.params._id, req.body.name, req.body.reps, req.body.weight, req.body.unit, req.body.date)
        .then(numUpdated => {

            if (req.body.reps <= 0 ){
                res.status(400).json({ Error: 'Invalid Request' });
            }
            else if (isDateValid(req.body.date) != true){
                res.status(400).json({ Error: 'Invalid Request' })
            } 
            else if (req.body.weight <= 0 ){
                res.status(400).json({ Error: 'Invalid Request' });
            }
            else if (isUnitValid(req.body.unit) !=true){
                res.status(400).json({ Error: 'Invalid Request' });
            }

            else if (numUpdated === 1){
            res.json({_id: req.params._id, name: req.body.name, reps: req.body.reps, weight: req.body.weight, unit: req.body.unit, date: req.body.date})
        } else {
            res.status(404).json({Error: 'Resource not found'})
        }
        })


    .catch(error => {
        console.error(error);

        res.status(400).json({ Error: 'Request failed' });
    });
});


app.delete('/exercises/:_id', async (req, res) => {
    try{
        const deletedCount = await exercises.deleteByID(req.params._id)
        if (deletedCount === 1) {
            res.status(204).send();

        } 
        else if (deletedCount=== undefined){
            res.status(204).send();
        }

        else {
            res.status(404).json({ Error: 'Resource not found'})
        }
        
    } catch(error) {
        console.error(error);
        res.send({ error: 'Request failed'})}
    })


function isDateValid(date) {
    // Test using a regular expression. 
    // To learn about regular expressions see Chapter 6 of the text book
    const format = /^\d\d-\d\d-\d\d$/;
    return format.test(date);
}
function isUnitValid(unit) {
    if (unit == "lbs"){
        return true
    }
    else if (unit == "kgs"){
        return true
    }
    else{
        return false
    }
}

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});