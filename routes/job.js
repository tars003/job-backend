const { Router } = require('express');
const jwt = require('jsonwebtoken');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Profile = require('../models/Profile');
const Admin = require('../models/Admin');

const auth = require('../middleware/auth');

router = Router();

// GET ALL THE JOBS
router.get('/admin/jobs/:adminId', async(req, res) => {
    try {
        const admin = await Admin.findById(req.params.adminId);
        // If admin is found
        if(admin) {
            const jobs = await Job.find({ admin: admin.id });
            return res.status(200).json({
                success: true,
                length: jobs.length,
                data : jobs,
            })
        }
        // If admin is not found
        else {
            return res.status(404).json({
                success: false,
                message: 'admin not found'
            })
        }
    } catch(err) {
        console.log(err);
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }
});

// ROUTE FOR SEARCH PAGE ( Sorted list of jobs based on profession type provided )
router.post('/search/', auth, async(req, res) => {
    try {
        let obj = req.body;
        obj = JSON.parse(JSON.stringify(obj).replace(/"\s+|\s+"/g, '"'));

        Promise.all(req.body.user.applications.map((application) => {
            const applicationPromise = Application.findById(application.application);
            return applicationPromise;
        })).then((applicationObjArr) => {
            const jobIdArr = applicationObjArr.map((applicationObj) => {
                return applicationObj.job;
            });

            const jobIds = jobIdArr.map(jobId => {
                return String(jobId);
            });

            console.log('job idsssssssssssssss');
            console.log(jobIds);

            // CHECKING IF REQUEST CONTAINS PROFESSION FOR SEARCH
            if(obj.professionType.length > 0) {
                // Querying DB for professions provided
                Promise.all(obj.professionType.map((i) => {
                  const jobsPromise = Job.find({ professionType: i });
                  return jobsPromise;
                })).then((result) => {
                  // BOTH PROFESSION TYPE AND LOCATION ARE PROVIDED
                  if(obj.location.city !== '') {
                    const jobs = [];
                    result.map((data) => {
                        const jobData = [];
                        data.map((job) => {
                            // Fitering out jobs only for the location provided
                            if(job.city == obj.location.city && job.state == obj.location.state) {
                                // Filtering out ALREADY APPLIED JOBS
                                console.log(job.id)
                                console.log(jobIds.includes(job.id))
                                if(!jobIds.includes(job.id)){
                                    jobData.push(job);
                                }
                            }
                        });
                        jobs.push(jobData);
                    })
                    return res.status(200).json({
                        success: true,
                        data: jobs
                    });
                  }
                  // ONLY PROFESSION TYPE WAS PROVIDED
                  else {
                    const jobs = [];
                    result.map((data) => {
                        const jobData = [];
                        data.map((job) => {
                            // Filtering out ALREADY APPLIED JOBS
                            if(!jobIds.includes(job.id)){
                                jobData.push(job);
                            }
                        });
                        jobs.push(jobData);
                    })
                    return res.status(200).json({
                        success: true,
                        data: result
                    });
                }
                });
            }
            // ONLY LOCATION WAS PROVIDED
            else if(obj.location.city !== '') {
                const jobsPromise = Job.find({ city: obj.location.city, state: obj.location.state });
                jobsPromise.then((jobs) => {
                    const jobData = [];
                    jobs.map((job) => {
                        // Filtering out ALREADY APPLIED JOBS
                        if(!jobIds.includes(job.id)){
                            return jobData.push(job);
                        }
                    })
                    return res.status(200).json({
                        success: true,
                        data: [jobData, ]
                    });
                })
            }
            // NEITHER LOCATION NOR PROFESSION TYPE WAS PROVIDED
            else {
                res.status(400).json({
                    success: false,
                    message: 'NEITHER LOCATION NOR PROFESSION TYPE WAS PROVIDED'
                })
            }
        })

    } catch(err) {
        console.log(err);
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }
})


// ROUTE FOR HOME PAGE ( Sorted list of jobs based on profession type provided )
router.post('/search/profession', auth, async(req, res) => {
    try {
        let obj = req.body;
        obj = JSON.parse(JSON.stringify(obj).replace(/"\s+|\s+"/g, '"'));

        Promise.all(req.body.user.applications.map((application) => {
            const applicationPromise = Application.findById(application.application);
            return applicationPromise;
        })).then((applicationObjArr) => {
            console.log(applicationObjArr);
            const jobIds = applicationObjArr.map((applicationObj) => {
                return applicationObj.job;
            });
            Promise.all(obj.professionType.map((i) => {
              // console.log('inside array map');
              // console.log(i);
              const jobsPromise = Job.find({ professionType: i });
              return jobsPromise;
            })).then((result) => {
                // console.log(result);
                const jobs = [];

                const jobIdArr = jobIds.map(jobId => {
                    return String(jobId);
                })

                result.map((data) => {
                    const jobData = [];
                    data.map((job) => {
                        // Filtering out ALREADY APPLIED JOBS\
                        if(!jobIdArr.includes(job.id)){
                            jobData.push(job);
                        }
                    });
                    jobs.push(jobData);
                })
                return res.status(200).json({
                    success: true,
                    data: jobs
                });
            })
        });


    } catch(err) {
        console.log(err);
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }
})

// VIEW INDIVIDUAL JOB DETAILS
router.get('/view/:jobId', async(req, res) => {
    try {
        const job = await Job.findById(req.params.jobId);
        // If job exists
        if(job) {
            const admin = await Admin.findById(job.admin);
            return res.status(200).json({
                success: true,
                data: {
                    job,
                    admin
                }
            })
        }
        //  If job does not exists
        else {
            return res.status(404).json({
                success: false,
                message: 'job not found'
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

// CHANGE STATUS FOR JOB
router.post('/change/status', async(req, res) => {
    try {
        let obj = req.body;
        obj = JSON.parse(JSON.stringify(obj).replace(/"\s+|\s+"/g, '"'));
        const { job, active } = obj;
        const jobObj = await Job.findById(job);
        // If job is found
        if(jobObj) {
            const newJob = await jobObj.updateOne({
                active : obj.active
            })
            jobObj.save();
            console.log(newJob);

            return res.status(200).json({
                success: true
            })
        }
        // IF job is not found
        else {
            return res.status(404).json({
                success: false,
                message: 'job not found',
            });
        }

    } catch(err) {
        console.log(err);
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }
})

// ROUTE TO CREATE A JOB
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
