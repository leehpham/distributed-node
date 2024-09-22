// npm install fastify@3.2 fastify-gql@5.3
const server = require("fastify")();
const graphql = require("fastify-gql");
const fs = require("fs");
// 1: The schema file is provided to the `graphql` package.
const schema = fs
  .readFileSync(__dirname + "/../shared/graphql-schema.gql")
  .toString();
const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || 4000;

// 2: The `resolvers` object tells `graphql` how to build responses.
const resolvers = {
  // 3: The `Query` entry represents the top-level query.
  Query: {
    pid: () => process.pid,
    recipe: async (_obj, { id }) => {
      if (id != 42) throw new Error(`recipe ${id} not found`);
      return {
        id,
        name: "Chicken Tikka Masala",
        steps: "Throw it in a pot...",
      };
    },
  },
  // 4: The `Recipe` resolver is run when a Recipe is retrieved.
  Recipe: {
    ingredients: async (obj) => {
      return obj.id != 42
        ? []
        : [
            { id: 1, name: "Chicken", quantity: "1 lb" },
            { id: 2, name: "Sauce", quantity: "2 cups" },
          ];
    },
  },
};

// Once the GraphQL code has run the `resolvers` and has received the top-level recipe it expects from the `recipe()`
// method call, and assuming the client has requested the `ingredients`, it's now ready to call the code to
// hydrate those ingredient values, which is `resolvers.Recipe.ingredients`.
// Now the `obj` arg contains information about the parent object `Recipe`.
// The parent object contains all of the information that was returned from the `recipe()` method call.

server
  // 5: Fastify uses `server.register()` with the `fastify-gql` package; other frameworks have
  // their own conventions.
  .register(graphql, { schema, resolvers, graphiql: true })
  .listen(PORT, HOST, (err) => {
    if (err) {
      throw err;
    }
    console.log(`Producer running at http://${HOST}:${PORT}/graphql`);
  });
