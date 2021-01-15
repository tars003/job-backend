const { Router } = require('express');
const jwt = require('jsonwebtoken');
const Job = require('../models/Job');

const auth = require('../middleware/auth');

router = Router();


// ROUTE FOR HOME PAGE ( Sorted list of jobs based on profession type provided )
router.post('/search/profession', auth, async(req, res) => {
    try {
        let obj = req.body;
        obj = JSON.parse(JSON.stringify(obj).replace(/"\s+|\s+"/g, '"'));
        console.log(typeof obj.professionType[0]);

        const jobs = await Job.find({ professionType: obj.professionType[0] })

        return res.status(200).json({
            success: true,
            length: jobs.length,
            data: jobs
        });

    } catch(err) {
        console.log(err);
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }
})

router.post('/create', auth, async(req, res) => {
    try {
        let obj = req.body;
        obj = JSON.parse(JSON.stringify(obj).replace(/"\s+|\s+"/g, '"'));
        const adminId = req.body.user.id;
        obj['admin'] = adminId;

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
