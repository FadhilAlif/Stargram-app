const jwt = require('jsonwebtoken')

function sign(payload) {
    return jwt.sign(payload, "iloveyou")
}

function verify(token) {
    return jwt.verify(token, "iloveyou")
}

module.exports = {
    sign, verify
}