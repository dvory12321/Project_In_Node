import jwt from "jsonwebtoken";

export function checkMiddleware (req, res, next){
    let token = req.headers["authorization"];

    if (!token || !token.startsWith("Bearer ")) {
        return res.status(401).json({ message: "משתמש לא מזוהה, נא בצע כניסה" });
    }

    try {
        token = token.split(" ")[1]; 
        const result = jwt.verify(token, process.env.JWT_SECRET);
        console.log("env:" + process.env.JWT_SECRET);
        console.log(result);
        req.user = result;
        next();
    } catch (err) {
        console.log(err);
        res.status(401).json({ message: "נא משתמש לא מזוהה" });
    }
};

export function checkManager(req, res, next) {
    let token = req.headers["authorization"];
    console.log("all aeaders: ", req.headers);
    console.log("token in checkManager: ", token);
    

    if (!token || !token.startsWith("Bearer ")) {
        {token && console.log("token in checkManager: ", token)}
        return res.status(401).json({ message: "משתמש לא מזוהה, נא בצע כניסה" });
    }

    try {
        token = token.split(" ")[1];      
        console.log("token after split: ", token);   
        const result = jwt.verify(token, process.env.JWT_SECRET);
        req.user = result;
        console.log("נתוני המשתמש מהטוקן:", req.user);
        if (result.role === "admin") {
            return next(); 
        }
        return res.status(403).json({ message: " אינך מורשה לפעולה זו"+result.role });
    } catch (err) {
        console.log(err);
        res.status(401).json({ message: "משתמש לא מזוהה" });
    }
};

