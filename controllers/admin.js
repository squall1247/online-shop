const { validationResult } = require('express-validator/check');

const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect('/login');
  }
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    hasError: false,
    errorMessage: null,
    validationError: []
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: true,
      product: {
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description
      },
      errorMessage: errors.array()[0].msg,
      validationError: errors.array()
    });
  }

  const product = new Product({
    title: title, 
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.session.user
  });
  product
    .save()
    .then(result => {
      console.log('Create product');
      res.redirect('/admin/products');
    })
    .catch(err =>{
      // console.log(err);
      // res.redirect('/500');
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;   //Important: the extracted value always is a string! So 'true' instead of true
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;  //get id from URL
  Product.findById(prodId)
    .then(product => {
      if (!product) {
       return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
        hasError: false,
        errorMessage: null,
        validationError: []
      });
  })
  .catch(err => {
    const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
  });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: true,
      hasError: true,
      product: {
        title: updatedTitle,
        imageUrl: updatedImageUrl,
        price: updatedPrice,
        description: updatedDesc,
        _id: prodId
      },
      errorMessage: errors.array()[0].msg,
      validationError: errors.array()
    });
  }

  Product.findById(prodId)
    .then(product => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/');
      }
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      product.imageUrl = updatedImageUrl;
      return product.save().then(result => {
        console.log('UPDATE Product!');
        res.redirect('/admin/products');
      });
    })
    .catch(err => {
      const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.getProducts = (req, res, next) => {
  Product.find({userId: req.user._id})
    // .select('title price -_id')
    // .populate('userId', 'name')
    .then(products => {
      //console.log(products);
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
        hasError: false
      });
    })
    .catch(err => {
      const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteOne({_id: prodId, userId: req.user._id})
    .then(result => {
      console.log('Destoryed Product');
      res.redirect('/admin/products');
    })
    .catch(err => {
      const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};