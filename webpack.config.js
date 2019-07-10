var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var SOURCE_DIR = path.resolve(__dirname, 'src');
var JAVASCRIPT_DIR = SOURCE_DIR + '/javascript';
var BUILD_DIR = path.resolve(__dirname, 'build');
var NODEMODULES_DIR = path.resolve(__dirname, 'node_modules');

module.exports = {
    context: SOURCE_DIR,
    resolve: {
        modules: [
            path.resolve(JAVASCRIPT_DIR),
            path.resolve(NODEMODULES_DIR + '/@opendocsg/pdf2md/lib'),
            path.resolve(NODEMODULES_DIR)
        ]
    },
    entry: {
        app: ['core-js', 'regenerator-runtime/runtime', './javascript/index.jsx']
    },
    output: {
        path: BUILD_DIR,
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                // Ask webpack to check: If this file ends with .js, then apply some transforms
                test: /\.jsx?$/,
                loader: 'babel-loader',
                options: {
                    configFile: path.resolve('babel.config.js')
                },
                include: [JAVASCRIPT_DIR, NODEMODULES_DIR + '/@opendocsg/pdf2md/lib'],
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            },
            {
                test: /\.png$/,
                loader: "url-loader?limit=100000"
            },
            {
                test: /\.jpg$/,
                loader: "file-loader"
            },
            {
                test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader?limit=10000&mimetype=application/font-woff'
            },
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader?limit=10000&mimetype=application/octet-stream'
            },
            {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file-loader'
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader?limit=10000&mimetype=image/svg+xml'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html'
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'version': JSON.stringify(process.env.npm_package_version),
                NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
            }
        }),
        new CopyWebpackPlugin([
            {
                from: NODEMODULES_DIR + '/pdfjs-dist/build/pdf.worker.js',
                to: 'bundle.worker.js'
            },
        ]),
        new CopyWebpackPlugin([
            {
                from: NODEMODULES_DIR + '/pdfjs-dist/cmaps',
                to: 'cmaps'
            },
        ]),
        new CopyWebpackPlugin([
            {
                from: 'favicons',
                to: 'favicons'
            },
        ])
    ]
}