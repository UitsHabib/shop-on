const service = require("./service.model");
const {makeCustomSlug} = require(path.path.join(process.cwd(), "src/modules/platform/service/service.slug.js"));

const getServices = async (req, res) => {
  try {

    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;
    const offset = (page - 1) * limit;
    let { orderBy, orderType } = req.query;
    orderType = orderType || 'asc';
    let order = [['created_at', 'desc']];

    if (orderBy) {
        order.push([orderBy, orderType]);
    }
    const services = await service.findAll(offset, limit, order);

    const total = await service.count();

    const data = {
        services,
        meta: {
            start: offset+1,
            end: Math.min(total, page * limit),
            total,
            page
        }
    };
    res.status(200).send(data);
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