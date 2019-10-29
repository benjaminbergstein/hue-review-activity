const { ApolloServer } = require("apollo-server");
const { ApolloGateway} = require("@apollo/gateway");

const gateway = new ApolloGateway({
  serviceList: [
    { name: "users", url: "http://localhost:4000" },
    { name: "colors", url: "http://localhost:4002" },
  ]
})

const start = async () => {
  const { schema, executor } = await gateway.load();
  const server = new ApolloServer({ schema, executor });
  const { url } = await server.listen(4003);
  console.log(`Server running ${url}`);
};

start();
