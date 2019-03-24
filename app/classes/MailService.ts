import { sendEmail } from '../utils/email';
import config from '../../config/config';
import { isEmpty } from 'lodash';

/**
 * Mail service that encapsulates mail sending
 * Mail data is set by objects that use this service
 */
class MailService {
  private _mailData: any;

  constructor() {
    this._mailData = {};
  }

  set mailData(value: any) {
    this._mailData = value;
  }

  /**
   * Email is sent when there is a provided test email and email sending is activated
   * Currently, email is sent when all information is fetched at once
   */
  public sendStockPricesEmail() {
    if (config.email === 'active' && config.sendgrid.test_email !== '') {
      if (this._mailData === undefined || isEmpty(this._mailData)) {
        console.log('E-mail can not be sent without mail data');
      } else {
        sendEmail(this._mailData);
        console.log('E-mail was sent to the following e-mail address: ', config.sendgrid.test_email);
      }
    } else {
      console.log('Empty email address or e-email sending is not active');
    }
  }
}

export default MailService;
