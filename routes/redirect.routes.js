// Router
const { Router } = require('express');
const router = Router();

// Models
const Link = require('../models/Link');

router.get('/:code', async (req, res) => {
	try {
		const link = await Link.findOne({ code: req.params.code });

		if (link) {
			link.clicks++;
			await link.save();
			res.redirect(link.from);
		}

		res.status(404).json({ message: 'Ссылка не найдена' });
	} catch (e) {
		res.status(500).json({ message: 'Что-то пошло не так, попробуйте еще раз.' });
	}
});

module.exports = router;
