module.exports = ({ config }) => {
    config.module.rules.push(
    {
        test: /\.scss$/,
        use:
         [
            'vue-style-loader',
            'css-loader',
            {
                loader: 'sass-loader',
            }
        ]
    }
    );
    return config;
}