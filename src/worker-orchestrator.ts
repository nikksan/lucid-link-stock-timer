import { cpus } from 'node:os';
import cluster from 'node:cluster';

const numCPUs = cpus().length;
for (let i = 0; i < numCPUs; i++) {
  const worker = cluster.fork();

  worker.on('online', () => {
    console.log(`worker ${worker.process.pid} is online`);
  });
}

cluster.on('exit', (worker, code, signal) => {
  console.log(`worker ${worker.process.pid} exited with code ${code} [${signal}]`);
  cluster.fork();
});
