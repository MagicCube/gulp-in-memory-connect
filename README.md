# gulp-in-memory-connect
A handy Gulp plugin which allow you easily switch the destination between in-memory and local file storage. When using in-memory mode, it will also start a web server at localhost.

# Install
```
npm install --save-dev gulp-in-memory-connect
```

# Usage
```js
var gulp = require("gulp");
var babel = require("gulp-babel");
var connect = require("gulp-in-memory-connect");

gulp.task("default", ["build"]);

gulp.task("build", function() {
  gulp.src("src/**/*.js")
      .pipe(babel())
      .pipe(connect.dest("./public/assets/", "assets/"));     // before: pipe(gulp.dest("./assets/"))
});

gulp.task("connect:start", [], function() {
  connect.start({
    port: 8888             // By default, port is 8080.
    path: "/my-app/",      // Use the local folder 'public' as the
    localPath: "./public", // server path '/my-app'.
  });
});
```
