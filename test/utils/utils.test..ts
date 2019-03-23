import { round } from '../../app/utils/index';

describe ('Utils Tests', () => {
  test('number is integer, no need to round up', done => {
      expect(round(2)).toEqual(2);
      done();
    });

  test('round up, result has to have 2 digits after decimal point', done => {
      expect(round(2.905616)).toEqual(2.91);
      done();
    });

  test('round up, result has to have 2 digits after decimal point', done => {
      expect(round(2.901616)).toEqual(2.90);
      done();
    });

  test('round up number, result has to have 1 digit after decimal point', done => {
      expect(round(2.9019)).toEqual(2.9);
      done();
    });

  test('round up, given number has only 1 digit after decimal point', done => {
      expect(round(2.9)).toEqual(2.9);
      done();
    });

  test('should calculate monthly interest amount, round up to integer', done => {
      expect(round(2.999616)).toEqual(3);
      done();
    });
});
