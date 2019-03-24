import sgMail from '@sendgrid/mail';
import config from '../../config/config';

sgMail.setApiKey(config.sendgrid.sendgrid_api_key);

export const sendEmail = (data: any) => {
  const mailData = {
    from: 'liqid_coding_challenge@challenge.com',
    template_id: config.sendgrid.template_id,
    personalizations: [
      {
        to:[
          {
            email: config.sendgrid.test_email
          }
        ],
        dynamic_template_data: {
          startDate: data.startDate,
          endDate: data.endDate,
          stockPrices: data.stockPrices,
          drawnDowns: data.drawnDowns,
          maxDrawndown: data.maxDrawndown,
          returnRate: data.returnRate,
          symbol: data.symbol,
          receipt: true,
          name: 'Liqid',
          address01: 'Kurfürstendamm 177',
          city: 'Berlin',
          zip: '10707'
        }
      }
    ]
  };

  sgMail.send(mailData);
};