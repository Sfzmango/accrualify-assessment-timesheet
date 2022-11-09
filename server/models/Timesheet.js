// declaring dependencies
const { Schema, model } = require('mongoose');

// here we are defining the timesheet schema
const timesheetSchema = new Schema({
    user: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    lineItems: [
        {
            rate: {
                type: Number,
                required: true,
                trim: true
            },
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