const { ApolloServer, gql } = require("apollo-server");
const { addColor, countColors, findColors, findColor } = require("./lib");
const { buildFederatedSchema } = require("@apollo/federation");

const typeDefs = gql`
  scalar DateTime

  type Color {
    id: ID!
    title: String!
    value: String!
    created: DateTime!
    createdBy: User! @provides(fields: "email")
  }

  type Query {
    totalColors: Int!
    allColors: [Color!]!
  }

  extend type User @key(fields: "email") {
    email: ID! @external
    postedColors: [Color!]
  }
`;

const resolvers = {
  Query: {
    totalColors: (_, __, { countColors }) => countColors(),
    allColors: (_, __, { findColors }) => findColors()
  },
  User: {
    postedColors: ({ email }, _, { findColors }) => findColors(email),
  }
};

const start = async () => {
  const server = new ApolloServer({
    schema: buildFederatedSchema({
      typeDefs,
      resolvers,
    }),
    context: ({ req }) => ({
      countColors,
      findColors,
      addColor,
      findColor
    })
  });

  server.listen(process.env.PORT).then(({ url }) => {
    console.log(`       🎨 🖍  - Color service running at: ${url}`);
  });
};

start();
