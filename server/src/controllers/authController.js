const jwt = require("jsonwebtoken");
const users = require("../database/db");

const login = (req, res) => {
	const { email, password } = req.body;

	const user = users.find((u) => u.email === email);

	if (!user || user.password !== password) {
		return res.status(401).json({ error: "Email or password is invalid" });
	}

	const token = jwt.sign(
		{ id: user.id, type: user.type },
		process.env.JWT_SECRET,
		{ expiresIn: "2h" },
	);

	return res.json({
		user: {
			id: user.id,
			name: user.name,
			email: user.email,
			type: user.type,
		},
		token: token,
	});
};

module.exports = { login };
