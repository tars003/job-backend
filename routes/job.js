const { Router } = require('express');
const jwt = require('jsonwebtoken');
const Job = require('../models/Job');

const auth = require('../middleware/auth');

router = Router();

router.post('/create', async(req, res) => {
    try {
        let obj = req.body;
        obj = JSON.parse(JSON.stringify(obj).replace(/"\s+|\s+"/g, '"'));
        const {
           companyName,
           admin,
           city,
           state,
           salary,
           payBasis,
           professionType,
           openings,
           minQualification,
           language,
           jobDescription,
           minExperience,
           timing,
           address
        } = obj;

        console.log(minQualification);
        console.log(language);

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
