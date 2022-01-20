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

const addService = async (req, res) => {
  try {
    const { title, slug, parentId } = req.body;

    const slug = makeCustomSlug(title);

    const service = await service.create({
      title,
      slug,
      description,
      created_by: 1,
      updated_by: 1

    });

    res.status(201).send(service);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error!");
  }
};

const putService = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, parentId } = req.body;

    const service = await service.update(
      {
        title,
        slug,
        parentId,
      },
      {
        where: {
          id,
        },
      }
    );

    if (!service) return res.status(404).send("service not found!");

    res.status(201).send(service);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error!");
  }
};

const patchService = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, parentId } = req.body;

    const service = await service.findOne({
      where: {
        id,
      },
    });

    if (!service) return res.status(404).send("service not found!");

    if (title) service.update({ title });
    if (slug) service.update({ slug });
    if (parentId) service.update({ parentId });

    res.status(201).send(service);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error!");
  }
};

const deleteService = async (req, res) => {
  const { id } = req.params;

  const service = await service.findOne({
    where: {
      id,
    },
  });

  if (!service) return res.status(404).send("service not found!");

  await service.destroy();

  res.sendStatus(201).send(service);
};

module.exports.getServices = getServices;
module.exports.getService = getService;
module.exports.addService = addService;
module.exports.putService = putService;
module.exports.patchService = patchService;
module.exports.deleteService = deleteService;