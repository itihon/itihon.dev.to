import express from 'express';
import bodyParser from 'body-parser';
import { signinV } from './validation/profiles/signin.js';
import { signupV } from './validation/profiles/signup.js';
import isEmailNotRegisteredS from './validation/validators/is-email-not-registered-s.js';

const app = express();
const urlencodeParser = bodyParser.urlencoded({extended: false});

app.use(express.static('public'));

function signinHandler(req, res) {
    const { validationResult } = req;

    if (validationResult.isValid) {
        // check credentials and authorize the user
        // ...
        res.send('VALID');
    }
    else {
        // respond with the validation error
        // ...
        res.json(validationResult);
    }
}

function signupHandler(req, res) {
    const { validationResult } = req;

    if (validationResult.isValid) {
        // create an account
        // ...
        res.send('VALID');
    }
    else {
        // respond with the validation error
        // ...
        res.json(validationResult);
    }
}

function checkemailHandler(req, res) {
    res.json(req.validationResult.isValid);
}

const emailV = signupV.email.server.constraint(isEmailNotRegisteredS);

// validations are added as middlewares
app.post('/signin', urlencodeParser, signinV, signinHandler);
app.post('/signup', urlencodeParser, signupV, signupHandler);
app.post('/checkemail', urlencodeParser, emailV, checkemailHandler);

app.listen(8080, () => {
    console.log('Listening port 8080 ...');
});

