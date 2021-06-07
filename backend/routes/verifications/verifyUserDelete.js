const jwt = require("jsonwebtoken");

module.exports = async function(req, res, next) {
    const token = req.header("auth-token");
    if (!token) {
        return res.status(401).send({ message: "Access Denied" });
    }
    try {
        const verification = jwt.verify(token, process.env.TOKEN_SECRET);
        if(verification.userId === req.params.userId) {
            next();
        }
        else {
            res.status(403).send({ message: "Access Denied!" });
        }
    } catch(err) {
        res.status(400).send({ message: "Invalid Token!" });
    }
}