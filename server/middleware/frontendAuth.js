
const isValidRequest = (req, res, next) => {
    // check for basic auth header
    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        return res.status(401).json({ message: 'Missing Authorization Header' });
    }

    try {
        // verify auth credentials
        const base64Credentials = req.headers.authorization.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [username, password] = credentials.split(':');

        const frontendSecret = process.env.FRONTEND_SECRET;

        if (password.toLowerCase() !== frontendSecret.toLowerCase()) {
            return res.status(401).json({ message: 'Invalid Authentication Credentials' });
        }

        next();

    } catch (err) {
        console.error("Something wrong with auth middleware");
        res.status(500).json({ msg: "Server Error" });
    }
};


module.exports = isValidRequest;