// 1: The `cluster` module is needed in the parent process.
const cluster = require("cluster");
console.log(`master pid=${process.pid}`);
cluster.setupMaster({
  // 2: Override the default application entry point of `__filename`.
  exec: __dirname + "/producer-http-basic.js",
});
// 3: `cluster.fork()` is called once for each time a workder needs to be created.
// This code produces 2 workers.
cluster.fork();
cluster.fork();

cluster
  // 4: Several events that `cluster` emits are listened to and logged.
  .on("disconnect", (worker) => {
    console.log("disconnect", worker.id);
  })
  .on("exit", (worker, code, signal) => {
    console.log("exit", worker.id, code, signal);
    // 5: Uncomment this to make workers difficult to kill.
    // cluster.fork();
  })
  .on("listening", (worker, { address, port }) => {
    console.log("listening", worker.id, `${address}:${port}`);
  });
