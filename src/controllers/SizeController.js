const { Size } = require("../models");

const SizeController = {
  addSize: async (req, res) => {
    const { sizeName } = req.body;
    const idSize = await Size.max("id");

    try {
      const newSize = new Size({
        id: idSize + 1,
        sizeName,
      });
      await newSize.save();
      res.status(200).json(newSize);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getSize: async (req, res) => {
    try {
      const sizes = await Size.findAll();
      res.status(200).json(sizes);
    } catch (error) {
      console.log(error);

      res.status(500).json(error);
    }
  },
};
module.exports = SizeController;
