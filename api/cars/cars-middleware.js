const Cars = require("./cars-model");
const vinValidator = require('vin-validator');


const checkCarId = async (req, res, next) => {
  // DO YOUR MAGIC
  const { id } = req.params;
  try {
    const car = await Cars.getById(id);
    if (!car) {
      res.status(404).json({ message: `car with id ${id} is not found` })
    } else {
      req.car = car
      next()
    }
  } catch (e) {
    res.status(500).json(e.message)
  }
}

const checkCarPayload = (req, res, next) => {
  // DO YOUR MAGIC
  const body = req.body;
  if (!body) {
    res.status(400).json({ message: "Body is missing" })
  } else if (!body.vin) {
    res.status(400).json({ message: `vin is missing` })
  } else if (!body.make) {
    res.status(400).json({ message: `make is missing` })
  } else if (!body.model) {
    res.status(400).json({ message: `model is missing` })
  } else if (!body.mileage) {
    res.status(400).json({ message: `mileage is missing` })
  } else {
    next()
  }

}

const checkVinNumberValid = (req, res, next) => {
  // DO YOUR MAGIC
  var isValidVin = vinValidator.validate(req.body.vin);
  if (isValidVin === true) {
    next()
  } else {
    res.status(400).json({ message: `vin ${req.body.vin} is invalid` })
  }
}

const checkVinNumberUnique = async (req, res, next) => {
  // DO YOUR MAGIC
  const vin = req.body.vin;
  const { id } = req.params
  const cars = await Cars.getAll();
  let vinTaken = false;

  cars.forEach(element => {
    if (element.vin == vin && element.id != id) {
      vinTaken = true;
    }
  });

  vinTaken ? res.status(400).json({ message: `vin ${vin} already exists` }) : next()
}

module.exports = {
  checkCarId,
  checkCarPayload,
  checkVinNumberUnique,
  checkVinNumberValid
}