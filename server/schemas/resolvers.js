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
        userTimesheets: async (parent, { user }) => {
            return await Timesheet.find({ user: user });
        }
    },

    // used for modifying our data
    Mutation: {
        addUser: async (parent, { username, password }) => {
            const user = await User.create({ username, password });
            const token = signToken(user);

            return { token, user };
        },
        addTimesheet: async (parent, args) => {
            return Timesheet.create(args);
        },
        addLineItem: async (parent, { timesheetId, date, rate, minutes }) => {
            return Timesheet.findOneAndUpdate(
                { _id: timesheetId },
                { $addToSet: { lineItems: { date, rate, minutes } } },
                { new: true }
            );
        },
        editLineItem: async (parent, { lineItemsId, date, rate, minutes }) => {
            return Timesheet.findOneAndUpdate(
                { 'lineItems._id': lineItemsId },
                { $set: { 'lineItems.$.date': date, 'lineItems.$.rate': rate, 'lineItems.$.minutes': minutes } },
            )
        },
        deleteTimesheet: async (parent, { timesheetId }) => {
            return Timesheet.findOneAndDelete({ _id: timesheetId });
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
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect login credentials!');
            }

            const token = signToken(user);

            return { token, user };
        }
    }
};

module.exports = resolvers;