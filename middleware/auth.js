const jwt = require("jsonwebtoken");

const Profile = require("../models/Profile");
const Admin = require("../models/Admin");

module.exports = async function (req, res, next) {
  const token = req.get("auth-token");

  if(token){
    try {
      console.log(token);
      const { data } = jwt.verify(token, process.env.JWT_SECRET);
      const id = data.id;
      let user = await Profile.findById(id);
      if(!user) {
        user = await Admin.findById(id);
      }
      if (user) {
        req.body.user = user;
        next();
      } else{
        console.log('No user found for the provided token !');
        return res.status(404).json({
          sucess: false,
          message: 'No user found for the provided token !'
        })
      }
    } catch(err) {
      console.log(err)
      return res.status(400).json({
        sucess: false,
        message: err
      });
    }

  } else{
    console.log('JWT must be provided !');
    return res.status(400).json({
      sucess: false,
      message: 'JWT must be provided !'
    });
  }


};
