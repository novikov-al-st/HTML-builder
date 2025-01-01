const path = require('path');
const fs = require('fs');

const fileName = 'text.txt';
const rs = new fs.ReadStream(path.resolve(__dirname, fileName), 'utf-8');

rs.pipe(process.stdout);
