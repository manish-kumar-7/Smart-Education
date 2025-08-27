const mongoose = require('mongoose');
const Owner = require('./owner'); 
require("dotenv").config();
const URL=process.env.URL;
//console.log(URL)
mongoose.connect("mongodb://localhost:27017/SmartEducation");
async function createOwner() {
  const existingOwner = await Owner.findOne({ singleton: 'ONLY_ONE_OWNER' });

  if (existingOwner) {
    console.log('Owner already exists');
    process.exit(0);
  }

  const owner = new Owner({
    ownername: 'Manish Kumar',
    email: 'manish@gmail.com',
    password: '$2b$10$rwyELFanVrsi5qim5vjHK.5HThm1WM6Xy35oXwUvgcCyRSbHtKA1m', 
    role: 'owner',
    singleton: 'ONLY_ONE_OWNER'
  });

  await owner.save();
  console.log('Owner created successfully');
  process.exit(0);
}

createOwner().catch((err) => {
  console.error('Error creating owner:', err);
  process.exit(1);
});
