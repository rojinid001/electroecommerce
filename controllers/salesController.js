
const Product = require('../models/product'); 
const numberofusers=async(req,res)=>{
    try {
        const totalUsers = await User.countDocuments();
        return totalUsers;
      } catch (error) {
        console.error(error);
        throw new Error('Error retrieving total users');
      }
}
const adminDashboard = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    res.render('adminDashboard', { totalProducts });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};
module.exports={
    numberofusers,
    adminDashboard,
}