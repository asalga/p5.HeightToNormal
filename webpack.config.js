module.exports = {
    mode: "development",
    devServer: {
        contentBase: './dist'
    },
    output: {
        filename: 'p5.HeightToNormal.js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/
        }]
    }
}