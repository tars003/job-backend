const { Router } = require('express');
const jwt = require('jsonwebtoken');
const Profile = require('../models/Profile');
const Admin = require('../models/Admin');
const Job = require('../models/Job');
const Application = require('../models/Application');

const auth = require('../middleware/auth');
const { formatOccupations } = require('../middleware/occupations');

router = Router();

// GET ALL APPLICANTS FOR A JOB
router.get('/all/job/:jobId', async(req, res) => {
    try {
        const job = await Job.findById(req.params.jobId);
        // If job exists
        if(job) {
            const applications = await Application.find({ job: job.id })
            Promise.all(applications.map((application) => {
                const applicant = Profile.findById(application.applicant);
                return applicant;
            }))
                .then((applicants) => {
                    console.log(applicants);
                    return res.status(200).json({
                        success: true,
                        length: applications.length,
                        data : applicants
                    })
                })
        }
        // If job does not exists
        else {
            return res.stats(404).json({
                success: false,
                message: 'job not found'
            });
        }


    } catch(err) {
        console.log(err);
        return res.status(400).json({
            success: true,
            message: err
        })
    }
});

// GET APPLIED JOBS for a profile
router.get('/view/applicant', auth, async(req, res) => {
    try {
        const applicant = await Profile.findById(req.body.user.id);
        var applicationsArr;

        const applicationsPromise =  applicant.applications.map((application) => {
            return Application.findById(application.application);
        });

        const statusArr = [];
        Promise.all(applicationsPromise)
            .then((res) => {
                // console.log(res);
                return res;
            })
            .then((res) => {
                const jobPromise = Promise.all(res.map((application) => {
                    statusArr.push(application.status);
                    return Job.findById(application.job);
                }))
                return jobPromise;
            }).then((result) => {
                const data = result.map((job, index) => {
                    return {job, status: statusArr[index]};
                })
                return res.status(200).json({
                    success: true,
                    jobs: data
                });
            })

    } catch(err) {
        console.log(err);
        return res.status(400).json({
            success: true,
            message: err
        })
    }
});


// GET INDIVIDUAL APPLICATION
router.get('/view/:applicationId', async(req, res) => {
    try {
        const application = await Application.findById(req.params.applicationId);
        // If application exists
        if(application) {
            const job = await Job.findById(application.job);
            const applicant = await Profile.findById(application.applicant);
            return res.status(200).json({
                success: true,
                data: {
                    applicant,
                    job,
                    status: application.status
                }
            })
        }
        // If application does not exist
        else {
            return res.status(404).json({
                success: false,
                message: 'application not found'
            })
        }


    } catch(err) {
        console.log(err);
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }
})

// CHANGE STATUS OF APPLICATION
router.post('/change/status', async(req, res) => {
    try {
        let obj = req.body;
        obj = JSON.parse(JSON.stringify(obj).replace(/"\s+|\s+"/g, '"'));
        const {  status } = obj;
        const application = await Application.findById(obj.application);
        // If application exists
        if(application) {
            application.status = status;
            application.save();
            return res.status(200).json({
                success: true
            })
        }
        // If application does not exist
        else {
            return res.status(404).json({
                success: false,
                message: 'application not found',
            })
        }

    } catch(err) {
        console.log(err);
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }
})

// CREATE APPLICATION with jobId and profileId
router.post('/create', auth, async(req, res) => {
    try {
        let obj = req.body;
        obj = JSON.parse(JSON.stringify(obj).replace(/"\s+|\s+"/g, '"'));
        const applicantId = req.body.user.id;
        obj['applicant'] = applicantId;
        const application = new Application(obj);
        await application.save();
        const applicant = await Profile.findById(applicantId);

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
