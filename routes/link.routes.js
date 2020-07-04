// Router
const { Router } = require('express');
const router = Router();

// Auth middleware
const auth = require('../middleware/auth.middleware');

// Models
const Link = require('../models/Link');

// Packages
const config = require('config');
const shortid = require('shortid');

// api/link/generate
router.post('/generate', auth , async (req, res) => {
	try{
		const baseUrl = config.get('baseUrl')
		const {from} = req.body

		const code = shortid.generate()
		const existing = await Link.findOne({ from })

		if (existing) {
			return res.json({ link: existing })
		}

		const to = baseUrl + '/t/' + code

		const link = new Link({
			code, to, from, owner: req.user.userId
		})
		
		await link.save()

		return res.status(201).json({link})
		
	} catch (e) {
		res.status(500).json({ message: 'Что-то пошло не так, попробуйте еще раз' });
	}
});

// api/link/
router.get('/', auth, async (req, res) => {
	try{
		const link = await Link.find({ owner: req.user.userId })
		res.json(link)
	} catch (e) {
		res.status(500).json({ message: 'Что-то пошло не так, попробуйте еще раз' });
	}
});

// api/link/:id
router.get('/:id', auth, async (req, res) => {
	try{
		const link = await Link.findById(req.params.id)
		res.json(link)
	} catch (e) {
		res.status(500).json({ message: 'Что-то пошло не так, попробуйте еще раз' });
	}
});

module.exports = router;
