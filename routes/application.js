const { Router } = require('express');
const jwt = require('jsonwebtoken');
const Profile = require('../models/Profile');
const Admin = require('../models/Admin');
const Job = require('../models/Job');
const Application = require('../models/Application');

const auth = require('../middleware/auth');
const { formatOccupations } = require('../middleware/occupations');

router = Router();

router.get('/view/applications', auth, async(req, res) => {
    try {
        
    } catch(err) {
        console.log(err);
        return res.status(400).json({
            success: true,
            message: err
        })
    }
});

router.get('/view/applicant', auth, async(req, res) => {
    try {
        const applicant = await Profile.findById(req.body.user.id);
        var applicationsArr;
        const applications = await applicant.applications.map(async (application) => {
            const applicationObj = await Application.findById(application.application);
            console.log(applicationObj);
            const jobObj = await Job.findById(applicationObj.job);
            console.log(jobObj)
            applicationObj['job'] = jobObj;
            // applicationsArr.push(applicationObj);
            return applicationObj;
        })

        console.log(applications);
        return res.status(200).json({
            success: true,
            data: applications
        });

    } catch(err) {
        console.log(err);
        return res.status(400).json({
            success: true,
            message: err
        })
    }
});

router.post('/create', auth, async(req, res) => {
    try {
        let obj = req.body;
        obj = JSON.parse(JSON.stringify(obj).replace(/"\s+|\s+"/g, '"'));
        const applicantId = req.body.user.id;
        obj['applicant'] = applicantId;

        console.log('obj before db insertion');
        console.log(obj);

        const application = new Application(obj);
        await application.save();

        const applicant = await Profile.findById(applicantId);
        console.log(applicant);
        if(applicant.applications){
            applicant.applications.push({
                application: application.id,
            });
        } else {
            applicant.applications = [
                {
                    application: application.id
                }
            ]
        }


        const job = await Job.findById(req.body.job);
        console.log(job)
        if(job.applications){
            job.applications.push({
                application: application.id,
            });
        } else {
            job.applications = [
                {
                    application: application.id
                }
            ]
        }

        await job.save();
        await applicant.save();

        console.log(job);
        console.log(applicant);

        return res.status(200).json({
            success: true,
            data: application
        });


    } catch(err) {
        console.log(err);
        return res.status(400).json({
            success: false,
            message: err
        })
    }
});

module.exports = router;
