const path = require("path");
const Customer = require(path.join(process.cwd(), 'src/modules/customer/customer.model'));
const { generateAccessToken } = require(path.join(process.cwd(), 'src/modules/customer/services/customer.service'));
const cloudinary = require(path.join(process.cwd(), 'src/config/lib/cloudinary'));

async function login(req, res) {
    try {
        const { email, password } = req.body;

        const customer = await Customer.findOne({ where: { email }});

        if (!customer || !customer.password || !customer.validPassword(password)) return res.status(400).send("Invalid email or password!");

        res.cookie("access_token", generateAccessToken(customer), { httpOnly: true, sameSite: true, signed: true });

        res.status(200).send(customer);
    } catch (err) {
        console.log(err);
        res.status(500).json("Internal server error!");
    }
};

async function logout(req, res) {
    res.clearCookie("access_token");
    res.send('Logged out.');
}

const registerCustomer = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const [customer, created] = await Customer.findOrCreate({
            where: { email: email.toLowerCase() },
            defaults: {
                username,
                email,
                password,
            },
        });

        if (!created) return res.status(400).send("Already registered with this email address.");

        res.status(201).send(customer);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error!");
    }
};

async function getSignedInCustomerProfile (req, res) {
    try {
        const customer = await Customer.findOne({ where: { id: req.user.id }});

        if (!customer) return res.status(404).send("Customer not found!");

        res.status(200).send(customer);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error!");
    }
}

async function updateSignedInCustomerProfile (req, res) {
    try {
        const { first_name, last_name, username, email, phone } = req.body;

        const customer = await Customer.findOne({ where: { id: req.user.id }});

        if (!customer) return res.status(404).send("Customer not found!");
        
        await customer.update({ first_name, last_name, username, email, phone });

        if(req.file?.path) {
            const file_url = await cloudinary.uploader.upload(req.file.path);
            await customer.update({ avatar_url: file_url.secure_url });
        }

        res.send(customer);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error!");
    }
}

module.exports.login = login;
module.exports.logout = logout;
module.exports.registerCustomer = registerCustomer;
module.exports.getSignedInCustomerProfile = getSignedInCustomerProfile;
module.exports.updateSignedInCustomerProfile = updateSignedInCustomerProfile;
