const express = require('express');
const app = express();

const indexRouter = require('./routes');
app.use('/', indexRouter);

app.listen(4000, function () {
  console.log('listening on 4000')
}); 