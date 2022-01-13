const Customer = require("./customer.model");
const { generateAccessToken } = require("./services/customer.service");

async function login(req, res) {
    try {
        const { email, password } = req.body;

        const customer = await Customer.findOne({
            where: {
                email,
            },
        });

        if (!customer || !customer.password || !customer.validPassword(password))
            return res.status(400).send("Invalid email or password!");

        res.cookie("access_token", generateAccessToken(customer), { httpOnly: true, sameSite: true, signed: true });

        res.status(201).send({
            status: "success",
            message: "Customer logged in successfully!",
            data:
            {
                email: customer.email,
                loggedInTime: new Date(),
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json("Internal server error!");
    }
};

async function logout(req, res) {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token").redirect("/");
}

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
        console.error(err);
        res.status(500).send("Internal server error!");
    }
};

const createCustomer = async (req, res) => {
    try {
        const { username, email, password, customer_type_id } = req.body;

        const existCustomer = await Customer.findOne({
            where: {
                email,
            },
        });

        if (existCustomer)
            return res
                .status(400)
                .send("Already registered with this email address.");

        const customer = await Customer.create({
            username,
            email,
            password,
            customer_type_id: customer_type_id,
        });

        res.status(201).send({
            status: "success",
            message: "Customer created successfully!",
            data:
            {
                email: customer.email,
                username: customer.username,
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error!");
    }
};

const updateCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, username, email } = req.body;

        const customer = await Customer.update(
            {
                first_name: firstName,
                last_name: lastName,
                username,
                email,
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

const updateCustomerDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, username, email } = req.body;

        const customer = await Customer.findOne({
            where: {
                id,
            },
        });

        if (!customer) return res.status(404).send("Customer not found!");

        if (firstName) customer.update({ first_name: firstName });
        if (lastName) customer.update({ first_name: lastName });
        if (username) customer.update({ username });
        if (email) customer.update({ email });

        res.status(201).send(customer);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error!");
    }
};

const deleteCustomer = async (req, res) => {
    try {
        const { id } = req.params;

        const customer = await Customer.findOne({
            where: {
                id,
            },
        });

        if (!customer) return res.status(404).send("Customer not found!");

        await customer.destroy();

        res.sendStatus(200).send(customer);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error!");
    }
};

module.exports.login = login;
module.exports.logout = logout;
module.exports.getCustomers = getCustomers;
module.exports.getCustomer = getCustomer;
module.exports.createCustomer = createCustomer;
module.exports.updateCustomer = updateCustomer;
module.exports.updateCustomerDetails = updateCustomerDetails;
module.exports.deleteCustomer = deleteCustomer;
