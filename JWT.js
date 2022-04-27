import pkg from 'jsonwebtoken';
const { sign, verify } = pkg;

const createTokens = (user) => {
    const accessToken = sign (
        { 
            username : user.username,
            id : user.id,
            role : user.role,
        } , 
        "jwtsecret"
    );
    
    return accessToken;

}

const validateToken = (req, res, next) => {
    const accessToken = req.cookies["access-token"];

    console.log("validate token : "+ accessToken);
    if(!accessToken) {
        return res.status(400).json({ error : "User not Authenticated" });
        
    }
    try {

        const validToken = verify(accessToken, "jwtsecret")
        if(validToken) {
            req.authenticated = true
            req.username = validToken.username
            req.role = validToken.role
            return next()
        }

    } catch (err) {
        return res.status(400).json({ error : err});
    }
}

export { createTokens, validateToken };