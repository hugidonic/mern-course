// Packages
const express = require('express');
const config = require('config');
const path = require('path');
const mongoose = require('mongoose');

// App
const app = express()

app.use(express.json({ extended: true }))

// Authorization middleware
app.use('/api/auth', require('./routes/auth.routes'))

// Links middleware
app.use('/api/link', require('./routes/link.routes'))

// Redirect
app.use('/t', require('./routes/redirect.routes'))

if (process.env.NODE_ENV === 'production') {
	app.use('/', express.static( path.join(__dirname, 'client', 'build') ))

	app.get('*', (req,res) => {
		res.sendFile( path.resolve(__dirname, 'client', 'build', 'index.html') )
	})
}

// Constants
const PORT = config.get('port') || 5000
const MONGOURI = config.get('mongoUri')

async function start() {
	try {
		await mongoose.connect(MONGOURI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		})

		app.listen(PORT, () => console.log(`App has been started on port ${PORT}`))
	} catch (e) {
		console.log('Error: ', e.message);
		process.exit(1)
	}
}

start()



