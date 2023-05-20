const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const chalk = require('chalk');
const multer = require('multer');
const cors = require('cors');

const logDirectory = path.join(__dirname, '../logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = fs.createWriteStream(path.join(logDirectory, `${moment().format('YYYY-MM-DD')}.log`), { flags: 'a' });

const morganMiddleware = morgan((tokens, req, res) => {
    const status = res.statusCode;
    let color;
    if (status >= 500) {
        color = 'red';
    } else if (status >= 400) {
        color = 'yellow';
    } else if (status >= 300) {
        color = 'cyan';
    } else if (status >= 200) {
        color = 'green';
    } else {
        color = 'reset';
    }
    const logMessage = [
        moment().format('YYYY-MM-DD HH:mm:ss'),
        chalk.keyword(color)(tokens.method(req, res)),
        chalk.keyword(color)(tokens.url(req, res)),
        chalk.keyword(color)(tokens.status(req, res)),
        chalk.hex('#b3cde0').bold(tokens['response-time'](req, res) + ' ms'),
        '-',
        chalk.hex('#b3cde0')(tokens['remote-addr'](req, res)),
        'from',
        chalk.hex('#b3cde0')(tokens['referrer'](req, res) || '-'),
        chalk.hex('#b3cde0')(tokens['user-agent'](req, res))
    ].join(' ');

    accessLogStream.write(logMessage + '\n');

    return logMessage;
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, `${file.originalname}-${Date.now()}${path.extname(file.originalname)}`);
    },
  });

const upload = multer({ storage });

const corsMiddleware = cors();

module.exports = { morganMiddleware, upload, corsMiddleware };
