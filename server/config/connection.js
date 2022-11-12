const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://maunghtike:<password>@mh-cluster.a9yk5.mongodb.net/?retryWrites=true&w=majority" || 'mongodb://localhost:27017/timesheet-assessment-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

module.exports = mongoose.connection;
