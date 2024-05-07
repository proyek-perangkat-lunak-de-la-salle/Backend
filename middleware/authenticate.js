import jwt from 'jsonwebtoken';

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;
            // Access role and wilayah from the user object
            const { role, id_wilayah } = user;
            console.log(`User Role: ${role}, User Wilayah: ${id_wilayah}`);

            next();
        });
    } else {
        res.sendStatus(401);
    }
};

export { authenticate };