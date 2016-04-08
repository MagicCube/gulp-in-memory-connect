# gulp-in-memory-connect
A handy Gulp plugin which allow you easily switch the destination between in-memory and local file storage. When using in-memory mode, it will also start a web server at localhost.

# Install
```
npm install --save-dev gulp-in-memory-connect
```

# Usage

## Basis
```js
var babel = require("gulp-babel");
var connect = require("gulp-in-memory-connect");
var gulp = require("gulp");
var runSequence = require("run-sequence");
var watch = require("gulp-watch");

gulp.task("default", function(cb) {
    // The plugin must be set up before use.
    connect.setup({
        dev: false
    });
    runSequence("build", cb);
});

gulp.task("build", function() {
    const glob = "src/**/*.js";
    const chain = gulp.src(glob);
    if (connect.isDev())
    {
        chain.pipe(watch(glob));
    }

    return chain.pipe(babel())
                .pipe(connect.dest("./public/assets/"));
});
```

## Development mode
```js
gulp.task("dev", function(cb) {
    connect.setup({
        dev: true,
        devServer: {
            port: 8888             // By default, port is 8080.
            path: "/my-app/",      // Use the local folder 'public' as the
            localPath: "./public", // server path '/my-app'.
        }
    });
    connect.listen();

    // Now all the built assets will be stored in memory.
    runSequence("build", cb);
});
```
