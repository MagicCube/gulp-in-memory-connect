"use strict";

const express = require("express");
const gulp = require("gulp");
const gutil = require("gulp-util");
const path = require("path");
const PluginError = gutil.PluginError;
const log = gutil.log;
const through = require("through2");

const PLUGIN_NAME = "gulp-in-memory-connect";

class InMemoryConnect
{
    constructor()
    {
        this.options = null;
        this.expressApp = null;
        this.contentMap = null;
    }

    isDev()
    {
        return this.options && this.options.dev === true;
    }

    checkSetup()
    {
        if (this.options === null)
        {
            throw new PluginError(PLUGIN_NAME, "gulp-in-memory-connect must be set up before use. Please use connect.setup(options) to initialize the plugin.");
        }
    }

    setup(options)
    {
        if (this.expressApp)
        {
            throw new PluginError(PLUGIN_NAME, "gulp-in-memory-connect can not be set up again after the development server was created.");
        }

        const defaultDevServerOptions = {
            port: 8080,
            path: "/",
            localPath: "./"
        };
        if (!options)
        {
            options = {
                dev: false,
                devServerOptions: defaultDevServerOptions
            };
        }

        if (options && options.devServer)
        {
            options.devServer = Object.assign(defaultDevServerOptions, options.devServer);
        }
        else
        {
            options.devServer = defaultDevServerOptions;
        }

        this.options = Object.assign({
            dev: false
        }, options);


        if (this.isDev())
        {
            if (!path.isAbsolute(this.options.devServer.path))
            {
                throw new PluginError(PLUGIN_NAME, "The 'devServer.path' option must be a absolute path like '/', '/abc/'.");
            }

            if (!path.isAbsolute(this.options.devServer.localPath))
            {
                this.options.devServer.localPath = path.resolve(this.options.devServer.localPath);
            }

            this._initExpressApp();
        }
    }

    _initExpressApp()
    {
        this.contentMap = new Map();

        this.expressApp = express();
        this.expressApp.get(path.join(this.options.devServer.path, "/**/*"), (req, res, next) => {
            if (this.contentMap.has(req.path))
            {
                res.write(this.contentMap.get(req.path));
                res.end();
            }
            else
            {
                next();
            }
        });
        this.expressApp.use(this.options.devServer.path, express.static(this.options.devServer.localPath));
    }

    listen(cb)
    {
        this.checkSetup();
        if (this.expressApp === null)
        {
            throw new PluginError(PLUGIN_NAME, "The express app has not been initialized. Have you switched to the [dev] mode?");
        }

        log("Welcome to use the [dev] mode of gulp-in-memory-connect.");
        this.expressApp.listen(this.options.devServer.port, () => {
            log("Local path: " + this.options.devServer.localPath);
            log("The dev-server is now listening at http://localhost:" + this.options.devServer.port + this.options.devServer.path + "...");
            if (typeof(cb) === "function")
            {
                cb();
            }
        });
    }

    dest(destPath)
    {
        this.checkSetup();
        if (this.isDev())
        {
            return through.obj((file, enc, cb) => {
                if (file.isNull())
                {
                    cb(null, file);
                    return;
                }
                if (file.isBuffer() || file.isStream())
                {
                    const relDestPath = path.join(this.options.devServer.path, path.relative(this.options.devServer.localPath, destPath), file.relative);
                    log("[" + relDestPath + "] has been reloaded in memory.");
                    this.contentMap.set(relDestPath, file.contents);
                }
                cb(null, file);
            });
        }
        else
        {
            return gulp.dest(destPath);
        }
    }
}

module.exports = InMemoryConnect;
