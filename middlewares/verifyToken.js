import jwt from 'jsonwebtoken'

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization

    if (authHeader) {
        // Format attendu: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        const token = authHeader.split(" ")[1]
        
        jwt.verify(token, process.env.JWT_SEC, (err, user) => {
            if (err) {
                return res.status(403).json("Token is not valid!")
            }
            req.user = user
            next()
        })
    } else {
        return res.status(401).json("You are not authenticated!")
    }
}

const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, async () => {
        try {
            let authorized = false;

            // Verify if the user is authorized to access resource (product, user, etc.)
            if (req.user.isAdmin) {
                authorized = true
            } else if (req.params.id) {
                // L'utilisateur peut accéder à ses propres ressources
                if (req.params.id === req.user.id) {
                    authorized = true
                }
            }

            if (authorized) {
                next()
            } else {
                res.status(403).json("You are not allowed to do that!")
            }
        } catch (err) {
            res.status(500).json({ response: 'Internal server error: ' + err.message })
        }
    })
}

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next()
        } else {
            res.status(403).json("You are not allowed to do that!")
        }
    })
}

export {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin
}
