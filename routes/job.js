const { Router } = require('express');
const jwt = require('jsonwebtoken');
const Job = require('../models/Job');

const auth = require('../middleware/auth');

router = Router();

// ROUTE FOR SEARCH PAGE ( Sorted list of jobs based on profession type provided )
router.post('/search/', auth, async(req, res) => {
    try {
        let obj = req.body;
        obj = JSON.parse(JSON.stringify(obj).replace(/"\s+|\s+"/g, '"'));
        console.log('incoming');
        console.log(obj);
        console.log(obj.professionType.length)


        if(obj.professionType.length > 0) {
            console.log('inside log 1')
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
                        if(job.city == obj.location.city && job.state == obj.location.state) {
                            jobData.push(job);
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
                return res.status(200).json({
                    success: true,
                    data: result
                });
            }
            });
        }
        // ONLY LOCATION WAS PROVIDED
        else if(obj.location.city !== '') {
            console.log('log inside 2nd')
            const jobs = await Job.find({ city: obj.location.city, state: obj.location.state });
            return res.status(200).json({
                success: true,
                data: jobs
            });
        }
        // NEITHER LOCATION NOR PROFESSION TYPE WAS PROVIDED
        else {
            console.log('inside else last')
            res.status(400).json({
                success: false,
                message: 'NEITHER LOCATION NOR PROFESSION TYPE WAS PROVIDED'
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
