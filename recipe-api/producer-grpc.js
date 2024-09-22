const grpc = require("@grpc/grpc-js");
const loader = require("@grpc/proto-loader");
// 1: The producer nees access to the `.proto` file.
// In this case it's loaded and processed when started, incurring a smal startup cost.
const pkg_def = loader.loadSync(__dirname + "/../shared/grpc-recipe.proto");
const recipe = grpc.loadPackageDefinition(pkg_def).recipe;
const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || 4000;
const server = new grpc.Server();

// 2: When a service is defined, an object is provided with properties reflecting the methods defined in
// the `.proto` file.
server.addService(recipe.RecipeService.service, {
  // 3: This method correlates with the `GetMetaData(Empty) method` in the `.proto` definition.
  // The HTTP routes associated with the 2 methods are based on the name of the service and the name of the methods.
  // i.e.: http://localhost:4000/recipe.RecipeService/GetMetaData
  getMetaData: (_call, cb) => {
    cb(null, {
      pid: process.pid,
    });
  },
  getRecipe: (call, cb) => {
    // 4: The `getRecipe()` method makes use of an object passed during the request.
    // This object is provided as `call.request`.
    if (call.request.id !== 42) {
      return cb(new Error(`unknown recipe ${call.request.id}`));
    }
    cb(null, {
      id: 42,
      name: "Chicken Tikka Masala",
      steps: "Throw it in a pot...",
      ingredients: [
        { id: 1, name: "Chicken", quantity: "1 lb" },
        { id: 2, name: "Sauce", quantity: "2 cups" },
      ],
    });
  },
});

// This server listens for incoming HTTP/2 requests sent to localhost via port 4000.
server.bindAsync(
  `${HOST}:${PORT}`,
  // 5: gRPC can use TLS and authentication, but for this example it's disabled.
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) throw err;
    server.start();
    console.log(`Producer running at http://${HOST}:${port}`);
  },
);
