const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');

//Use MongoDB Atlas, set the DB URI in dbsetting.js
const dbsetting = require('./util/dbsetting');
const dbUri = dbsetting.dbUri;

const errorController = require('./controllers/error');
const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');

const app = express();
const store = new MongoDBStore({
    uri: dbUri,
    collection: 'sessions'
});

const csrfProtection = csrf();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + '-' + file.originalname);
    }
});

const imgfileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

//middleware

//if it's multipart form data, try to extract files
app.use(
    multer({ storage: fileStorage, fileFilter: imgfileFilter}).single('image')
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(
    session({
        secret: 'my secret',
        resave: false,
        saveUninitialized: false,
        store: store
    })
);
app.use(csrfProtection);
app.use(flash());

//express.js feature, add local fields
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken =  req.csrfToken()   //generate a csrf token
    next();
});

app.use((req, res, next) => {
    if(!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
      .then(user => {
          if (!user) {
              return next();
          }
          req.user = user;
          next();
      })
      .catch(err => {
        //inside of promise, catch blockes or callbacks, you have to use "next" instead of "throw"
        next( new Error(err) );
      });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errorController.get500)

app.use(errorController.get404);

//central error handler
app.use((error, req, res, next) => {
    // res.redirect('/500');
    res.status(500).render('500', {
        pageTitle: 'Error!',
        path: '/500',
        isAuthenticated: req.session.isLoggedIn
      });
});

mongoose.connect(dbUri)
  .then(result => {
      app.listen(3000);
  })
  .catch(err => {
      console.log(err);
  });