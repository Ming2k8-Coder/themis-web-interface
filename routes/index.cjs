const express = require('express');
const router = express.Router();

router.use('/scoreboard', require('./scoreboard.cjs'));

router.use('/login', require('./login.cjs'));
router.use('/register', require('./register.cjs'));
router.use('/log', require('./log.cjs'));

router.use((req, res, next) => {
	if (!req.user)
		return res.redirect('/login');
	res.locals.user = req.user;
	next();
});

router.use('/contest', require('./contest.cjs'));
router.use('/submit', require('./submit.cjs'));
router.use('/queue', require('./queue.cjs'));
router.use('/files', require('./files.cjs'));
router.use('/change-password', require('./changePassword.cjs'));

router.get('/logout', (req, res) => {
	req.logout(res,function(){});
	return res.redirect('/');
});

router.get('/', (req, res) => {
	res.render('index', {
		title: 'Trang chủ'
	});
});

module.exports = router;
