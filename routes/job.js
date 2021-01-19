const { Router } = require('express');
const jwt = require('jsonwebtoken');
const Job = require('../models/Job');
const Application = require('../models/Application');

const auth = require('../middleware/auth');

router = Router();

// ROUTE FOR SEARCH PAGE ( Sorted list of jobs based on profession type provided )
router.post('/search/', auth, async(req, res) => {
    try {
        let obj = req.body;
        obj = JSON.parse(JSON.stringify(obj).replace(/"\s+|\s+"/g, '"'));
        // console.log('incoming');
        // console.log(obj);
        // console.log(obj.professionType.length);

        Promise.all(req.body.user.applications.map((application) => {
            const applicationPromise = Application.findById(application.application);
            return applicationPromise;
        })).then((applicationObjArr) => {
            console.log(applicationObjArr);
            const jobIds = applicationObjArr.map((applicationObj) => {
                return applicationObj.job;
            });

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

        Promise.all(obj.professionType.map((i) => {
          console.log('inside array map');
          console.log(i);
          const jobsPromise = Job.find({ professionType: i });
          return jobsPromise;
        })).then((result) => {
          console.log(result);
          return res.status(200).json({
              success: true,
              data: result
          });
        })
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
