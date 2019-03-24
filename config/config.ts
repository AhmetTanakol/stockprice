const NODE_ENV = 'development';
const config = {
  development: {
    quandl: {
      api_endpoint: process.env.QUANDL_API_ENDPONT ||
                    'https://www.quandl.com/api/v3/datasets/WIKI/',
      api_key: process.env.QUANDL_API_KEY || 'Gy-GuEPqtyvM4u1SvooJ'
    },
    limit: 100
  },
  test: {
    quandl: {
      api_endpoint: process.env.QUANDL_API_ENDPONT ||
                    'https://www.quandl.com/api/v3/datasets/WIKI/',
      api_key: process.env.QUANDL_API_KEY || 'Gy-GuEPqtyvM4u1SvooJ'
    }
  }
};

export default config[NODE_ENV];
