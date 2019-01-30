import * as MiniCssExtractPlugin from "mini-css-extract-plugin";

import { Configuration, DefinePlugin, Loader } from "webpack";

import { AureliaPlugin } from "aurelia-webpack-plugin";
import { resolve } from "path";
import * as autoprefixer from "autoprefixer";
import * as CopyWebpackPlugin from "copy-webpack-plugin";

export default function config(env?: { release?: boolean }): Configuration {
    const isRelease = env && env.release;

    const cssLoader: Loader[] = [
        { loader: 'css-loader' },
        {
            loader: 'postcss-loader', options: {
                plugins: () => [
                    autoprefixer()
                ]
            }
        }
    ];

    return {
        mode: isRelease ? "production" : "development",
        ...(!isRelease && { devtool: "inline-source-map" }),
        entry: {
            "app": ["aurelia-bootstrapper"]
        },
        output: {
            path: resolve("./wwwroot/dist"),
            publicPath: "dist/",
            filename: "[name].js",
            chunkFilename: "[name].[chunkhash].js",
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    include: /src/,
                    use: { loader: "ts-loader", options: { silent: true, configFile: "tsconfig.app.json" } }
                },
                {
                    test: /\.html$/,
                    use: "html-loader"
                },
                {
                    test: /\.css$/,
                    issuer: path => !/\.html$/.test(path),
                    use: [MiniCssExtractPlugin.loader, ...cssLoader]
                }
            ]
        },
        resolve: {
            extensions: [".ts", ".js"],
            modules: ["src", "node_modules"]
        },
        plugins: [
            new AureliaPlugin(),
            new MiniCssExtractPlugin({
                // filename: "[name].css"
            }),
            new DefinePlugin({
                "__DEBUG__": JSON.stringify(JSON.stringify(!isRelease))
            }),
            new CopyWebpackPlugin([{ from: "locales", to: resolve("wwwroot/locales") }])
        ]
    };
}