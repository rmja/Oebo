import * as CopyPlugin from "copy-webpack-plugin";
import * as HtmlPlugin from "html-webpack-plugin";
import * as MiniCssExtractPlugin from "mini-css-extract-plugin";

import { Configuration, DefinePlugin } from "webpack";

import { AureliaPlugin } from "aurelia-webpack-plugin";
import { resolve } from "path";

const config = (env: any, argv: any): Configuration => ({
    entry: ["aurelia-bootstrapper"],
    module: {
        rules: [
            { test: /\.html$/, use: "html-loader" },
            { test: /\.css$/, use: [MiniCssExtractPlugin.loader, "css-loader"] },
            { test: /\.ts$/, use: "ts-loader" },
        ]
    },
    resolve: {
        extensions: [".ts", ".js"],
        modules: ["src", "node_modules"].map(x => resolve(x)),
        alias: {
            "locales": resolve("./locales")
        }
    },
    plugins: [
        new AureliaPlugin(),
        new HtmlPlugin({ template: 'index.html' }),
        new CopyPlugin([{ from: "**/*", to: "", context: "assets" }]),
        new MiniCssExtractPlugin(),
        new DefinePlugin({__DEBUG__: JSON.stringify(argv.mode === "development")})
    ],
    devServer: {
        contentBase: "dist"
    }
});

export default config;