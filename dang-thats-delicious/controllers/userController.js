const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');

exports.loginForm = (req, res) => {
  res.render('login');
};

exports.registerForm = (req, res) => {
  res.render('register');
};

exports.validateRegister = (req, res, next) => {
  req.sanitizeBody('name');
  req.checkBody('name', 'You must supply a name').notEmpty();
  req.checkBody('email', 'That Email is not valid').isEmail();
  req.sanitizeBody('email').normalizeEmail({
    remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false
  });
  req.checkBody('password', 'Password cannot be blank').notEmpty();
  req
    .checkBody('password-confirm', 'Confirmed Password cannot be blank')
    .notEmpty();
  req
    .checkBody('password-confirm', 'Oops! Your passwords do not match')
    .equals(req.body.password);

  const errors = req.validationErrors();
  if (errors) {
    req.flash('error', errors.map(err => err.msg));
    res.render('register', {
      title: 'Register',
      body: req.body,
      flashes: req.flash()
    });
  }
  next();
};

exports.register = async (req, res, next) => {
  const { email, name, password } = req.body;
  const user = new User({ email, name });
  const registerWithPromise = promisify(User.register, User);
  await registerWithPromise(user, password);
  next();
};

exports.account = (req, res) => {
  res.render('account', { title: 'Edit your account' });
};

exports.updateAccount = async (req, res) => {
  const { name, email } = req.body;
  const { _id } = req.user;

  const updates = { name, email };

  const user = await User.findOneAndUpdate(
    { _id },
    { $set: updates },
    { new: true, runValidators: true, context: 'query' }
  );

  req.flash('success', 'Updated profile');
  res.redirect('back');
};
