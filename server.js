const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const crypto = require('crypto');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.raw({ type: 'application/json' }))

// auth control
app.use((req, res, next) => {

    /* Read in an OpenSSH/PEM *private* key */
    var privateKey =
        '-----BEGIN RSA PRIVATE KEY-----\n' +
        'MIICXQIBAAKBgQCXeY6SwQjlvHJZHYXtiePL6Mwif+dilRfAzep7lYkZEqvTdsdR\n' +
        '487+zxEyoQVxWTLeIiJLB98WzsPkQGW7UkZIJbqc8JhJcs7CKDVE2xxP92fWp1ot\n' +
        'sxv5sitoVEnY66uzjZKp09bHGUyh9qwVwKvcmIRKQwrkiVl3S/6NyIhQfQIDAQAB\n' +
        'AoGBAJH+EcE2Fdo+18M2Zke8l/aHSICT4DKu2jb1AGPei0XELiHhIFi4BWCnuL6g\n' +
        'XXuS6ikYow7H5me4HyvWOXbi5GLUPWggVifyg+COU2H+RvyIVxsgAt4h3jmoUPC+\n' +
        '+onPBJwSjZ7v5I3fE7HuDWE64mcxNlasrvOhlHHz5To6ikPhAkEA4KpvvxNZ2Y7K\n' +
        'yNLO1xqUwjsbji7PSmFM+hI0kVIITeZTcdCpnKx12R7TxwOQM/nvsCCgSeXLvNbx\n' +
        'mC/23u50RQJBAKyZ4THmK+HpGtBuiIGZ+W4ipTl2d9BIZtRBYt9gpsvkG6eYcdgL\n' +
        '3GhhlLWThcePfOEzj5GSMvVB1hDEYTqh2tkCQAI1KovyILvmj0+R4r5yYGvYMNkg\n' +
        '1KCifCMo8qNK7xH05XUE2+XSPAY6K1KVUmFwX06Xw3t2ap4cbptUPVTLexECQQCg\n' +
        '0XOwsZx7jl1MjWClGNj+FEvMQaSbLYqaBB5isURYPz7BJloUieCgZSNRF5YTfY9G\n' +
        'qWsAoK7YM7KHxuIs5jfpAkAkKFx10lV+K+g13rHENJNkQqCaBP0QhxBnNZAg9fKl\n' +
        'Fi1edlPs1BRqCRrXYd66Pskpd/kz3bL6nymz8CzydSJb\n' +
        '-----END RSA PRIVATE KEY-----';;

	if(!req.headers.authorization) {
		let err = {}
		err.status = 401;
		err.message = "authorization code not found!"
		err.isFriendly = true;
		next(err);
	}

    var authorizationCode = req.headers.authorization.split(" ")[1];
    var buf;

    if (req.method == 'GET') {
        buf = Buffer.from(authorizationCode, 'utf8');
    }
    else {
        buf = Buffer.from(authorizationCode + req.body, 'utf8');
    }
    var sign = crypto.createSign('SHA256');
    sign.update(buf);
    var signed = sign.sign(privateKey, 'base64');
    res.send(signed);
    next();
});


// unhandled
app.use((err, req, res, next) => {
    if (err) {
        let response = {};
        response.success = false;
        response.result = {};
        if (err.isFriendly) {
            response.message = err.message;
            res.status(err.status);
        }
        else {
            response.message = "We cannot process your transaction now. Please try again later."
            res.status(500);
        }
        res.json(response);
    }
});

const server = app.listen(3000, function () {
    console.log("Listening at http://localhost:3000");
})
