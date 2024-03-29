const HouseModel = require("../model/houseModel");

exports.listHouses = (req, res) => {
  HouseModel.find({}, "-_uid", (err, houses) => {
    if (err) res.status(404).send(err);
    else res.json(houses);
  });
};

exports.listUserHouses = (req, res) => {
  HouseModel.find({ _uid: req.params.userId }, (err, houses) => {
    if (err) res.status(404).send(err);
    else res.json(houses);
  });
};

exports.newHouse = (req, res) => {
  delete req.body._id;
  let house = new HouseModel(req.body);
  house._uid = req.params.userId;
  house.updateDate = null;
  house.insertDate = Date.now();

  house.save((err, house) => {
    if (err) res.send(err);
    else res.json({ message: "House successfully saved", house: house });
  });
};

exports.getHouse = (req, res) => {
  HouseModel.findById(req.params.houseId, "-_uid", (err, house) => {
    if (err) res.send(err);
    else res.json(house);
  });
};

exports.updateHouse = (req, res) => {
  req.body.updateDate = Date.now();
  delete req.body.insertDate;
  delete req.body._id;

  HouseModel.findOneAndUpdate(
    { _id: req.params.houseId, _uid: req.params.userId },
    req.body,
    { new: true },
    (err, house) => {
      if (err || house == null) res.json({ message: "No House Found" });
      else res.json({ message: "House successfully updated", house: house });
    }
  );
};

exports.deleteHouse = (req, res) => {
  HouseModel.remove({ _id: req.params.houseId, _uid: req.params.userId }, (err, house) => {
    if (err || house.result.n == 0) res.json({ message: "No House Found" });
    else res.json({ message: "House successfully deleted", house: house });
  });
};
