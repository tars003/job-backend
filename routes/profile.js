const { Router } = require('express');
const Profile = require('../models/Profile');


router = Router();

router.post('/create', async(req, res) => {
    try {
        const contactNumber = req.body.contactNumber;
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


        return res.status(200).json({
            sucess: true,
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
