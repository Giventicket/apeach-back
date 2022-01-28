const asyncErrorWrapper = func => {
    return (req, res, next) => {
        func(req, res, next).catch(err => {
            next(err);
        });
    };
};

exports.signin = asyncErrorWrapper(async (req, res) => {
    let { email, password } = req.body;
    let errors = [];
    if (!email) {
        errors.push({ email: 'required' });
    }
    if (!emailRegexp.test(email)) {
        errors.push({ email: 'invalid email' });
    }
    if (!password) {
        errors.push({ password: 'required' });
    }
    if (errors.length > 0) {
        const err = new Error(Array.stringify(errors));
        err.status = 422;
        throw err;
    }
    const user = await User.findOne({ email: email }).exec();
    if (!user) {
        const err = new Error(Array.stringify([{ user: 'user not found' }]));
        err.status = 404;
        throw err;
    } else {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            const err = new Error(Array.stringify([{ password: 'incorrect' }]));
            err.status = 400;
            throw err;
        }
        let access_token = createJWT(user.email, user._id, 3600);
        jwt.verify(access_token, process.env.TOKEN_SECRET, (err, decoded) => {
            if (err) {
                res.status(500).json({
                    error: err.message,
                });
            }
            if (decoded) {
                return res.status(200).json({
                    success: true,
                    token: access_token,
                    message: user,
                });
            }
        });
    }
});
