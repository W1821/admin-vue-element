module.exports = {
    // 代理配置
    devServer: {
        proxy: 'http://localhost:8888'
    },
    // 打包的静态文件父级目录
    assetsDir: 'static'
};
