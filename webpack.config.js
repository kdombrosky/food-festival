const path = require('path');
// to be able to use jquery characters
const webpack = require('webpack');
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const WebpackPwaManifest = require("webpack-pwa-manifest");

module.exports = { 
    devServer: {
        static: {
            directory: __dirname
        } 
    },
    // the root of the bundle/beginning of dependency graph 
    // aka relative path to client's code
    // this is where webpack looks to start building the module
    entry: {
        app: "./assets/js/script.js",
        events: "./assets/js/events.js",
        schedule: "./assets/js/schedule.js",
        tickets: "./assets/js/tickets.js"
    },
    // provide path to folder to send bundled code
    // tell webpack where files will go, and the name of file
    output: {
        filename: "[name].bundle.js",
        path: __dirname + "/dist",
    },
    // loaders configure here
    module: {
        rules: [
            {
                // test property to find a regex, 
                // in this case any image file with .jpg extension
                test: /\.jpg$/i,
                // add file-loader here
                use: [
                    {
                        loader: 'file-loader',
                        // to rename files and change output path
                        options: {
                            // to not treate files as ES5 modules
                            esModule: false,
                            // return name of file with extension
                            name (file) {
                                return "[path][name].[ext]"
                            },
                            // replaces assignment URL by replacing '../' from require() with '/assets/'
                            publicPath: function(url) {
                                return url.replace("../", "/assets/")
                            }
                        }
                    },
                    {
                        loader: 'image-webpack-loader'
                    }
                ]
            }
        ]
    },

    // plugins configured here
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
        new BundleAnalyzerPlugin({
            // the report outputs to an HTML file in the dist folder named report.html
            // set value to disable to stop this
            analyzerMode: 'static', 
        }),
        new WebpackPwaManifest({
            name: "Food Event",
            short_name: "Foodies",
            description: "An app that allows you to view upcoming food events.",
            start_url: "../index.html",
            background_color: "#01579b",
            theme_color: "#ffffff",
            fingerprints: false,
            inject: false,
            icons: [{
                src: path.resolve("assets/img/icons/icon-512x512.png"),
                sizes: [96, 128, 192, 256, 384, 512],
                destination: path.join("assets", "icons")
            }]
        })
    ],
    // development offers hot reloading of webpack and debugging features
    // production will run ??uglify?? and build source files into minimized files
    mode: 'development'
};

