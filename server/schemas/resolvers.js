// declaring dependencies
const { AuthenticationError } = require('apollo-server-express');
const { User, Timesheet } = require('../models');
const { signToken } = require('../utils/auth');

// creating resolvers for graphql
const resolvers = {
    // used for querying our data
    Query: {
        user: async (parent, { userId }) => {
            return User.findOne({ _id: userId });
        },
        timesheet: async (parent, { timesheetId }) => {
            return Timesheet.findOne({ _id: timesheetId });
        },
        users: async () => {
            return await User.find({});
        },
        timesheets: async () => {
            return await Timesheet.find({});
        },
        userTimesheets: async (parent, { owner }) => {
            return await Timesheet.find({ owner: owner });
        }
    },

    // used for modifying our data
    Mutation: {
        addUser: async (parent, { username, password }) => {
            const user = await User.create({ username, password });
            const token = signToken(user);

            return { token, user };
        },
        addTimesheet: async (parent, { owner, description, rate }) => {
            return Timesheet.create({ owner, description, rate });
        },
        editTimesheet: async (parent, { timesheetId, owner, description, rate }) => {
            return Timesheet.findOneAndUpdate(
                { _id: timesheetId },
                { $set: { owner: owner, description: description, rate: rate } },
            );
        },
        deleteTimesheet: async (parent, { timesheetId }) => {
            return Timesheet.findOneAndDelete({ _id: timesheetId });
        },
        addLineItem: async (parent, { timesheetId, date, minutes }) => {
            return Timesheet.findOneAndUpdate(
                { _id: timesheetId },
                { $addToSet: { lineItems: { date, minutes } } },
                { new: true }
            );
        },
        editLineItem: async (parent, { lineItemsId, date, minutes }) => {
            return Timesheet.findOneAndUpdate(
                { 'lineItems._id': lineItemsId },
                { $set: { 'lineItems.$.date': date, 'lineItems.$.minutes': minutes } },
            );
        },
        deleteLineItem: async (parent, { timesheetId, lineItemsId }) => {
            return Timesheet.findOneAndUpdate(
                { _id: timesheetId },
                { $pull: { lineItems: { _id: lineItemsId } } },
                { new: true }
            );
        },
        login: async (parent, { username, password }) => {
            const user = await User.findOne({ username });
            console.log(user);
            if (!user) {
                throw new AuthenticationError('Incorrect login credentials!');
            };

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect login credentials!');
            };

            const token = signToken(user);

            return { token, user };
        }
    }
};

module.exports = resolvers;