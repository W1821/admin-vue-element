// 代理配置
module.exports = {
    devServer: {
        proxy: {
            '/*': {
                target: 'http://localhost:8888',
                changOrigin: true,
            },
        }
    }
};
