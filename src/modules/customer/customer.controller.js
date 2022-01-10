const Customer = require("./customer.model");

const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll();

    res.status(200).send(customers);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error!");
  }
};

const getCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findOne({
      where: {
        id,
      },
    });
    if (!customer) return res.status(404).send("Customer not found!");

    res.status(200).send(customer);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error!");
  }
};

const addCustomer = async (req, res) => {
  try {
    const { name, address, phone_number } = req.body;

    const customer = await Customer.create({
      name,
      address,
      phone_number,
    });

    res.status(201).send(customer);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error!");
  }
};

const putCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, phone_number } = req.body;

    const customer = await Customer.update(
      {
        name,
        address,
        phone_number,
      },
      {
        where: {
          id,
        },
      }
    );

    if (!customer) return res.status(404).send("Customer not found!");

    res.status(201).send(customer);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error!");
  }
};

const patchCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, phone_number } = req.body;

    const customer = await Customer.findOne({
      where: {
        id,
      },
    });

    if (!customer) return res.status(404).send("Customer not found!");

    if (name) customer.update({ name });
    if (address) customer.update({ address });
    if (phone_number) customer.update({ phone_number });

    res.status(201).send(customer);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error!");
  }
};

const deleteCustomer = async (req, res) => {
  const { id } = req.params;

  const customer = await Customer.findOne({
    where: {
      id,
    },
  });

  if (!customer) return res.status(404).send("Customer not found!");

  await customer.destroy();

  res.sendStatus(201).send(customer);
};

module.exports.getCustomers = getCustomers;
module.exports.getCustomer = getCustomer;
module.exports.addCustomer = addCustomer;
module.exports.putCustomer = putCustomer;
module.exports.patchCustomer = patchCustomer;
module.exports.deleteCustomer = deleteCustomer;
