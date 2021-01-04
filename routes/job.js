const { Router } = require('express');
const jwt = require('jsonwebtoken');
const Job = require('../models/Job');

const auth = require('../middleware/auth');

router = Router();

router.post('/create', auth, async(req, res) => {
    try {
        let obj = req.body;
        obj = JSON.parse(JSON.stringify(obj).replace(/"\s+|\s+"/g, '"'));
        const adminId = req.body.user.id;
        const {
           companyName,
           city,
           state,
           salary,
           payBasis,
           professionType,
           type,
           openings,
           minQualification,
           language,
           jobDescription,
           minExperience,
           timing,
           address
        } = obj;

        obj['admin'] = adminId;

        console.log('obj');
        console.log(obj);

        const job = new Job(obj);

        await job.save();

        return res.status(200).json({
            success: true,
            data: job
        });

    } catch(err) {
        console.log(err);
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }
})

module.exports = router;
