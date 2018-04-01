import * as CopyPlugin from "copy-webpack-plugin";
import * as HtmlPlugin from "html-webpack-plugin";

import { AureliaPlugin } from "aurelia-webpack-plugin";
import { Configuration } from "webpack";
import { resolve } from "path";

const config: Configuration = {
    entry: [ "aurelia-bootstrapper"],
    output: {
        filename: "bundle.js"
    },
    module: {
        rules: [
            { test: /\.html$/, use: "html-loader" },
            { test: /\.ts$/, use: "ts-loader" },
        ]
    },
    resolve: {
        extensions: [".ts", ".js"],
        modules: ["src", "node_modules"].map(x => resolve(x))
    },
    plugins: [
        new AureliaPlugin(),
        new HtmlPlugin({template: 'index.html'}),
        new CopyPlugin([{from: "**/*", to: "", context: "assets"}])
    ]
}

export default config;