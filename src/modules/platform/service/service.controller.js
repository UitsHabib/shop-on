const service = require("./service.model");
const {makeCustomSlug} = require(path.path.join(process.cwd(), "src/modules/platform/service/service.slug.js"));

const getServices = async (req, res) => {
  try {
    const services = await service.findAll();

    res.status(200).send(services);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error!");
  }
};

const getService = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await service.findOne({
      where: {
        id,
      },
    });
    if (!service) return res.status(404).send("service not found!");

    res.status(200).send(service);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error!");
  }
};

module.exports.getServices = getServices;
module.exports.getService = getService;