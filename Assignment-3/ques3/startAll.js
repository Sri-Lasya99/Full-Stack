const { fork } = require('child_process');
const path = require('path');

console.log('====================================================');
console.log(' Starting All Microservices (Student, Course, Gateway)');
console.log('====================================================');

const services = [
  { name: 'Student Service (Port 4001)', script: path.join(__dirname, 'studentService.js') },
  { name: 'Course Service  (Port 4002)', script: path.join(__dirname, 'courseService.js') },
  { name: 'API Gateway     (Port 3000)', script: path.join(__dirname, 'gateway.js') }
];

const processes = [];

services.forEach((service) => {
  const child = fork(service.script);
  processes.push(child);
  console.log(`Launched ${service.name}`);
});

// Clean up all child processes on exit (Ctrl + C)
function cleanup() {
  console.log('\nShutting down all microservices...');
  processes.forEach((proc) => {
    if (!proc.killed) {
      proc.kill();
    }
  });
  process.exit();
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);
