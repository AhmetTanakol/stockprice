import { sendEmail } from '../utils/email';
import config from '../../config/config';

class MailService {
  private _mailData: any;

  constructor() {
    this._mailData = {};
  }

  set mailData(value: any) {
    this._mailData = value;
  }

  public sendStockPricesEmail() {
    sendEmail(this._mailData);
    console.log('E-mail was sent to the following e-mail address: ', config.sendgrid.test_email);
  }
}

export default MailService;
