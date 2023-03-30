import CssMinimizerWebpackPlugin from "css-minimizer-webpack-plugin";
import ESLintPlugin from "eslint-webpack-plugin";
import ExtractCssChunks from "extract-css-chunks-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";
import type webpack from "webpack";
import type { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";

const devMode = process.env.NODE_ENV !== "production";

const config: webpack.Configuration & { devServer?: WebpackDevServerConfiguration } = {
    entry: "./src/index.ts",
    output: {
        path: path.join(__dirname, "/dist"),
        filename: "[name].[contenthash].js",
        chunkFilename: '[id].[contenthash].css',
        assetModuleFilename: "assets/[name][ext]",
        clean: true
    },
    optimization: {
        minimize: devMode ? false : true,
        minimizer: [
            "...",
            new CssMinimizerWebpackPlugin()
        ],
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            },
        }
    },
    cache: {
        type: "memory",
        cacheUnaffected: true
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
            },
            {
                test: /\.css$/,
                exclude: /\.module\.css$/,
                use: [
                    ExtractCssChunks.loader,
                    "css-loader"
                ]
            },
            {
                test: /\.module\.css$/,
                use: [
                    ExtractCssChunks.loader,
                    {
                        loader: "css-loader",
                        options: {
                            modules: {
                                localIdentName: "[name]__[local]--[hash:base64:5]",
                                exportLocalsConvention: "camelCase"
                            }
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        alias: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            "@": path.resolve(__dirname, "src")
        },
        modules: ["src", "node_modules"],
        extensions: [".js", ".jsx", ".ts", ".tsx"],
        fallback: {
            "url": require.resolve("url/")
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html"
        }),
        new ExtractCssChunks({
            filename: devMode ? "[name].css" : "[name].[hash].css",
            chunkFilename: devMode ? "[id].css" : "[id].[hash].css"
        }) as any,
        new ESLintPlugin({
            extensions: ["ts", "tsx"],
            fix: true,
            cache: true
        })
    ],
    devServer: {
        host: "0.0.0.0",
        port: 20310,
        allowedHosts: "all",
        client: {
            logging: "none"
        },
        hot: true
    },
    mode: devMode ? "development" : "production",
};

export default config;
