const { Router } = require('express');
const jwt = require('jsonwebtoken');
const Profile = require('../models/Profile');

const auth = require('../middleware/auth');

router = Router();

router.get('/token/:no', async(req, res) => {
    try {
        const profile = await Profile.findOne({ contactNumber: req.params.no });
        if(!profile){
            console.log('No user with found corresponding to given contact number !');
            return res.status(400).json({
                sucess: false,
                message: 'No user with found corresponding to given contact number !'
            });
        }
        const tokenPayload = {
            data: {
                id: profile.id
            }
        }
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET);
        console.log(`Requested token : ${token}`);
        return res.status(200).json({
            sucess: true,
            token,
        });
    } catch(err) {
        console.log(err);
        return res.status(400).json({
            sucess: false,
            message: err
        })
    }
});

router.get('/view', auth, async(req, res) => {
    try {
        const profile = await Profile.findOne({ contactNumber: req.body.user.contactNumber });
        if(!profile){
            console.log('No profile found for given no. !!');
            return res.status(200).json({
                sucess: false,
                message: 'No profile found for given no. !!'
            });
        }
        console.log('Profile : ');
        console.log(profile);
        return res.status(200).json({
            sucess: true,
            data: profile
        })
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            sucess: false,
            message: err
        });
    }
})

router.post('/create', async(req, res) => {
    try {
        const contactNumber = req.body.contactNumber;

        const pro = await Profile.findOne({ contactNumber });

        if (pro){
            return res.status(200).json({
                sucess: false,
                message: 'Profile already exists !'
            })
        }

        const city = req.body.city;
        const state = req.body.state;
        const occupations = req.body.occupations;

        const payload = {
            contactNumber,
            city,
            state,
            occupations
        }

        console.log(payload);
        console.log(typeof occupations);
        const newProfile = await Profile.create(payload);

        const tokenPayload = {
            data: {
              id: newProfile.id
            },
        }
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET);

        return res.status(200).json({
            sucess: true,
            token,
            data: newProfile
        });

    } catch(err) {
        console.log(err);
        res.status(500).json({
          sucess: false,
          data: "Server error",
          err: err,
        });
    }
})



module.exports = router;
