const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');
console.log(User)

const resolvers = {
    Query: {
        getSingleUser: async (parent, { user, params }) => {
            return User.findOne({
                $or: [{ _id: user ? user._id : params.id }, { username: params.username }],
            });
        },
    },
    Mutation: {
        createUser: async (parent, { username, email, password }) => {
            const userData = await User.create({ username: username, email: email, password: password });
            const token = signToken(userData);

            return { token, userData };
        },
        login: async (parent, { email, password }) => {
            const userData = await User.findOne({ email });

            if (!userData) {
                throw new AuthenticationError('No profile with this email found!');
            };
            console.log(userData)
            const correctPassword = await userData.isCorrectPassword(password);

            if (!correctPassword) {
                throw new AuthenticationError('Incorrect Password')
            };

            const token = signToken(userData);
            return { token, userData };
        },
        saveBook: async (parent, { user, body }, context) => {
            if (context.user) {
                const bookData = await User.findOneAndUpdate(
                    { _id: user._id },
                    { $addToSet: { savedBooks: body } },
                    { new: true, runValidators: true }
                )
                return { bookData }
            }
            throw new AuthenticationError('You must be logged in!')
        },
        deleteBook: async (parent, { user, params }) => {
            const updatedUser = await User.findOneAndUpdate(
                { _id: user._id },
                { $pull: { savedBooks: { bookId: params.bookId } } },
                { new: true }
            )
            if (!updatedUser) {
                throw new AuthenticationError("Couldn't find user with this id")
            }
            return { updatedUser }
        }
    }
};

module.exports = resolvers;