exports.getOneUser= (req, res, next) => {
    // get params of req
    console.log(req.params);
    res.status(200).json({'message': "Yaaay"})
};