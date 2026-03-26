const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
    const isDev = argv.mode === 'development';

    return {
        entry: './src/index.js',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'game.[contenthash].js',
            clean: true,
        },
        devServer: {
            static: './dist',
            port: 8080,
            hot: true,
            open: true,
        },
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader'],
                },
            ],
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './src/index.html',
                title: 'Void Survivors',
                inject: 'body',
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: 'assets',
                        to: 'assets',
                        noErrorOnMissing: true,
                    },
                ],
            }),
        ],
        resolve: {
            extensions: ['.js'],
        },
        performance: {
            maxAssetSize: 5000000,
            maxEntrypointSize: 5000000,
        },
        devtool: isDev ? 'eval-source-map' : false,
    };
};
