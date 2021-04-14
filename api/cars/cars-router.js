const router = require('express').Router();
const Cars = require('./cars-model');
const mw = require("./cars-middleware");


router.get('/:id', mw.checkCarId, (req, res) => {
    res.status(200).json(req.car)
});

router.post('/', mw.checkCarPayload, mw.checkVinNumberUnique, mw.checkVinNumberValid, (req, res) => {
    const newCar = req.body;
    Cars.create(newCar)
        .then(
            car => {
                res.status(201).json(car)
            }
        ).catch(err => {
            console.log(err)
            res.status(500).json(err.message);
        })
});


router.get('/', (req, res) => {
    Cars.getAll()
        .then(cars => {
            res.status(200).json(cars);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json(error.message);
        });
});

module.exports = router;
