const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  let filePath = '.' + req.url;

  if (filePath === './') {
    filePath = './index.html';
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
  };

  const contentTypeHeader = contentType[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // File not found, serve 404 page
        fs.readFile('./404.html', (error, notFoundContent) => {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end(notFoundContent, 'utf-8');
        });
      } else {
        // Other error occurred
        res.writeHead(500);
        res.end('Server Error');
      }
    } else {
      // File found, serve the content
      res.writeHead(200, { 'Content-Type': contentTypeHeader });
      res.end(content, 'utf-8');
    }
  });
});

const port = 8080;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});