const mongoose = require('mongoose');

mongoose.set('useCreateIndex', true);
mongoose.connect("mongodb://localhost:27017/secretsDB", {useNewUrlParser:true,  useUnifiedTopology: true, useFindAndModify:true });


module.exports;

