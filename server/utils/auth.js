// declaring jwt so we can use tokens for user authentication
const jwt = require('jsonwebtoken');

const secret = 'rubberducky';
const expiration = '6h';

module.exports = {

    // if user token is already authenticated, pass authentication
    authMiddleware: ({ req }) => {
        let token = req.body.token || req.headers.authorization || req.query.token;

        if (req.headers.authorization) {
            token = token.split(' ').pop().trim();
        }

        if (!token) {
            return req;
        }

        try {
            const { data } = jwt.verify(token, secret, { maxAge: expiration });
            req.user = data;
        } catch {
            console.log('Invalid token');
        }

        return req;
    },

    // sign the token with our user data
    signToken: ({ username, _id }) => {
        const payload = { username, _id };

        return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
    }
};