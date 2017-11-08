// call the packages we need
const express = require('express');        // call express
const app = express();                 // define our app using express
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Contact = require('./app/models/contact');

const collectionsUrl = 'https://api.mlab.com/api/1/databases/accounting-api/collections';
const apiKey = 'ZFWnCbvPFJ6dosniNOJMFbY4A7k-lHGj';
const params = '?apiKey=' + apiKey;

mongoose.connect('mongodb://admin:admin@ds251845.mlab.com:51845/accounting-api', function (error) {
    if (error)
        console.log('db connection', error);
}); // connect to our database

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
const router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function (req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});


// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function (req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

router.route('/contact')

    // create a contact (accessed at POST http://localhost:8080/api/contact)
    .post(function (req, res) {

        var contact = new Contact();      // create a new instance of the Bear model
        contact.name = req.body.name;
        contact.email = req.body.email;
        contact.phone = req.body.phone;
        contact.message = req.body.message;

        // save the bear and check for errors
        contact.save(function (err, contact) {
            if (err)
                res.send(err);
            res.json({ message: 'Contact created!' });
        });

    })

    // get all the contacts (accessed at GET http://localhost:8080/api/contact)
    .get(function (req, res) {
        Contact.find(function (err, contatos) {
            if (err)
                res.send(err);

            res.json(contatos);
        });
    });

router.route('/contact/:contact_id')

    // get the contact with that id (accessed at GET http://localhost:8080/api/contact/:contact_id)
    .get(function (req, res) {
        Contact.findById(req.params.contact_id, function (err, contact) {
            if (err)
                res.send(err);
            res.json(contact);
        })
    })

    // update the contact with this id (accessed at PUT http://localhost:8080/api/contact/:contact_id)
    .put(function (req, res) {

        // use our bear model to find the bear we want
        Contact.findById(req.params.contact_id, function (err, contact) {

            if (err)
                res.send(err);

            contact.name = req.body.name;  // update the bears info

            // save the bear
            contact.save(function (err) {
                if (err)
                    res.send(err);

                res.json({ message: 'contact updated!' });
            });

        });
    })

    // delete the contact with this id (accessed at DELETE http://localhost:8080/api/contact/:contact_id)
    .delete(function (req, res) {
        Contact.remove({
            _id: req.params.contact_id
        }, function (err, bear) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);