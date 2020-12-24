const { Router } = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const Admin = require('../models/Admin');

const auth = require('../middleware/auth');

router = Router();

router.post('/login', async(req, res) => {
    try {
        let obj = req.body;
        obj = JSON.parse(JSON.stringify(obj).replace(/"\s+|\s+"/g, '"'));
        console.log(obj);
        console.log('%%%%%%%%%%%%%%%%%');
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

router.post('/create', async(req, res) => {
    try {
        let obj = req.body;
        obj = JSON.parse(JSON.stringify(obj).replace(/"\s+|\s+"/g, '"'));
        const {
           name,
           email,
           company,
           password
        } = obj;

        const salt = await bcrypt.genSalt();
        const pass = await bcrypt.hash(password, salt);

        const admin = new Admin({
            name,
            email,
            company,
            password: pass
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
