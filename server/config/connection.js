const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://maunghtike:ZESFf2MNaGEkj8nN@mh-cluster.a9yk5.mongodb.net/test" || 'mongodb://localhost:27017/timesheet-assessment-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

module.exports = mongoose.connection;
