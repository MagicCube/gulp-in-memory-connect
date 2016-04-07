# gulp-in-memory-connect
A handy Gulp plugin which allow you easily switch the destination between in-memory and local file storage. When using in-memory mode, it will also start a web server at localhost.

# Install
```
npm install --save-dev gulp-in-memory-connect
```

# Usage
```js
var gulp = require('gulp');
var connect = require("gulp-in-memory-connect");

gulp.task("connect:start", [], function() {
  connect.start({
    port: 8080,
    
  });
});
```
