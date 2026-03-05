const users = require("../database/db");

const listUsers = (req, res) => {
	const usersWithoutPassword = users.map(({ password, ...user }) => user);
	return res.json(usersWithoutPassword);
};

const createUser = (req, res) => {
	const { name, email, type, password } = req.body;

	if (!name || !email || !password) {
		return res
			.status(400)
			.json({ error: "Name, email and password are required" });
	}

	const exists = users.find((u) => u.email === email);
	if (exists) {
		return res.status(400).json({ error: "Email already registered" });
	}

	const newId =
		users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;

	const newUser = { id: newId, name, email, type: type || "user", password };
	users.push(newUser);

	const { password: _, ...userWithoutPassword } = newUser;
	return res.status(201).json(userWithoutPassword);
};

const updateUser = (req, res) => {
	const { id } = req.params;
	const { name, email, type, password } = req.body;

	const index = users.findIndex((u) => u.id === Number(id));
	if (index === -1) {
		return res.status(404).json({ error: "User not found" });
	}

	if (email && email !== users[index].email) {
		const emailExists = users.find(
			(u) => u.email === email && u.id !== Number(id),
		);
		if (emailExists) {
			return res
				.status(400)
				.json({ error: "Email already registered by another user" });
		}
	}

	if (name) users[index].name = name;
	if (email) users[index].email = email;
	if (type) users[index].type = type;
	if (password) users[index].password = password;

	const { password: _, ...userWithoutPassword } = users[index];
	return res.json(userWithoutPassword);
};

const deleteUser = (req, res) => {
	const { id } = req.params;

	const index = users.findIndex((u) => u.id === Number(id));
	if (index === -1) {
		return res.status(404).json({ error: "User not found" });
	}

	users.splice(index, 1);
	return res.status(204).send();
};

module.exports = { listUsers, createUser, updateUser, deleteUser };
