const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const crypto = require('crypto');
const url = require('url');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.raw({ type: 'application/json' }))

// auth control
app.use((req, res, next) => {

    /* Read in an OpenSSH/PEM *private* key */
    var privateKey =
        '-----BEGIN RSA PRIVATE KEY-----\n' +
        'MIICWgIBAAKBgF35LJRcbqFV8wtwYfVj2vaXMVF7YSRclf8z/7GsZGkjundmHfID\n' +
        '+YJdEHX3MTfyp6+TuEwjobXrl+B3Uxm/1AnXC/LDsfAtrfFRTOukfynL8DHaOrh+\n' +
        'ZlDEmM+TZJb3LM4FaoHJ2p0u9fnDwwyDLpiY7qKbpcXg4KpvsdYhSviPAgMBAAEC\n' +
        'gYBDe2mt6GpxZN0xe7R8mQZmSdBaqPTrPalhKCAXoKpCbiu7DhO29W+5U8c8TxSD\n' +
        'Dren97ZCxtubXeEkicudFAnZX4cGoCK6PZGZEMP6cYElbEOAXNy2Fifeyyg9QfOv\n' +
        'dzckdy7cHPGqQPoN3QbsISWu74SmzwU5VS41A+DdYab4gQJBAKjqamet4riVnsUN\n' +
        'S+jp1rw2/qelUxvHpxWt3H/L6x1imUY2s/DPEq0haxg2lXXfKUf3ZLevYcE38jKB\n' +
        'IsIoTKECQQCOa9OKK1BUpJ42Dqvrm0rJFxh0UjYe+QVV4xpyk/8SfUI8Q2BLcRes\n' +
        'Slew+SG5vJ5iYr+27BCUX9PZon2t/IcvAkAjnVlWBum4tYNGVOlecH9gK9BBlLAT\n' +
        'OWNXRNMq9tnZ1kIu9bW23lI3wsYL0uZsdeMEU3se55Ga5arhTyz+9vRBAkBBMbq0\n' +
        'FP/Av1ptBGpOf9fMFXZsSPXdV8DJgBwrNvQcUppvW6hI4IwloiJiMKjvjRgzkWCR\n' +
        'K56rTPJ9PZSqgF6hAkBgXWfD/z+Dl+kxTKuKgIxCmBQWVON0uIEg/wr21uEqXPT0\n' +
        'nhY6lVpEb0DpP5voom8MvV9BB6FcAjzN0Ro0bRRb\n' +
        '-----END RSA PRIVATE KEY-----\n';

    var url_parts = url.parse(req.url, true);
    var authorizationCode = req.headers.authorization.split(" ")[1];
    var buf;
    if (req.method == 'GET') {
        buf = Buffer.from(authorizationCode + url_parts.search, 'utf8');
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
    console.log("CodeFest API listening at http://localhost:3000");
})
