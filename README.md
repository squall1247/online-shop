# online-shop

### Build an online shop by Node.js with MongoDB
It is a Server-Side-Rendering¡]SSR¡^web application.
Template engine is [EJS][efjlink]. 
Access database by [Mongoose][mongooselink].

## Features

- Every user can view all products
- Support user signup and login
- A registered user can add the product to their cart and create an order
- Authorization checking: cannot edit other user's product
- Support reset password
- Payment function
- Generate the invoices pdf file
- Generate HTTP request log at root folder, default file name is "access.log"

## Prerequisite

- For database, create a mongoDB atlas account and get the uri of DB, add this uri to dbsetting.js and export it
- Create a sendGrid free account and create a API key
- Create a Stripe accout
- Set above sendGrid and Stripe keys to environment variables (e.g. process.env.STRIPE_KEY).

## Usage
```sh
npm install
npm start
```

## Future works

- Enhance log
- Add testing by Mocha
- Store upload images in AWS S3

 [efjlink]: <https://ejs.co/>
 [mongooselink]: <https://mongoosejs.com/>
