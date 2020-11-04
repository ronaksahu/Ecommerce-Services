const authRoutes = require('express').Router();
const User = require('../model/user');
const bcrypt = require('bcrypt');
const { generateAccessToken, generateOtp } = require('../utils/authUtil');
const sendMail = require('../utils/sendOtpService');
const OTP = require('../model/otp');




authRoutes.post('/login', async (req, res) => {

    try {

        const email = req.body.email;
        const password = req.body.password;

        console.log(req.body)

        const user = await User.findOne({email});

        if(!user) return res.status(200).json({ "message": "email is not registered" });

        console.log(user.password)

        const passMatched = await bcrypt.compare(password, user.password);
 
        if(!passMatched) return res.status(200).json({ "message": "Incorrect Password" });

        const userDetail = { username: user.username, contactNo: user.contactNo, email: user.email, accountType: user.accountType };

        res.status(200).json({ 
            "message": "Logged in Successfully",
            userDetail,
            "JWTTOKEN": generateAccessToken({ id: user._id, username: user.username })
        });


    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
    

});

authRoutes.post('/register', async (req, res) => {

    try {
        const username = req.body.username;
        const email = req.body.email;
        const contactNo = req.body.contactNo;
        const password = req.body.password;

        const userEmailExist = await User.exists({email});

        if(userEmailExist) return res.status(200).json({"message": "Email Already Registered"});

        const userContactExists = await User.exists({contactNo});

        if(userContactExists) return res.status(200).json({ "message": "ContactNo Already Registered" });

        const user = new User({ username, email, contactNo, password, accountType: 'customer' });

        const userSave = await user.save();
        res.status(200).json({
            "message": "register Successfull",
            "userDetail": {
                 username,
                 email,
                 contactNo,
                 accountType: 'customer' 
            },
            "JWTTOKEN": generateAccessToken({id: user._id, username})
        });

    }catch(err) {
        console.log('err', err);
        res.sendStatus(500);
    }
    

});

authRoutes.post('/sendOtp', async (req, res) => {

    const email = req.body.email;

    console.log(email);

    try { 
        const userExists = await User.findOne({email}).select({ "username": 1 });

        if(!userExists) return res.status(200).json({ "status": "Email Id is not registered" });

        const otpGenerated = generateOtp();

        const status = await sendMail(email, userExists.username, otpGenerated)

        const otpData = new OTP({
            otp: otpGenerated,
            status,
            userId: userExists._id
        })

        const otpSave = await otpData.save();

        console.log("otp save")

        res.status(200).json({"status": "OTP SENT TO YOUR EMAIL"});

    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
});

authRoutes.post('/verifyOtp', async (req, res) => {

    const otp = req.body.otp;
    const email = req.body.email;

    try {

        const user = await User.findOne({ email }).select({ "_id": 1 });
        
        const otpData = await OTP.findOne({ userId: user._id }).select({ "otp": 1, "status": 1 });

        if(otpData.status !== 'OTP SENT') return res.status(200).json({"status": "OTP INVALID"});

        if(Number(otp) !== otpData.otp)  return res.status(200).json({"status": "OTP INVALID"});

        const otpUpdate = await OTP.update({ userId:user._id, otp, status: 'OTP SENT' }, { status: 'OTP VERIFIED' });

        if(!otpUpdate) return res.status(200).json({"status": "DB UPDATE FAILED"});

        res.status(200).json({ "status": "OTP VERIFIED" })
    } catch(err) {
        res.sendStatus(500);
    }  

})
authRoutes.post('/changePassword', async (req, res) => {
    const { email, password, confirmPassword} = req.body;

    try {
        
        if (password !== confirmPassword) return res.status(200).json({ "status": "Confirm Password Should Match with password"});

        const user = await User.findOne({email});
        console.log(user)

        if(!user) return res.status(200).json({"status": "Email Id is Invalid"});

        const otpStatus = await otp.findOne({ userId: user._id, status: 'OTP VERIFIED'}).select({ "status": 1 });

        if(!otpStatus) return res.status(200).json({ "status": "Something Went Wrong" });

        const updateOtp = await otp.deleteOne({ userId: user._id });

        if(updateOtp.ok !== 1) return res.status(200).json({ "status": "DB UPDATE FAILED" });

        user.password = password;
        
        const updateUserPass = await user.save();
        
        if(!updateUserPass) return res.status(200).json({ "status": "DB UPDATE FAILED" });
       
        res.status(200).json({ "status": "PASSWORDD SUCCESSFULLY CHANGED" })

    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
})



module.exports = authRoutes;