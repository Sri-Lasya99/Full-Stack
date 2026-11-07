const EventEmitter = require('events');
const fs = require('fs');
const http = require('http');
class Logger extends EventEmitter {
    constructor() {
        super();

        this.on('info', (message) => {
            const log = `${new Date().toISOString()} INFO: ${message}\n`;
            fs.appendFile('app.log', log, (err) => {
                if (err) console.log(err);
            });
        });

        this.on('error', (message) => {
            const log = `${new Date().toISOString()} ERROR: ${message}\n`;

            fs.appendFile('app.log', log, (err) => {
                if (err) console.log(err);
            });

            console.error(message);
        });
    }

    info(message) {
        this.emit('info', message);
    }

    error(message) {
        this.emit('error', message);
    }
}

const logger = new Logger();

const server = http.createServer((req, res) => {
    logger.info(`${req.method} ${req.url}`);

    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Request received');
});

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});