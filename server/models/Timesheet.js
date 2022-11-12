// declaring dependencies
const { Schema, model } = require('mongoose');

// here we are defining the timesheet schema
const timesheetSchema = new Schema({
    owner: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    rate: {
        type: Number,
        required: true,
        trim: true
    },
    lineItems: [
        {
            date: {
                type: String,
                required: true,
                trim: true,
            },
            minutes: {
                type: Number,
                returned: true,
                trim: true
            }
        }
    ]

});

const Timesheet = model('Timesheet', timesheetSchema);

module.exports = Timesheet;