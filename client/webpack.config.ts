import ESLintPlugin from "eslint-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";

export default {
    entry: "./src/index.ts",
    output: {
        path: path.join(__dirname, "/dist"),
        filename: "[name].bundle.js",
        assetModuleFilename: "assets/[name][ext]",
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader"
            },
            {
                test: /\.(png|jpg|gif)$/,
                type: "asset"
            },
            {
                test: /\.html$/,
                loader: "html-loader"
            }
        ]
    },
    resolve: {
        modules: ["src", "node_modules"],
        extensions: [".ts"]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html"
        }),
        new ESLintPlugin({
            extensions: ["ts"],
            fix: true,
            cache: true
        })
    ],
    devServer: {
        host: "0.0.0.0",
        port: 20310,
        allowedHosts: "all"
    },
    mode: "development"
};
