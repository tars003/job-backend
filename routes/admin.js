const { Router } = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const Admin = require('../models/Admin');

const auth = require('../middleware/auth');

router = Router();

// GET ADMIN DETIALS WITH JWT FOR STARTUP
router.get('/token', auth, async(req, res) => {
    try {
        const admin = req.body.user;

        return res.status(200).json({
            success: true,
            data: admin
        });

    } catch(err) {
        console.log(err);
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }
});

router.post('/change/password', auth, async(req, res) => {
    try {
        const admin = req.body.user;

        let obj = req.body;
        obj = JSON.parse(JSON.stringify(obj).replace(/"\s+|\s+"/g, '"'));
        const { oldPass, pass1, pass2 } = obj;

        const passMatches = await bcrypt.compare(oldPass, admin.password);

        // If password is not correct
        if(passMatches) {
            // If password matches
            if(pass1 == pass2) {
                const salt = await bcrypt.genSalt();
                const pass = await bcrypt.hash(pass1, salt);
                admin.password = pass;
                admin.save();
                return res.status(200).json({
                    success: true,
                    message: 'password change successfull'
                })
            }
            // If pass does not match
            else {
                return res.status(400).json({
                    success: false,
                    message: 'passwords do not match',
                })
            }
        }
        // If password is not correct
        else {
            return res.status(400).json({
                success: false,
                message: "incorrect password",
            })
        }

        return res.status(200).json({
            success: true,
            data: admin
        });

    } catch(err) {
        console.log(err);
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }
});

// API TO CHECK IF THE EMAIL IS REGISTERED R NOT
router.get('/email/check/:email', async(req, res) => {
    try {
        const admin = await Admin.findOne({ email : req.params.email });
        console.log(admin);

        if(admin) {
            return res.status(200).json({
                sucess: true,
                existingUser: true
            })
        } else {
            return res.status(200).json({
                sucess: true,
                existingUser: false
            })
        }
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            sucess: false,
            message: err
        })
    }
})


// LOGIN ROUTE
router.post('/login', async(req, res) => {
    try {
        let obj = req.body;
        obj = JSON.parse(JSON.stringify(obj).replace(/"\s+|\s+"/g, '"'));
        const { email, password } = obj;
        if (!email || !password) {
            res.status(400).json({ msg: "Invalid credentials" });
            return;
        }
        let admin = await Admin.findOne({ email });
        if(admin){
            const passMatches = await bcrypt.compare(password, admin.password);
            if(passMatches){
                const tokenPayload = {
                    data: {
                      id: admin.id
                    },
                }
                const token = jwt.sign(tokenPayload, process.env.JWT_SECRET);
                return res.status(200).json({
                    sucess: true,
                    token,
                    data: admin
                });
            } else {
                return res.status(400).json({ msg: "Invalid credentials" });
            }
        } else{
            return res.status(400).json({ msg: "Invalid email" });
        }

    } catch (err) {
        console.log(err);
        return res.status(400).json({
            sucess: false,
            message: err
        })
    }
});

// ADMIN EDIT INFO
router.post('/edit', auth, async(req, res) => {
    try  {
        let obj = req.body;
        obj = JSON.parse(JSON.stringify(obj).replace(/"\s+|\s+"/g, '"'));
        const { name, email, company, phone } = obj;

        const admin = await Admin.findById(req.body.user.id);
        await admin.updateOne(obj);
        admin.save();

        return res.status(200).json({
            success: true
        })
    } catch(err) {
        console.log(err);
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }
})


// CREATING ADMIN
router.post('/create', async(req, res) => {
    try {
        let obj = req.body;
        obj = JSON.parse(JSON.stringify(obj).replace(/"\s+|\s+"/g, '"'));
        const {
           name,
           email,
           company,
           password,
           phone,
        } = obj;

        const salt = await bcrypt.genSalt();
        const pass = await bcrypt.hash(password, salt);

        const admin = new Admin({
            name,
            email,
            company,
            password: pass,
            phone,
        });
        await admin.save();

        const tokenPayload = {
            data: {
              id: admin.id
            },
        }
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET);

        return res.status(200).json({
            sucess: true,
            token,
            data : admin
        });

    } catch(err) {
        console.log(err);
        return res.status(400).json({
            sucess: false,
            message: err
        })
    }
});





module.exports = router;
