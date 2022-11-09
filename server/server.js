// declaring required dependencies
const express = require('express');
const path = require('path');
const db = require('./config/connection');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schemas');
const { authMiddleware } = require('./utils/auth');

const PORT = process.env.PORT || 3000;
const app = express();
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// check if we are running the build script
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
}

// using dynamic routing
app.get("*", (req, res) => {
    let url = path.join(__dirname, '../client/build', 'index.html');
    if (!url.startsWith('/app/'))
        url = url.substring(1);
    res.sendFile(url);
});

// function to start the server
const startApolloServer = async (typeDefs, resolvers) => {
    await server.start();
    server.applyMiddleware({ app });

    db.once('open', () => {
        app.listen(PORT, () => {
            console.log(`API server running on port ${PORT}!`);
            console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
        })
    })
};

startApolloServer(typeDefs, resolvers);