const devConfig = require("./webpack.development.config");
const webpack = require("webpack");

webpack(devConfig, (err, stats) => {
    if (err || stats.hasErrors()) {
        console.log(err, stats);
    }
});
