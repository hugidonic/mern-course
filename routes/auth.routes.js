// Router
const { Router } = require('express');
const router = Router();
// packages
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

// Validation and schema
const { check, validationResult } = require('express-validator');
const User = require('../models/User');

// /api/auth/register
router.post(
	'/register',
	[
		check('email', 'Некорректный email').isEmail(),
		check('password', 'Минимальная длина пароля 6 символов').isLength({ min: 6 })
	],
	async (req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({ errors: errors.array(), message: 'Некорректные данные при регестрации' });
			}

			const { email, password } = req.body;

			const candidate = await User.findOne({ email });

			if (candidate) {
				return res.status(400).json({ message: 'Такой пользователь уже существует' });
			}

			const hashedPassword = await bcrypt.hash(password, 12);
			const user = new User({ email, password: hashedPassword });

			await user.save();

			return res.status(201).json({ message: 'Пользователь создан' });
		} catch (e) {
			res.status(500).json({ message: 'Что-то пошло не так, попробуйте еще раз' });
		}
	}
);

// /api/auth/login
router.post(
	'/login',
	[
		check('email', 'Некорректный email').isEmail(),
		check('password', 'Введите пароль').exists()
	],
	async (req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(500).json({ errors: errors.array(), message: 'Некорректные данные при регестрации' });
			}

			const { email, password } = req.body;

			const user = await User.findOne({ email });

			if (!user) {
				return res.status(404).json({ message: 'Пользователь не найден' });
			}

			const isMatch = await bcrypt.compare(password, user.password);

			if (!isMatch) {
				return res.status(400).json({ message: 'Неверный пароль, попробуйте еще раз' });
			}

			const token = jwt.sign(
				{ userId: user.id },
				config.get('secretJwt'),
				{ expiresIn: '2h' }
			);

			res.json({
				token,
				userId: user.id,
				message: 'Вы успешно вошли в систему'
			});

		} catch (e) {
			res.status(500).json({ message: 'Что-то пошло не так, попробуйте еще раз' });
		}
	}
);

module.exports = router;
