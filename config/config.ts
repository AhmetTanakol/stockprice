const NODE_ENV = 'development';
const config = {
  development: {
    quandl: {
      api_endpoint: process.env.QUANDL_API_ENDPONT ||
                    'https://www.quandl.com/api/v3/datasets/WIKI/',
      api_key: process.env.QUANDL_API_KEY
    },
    limit: 100,
    sendgrid: {
      sendgrid_api_key: process.env.SENDGRID_API_KEY,
      template_id: process.env.SENDGRID_TEMPLATE_ID ||
                   'd-af5c62de122143d183f91621e1c43769',
      test_email: process.env.SENDGRID_TEST_EMAIL || ''
    },
    email: 'active'
  },
  test: {
    quandl: {
      api_endpoint: process.env.QUANDL_API_ENDPONT ||
                    'https://www.quandl.com/api/v3/datasets/WIKI/',
      api_key: process.env.QUANDL_API_KEY
    }
  }
};

export default config[NODE_ENV];
