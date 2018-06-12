import { TimeUtil } from './time-util';

const {
  isTime,
  formatTime,
  buildListFromTo: buildList,
  duration,
} = TimeUtil;

describe('TimeUtil', () => {

  describe('isTime',  () => {
    const validTimes = [
      '9:00 AM',
      '11.00 PM',
      '8.15 am',
      '8.16 pm',
      '14.00',
      '9 AM',
    ];
    it ('should evaluate valid time to true: ' + validTimes.join(', '), () => {
      validTimes.forEach(timeString => expect(isTime(timeString)).toBeTruthy());
    });

    const invalidTimes = [
      '9:60 am',
      '12:00 km',
      '14:00 am',
    ];
    it ('should evaluat invalid time to false: ' + invalidTimes.join(', '), () => {
      invalidTimes.forEach(timeString => expect(isTime(timeString)).toBeFalsy());
    });

  });

  describe ('formatTime', () => {
    it (`should format time input to consistent output,
         using : for hour and min separatin and uppercase AM/ PM, and producing empty string on invalid time`, () => {
      [
        ['9.00 AM', '9:00 AM'],
        ['12:01 am', '12:01 AM'],
        ['14.00', '2:00 PM'],
        ['14.00 PM', ''],
        ['9:30 AM', '9:30 AM']
      ].forEach(([inputValue, expectedOutput]) => {
        expect(formatTime(inputValue)).toBe(expectedOutput);
      });
    });
  });

  describe ('buildListFromTo', () => {
    it ('should build time list using timeForm, timeTo and default step of 15', () => {
      const timeFrom = '9:00 AM';
      const	timeTo = '10:15 AM';
      const	expectedList = [
        '9:00 AM',
        '9:15 AM',
        '9:30 AM',
        '9:45 AM',
        '10:00 AM',
        '10:15 AM',
      ];
      expect(buildList(timeFrom, timeTo)).toEqual(expectedList);
    });

    it ('should build time list from not correctly formated but valid time string using step of 30 min', () => {
      const timeFrom = '11 AM';
      const timeTo = '1 PM';
      const timeStep = 30;
      const expectedList = [
        '11:00 AM',
        '11:30 AM',
        '12:00 PM',
        '12:30 PM',
        '1:00 PM',
      ];
      expect(buildList(timeFrom, timeTo, timeStep)).toEqual(expectedList);
    });

    it ('should produce empty list if from to time contains invalid time string', () => {
      const timeFrom = '11.60 AM';
      expect(buildList('11.60 AM', '1:00 PM', 30)).toEqual([]);
    });

    it ('should produse empty first item if startWithEmpy parameter is set to true', () => {
      const timeFrom = '5:00 PM';
      const timeTo = '6:00 PM';
      const	startWithEmpty = true;
      const timeStep = 30;
      const expectedList = [
        '',
        '5:00 PM',
        '5:30 PM',
        '6:00 PM',
      ];

      expect(buildList(timeFrom, timeTo, timeStep, startWithEmpty)).toEqual(expectedList);
    });

    it ('should produce list with duration if show duration parameter is set to true', () => {
      const timeFrom = '9:00 AM';
      const	timeTo = '11:30 AM';
      const timeStep = 30;
      const	startWithEmpty = false;
      const showDuration = true;
      const	expectedList = [
        '9:00 AM',
        '9:30 AM (30 mins)',
        '10:00 AM (1 hr)',
        '10:30 AM (1 hr 30 mins)',
        '11:00 AM (2 hrs)',
        '11:30 AM (2 hrs 30 mins)',
      ];

      expect(buildList(timeFrom, timeTo, timeStep, startWithEmpty, showDuration)).toEqual(expectedList);
    });

  });
});
