// quite broad treatment of time  valid values just minutes
// format h:mm with optional am/pm, lack of am/pm defaults to am

export const TimeUtil = {
  isTime,
  formatTime,
  buildListFromTo,

  timeToMin,
  minToTime,
  duration
};

const reTime = /^(\d|1\d+|2[0-4])( (?!=\d)|:|\.)([0-5]\d)? *(am|pm)*$/i;
const reFormatted = /^(\d|1\d+|2[0-4]):([0-5]\d) (AM|PM)$/;
const reTimeIsNot = /^(1[3-9]|2[0-4])(:|\.)(\d{2}) *(am|pm)$/i;

function isTime(ts) {
  return reTime.test(ts) && !reTimeIsNot.test(ts);
  // ? true
  // : !isNaN(+ts) && +ts < 24 // time in hours only
}

function timeToMin(ts) {
  const tArr = !(reTimeIsNot.test(ts)) && reTime.exec(ts);
  if (!tArr) { return NaN; }


  const [, hours, seperator, minutes, ampm = 'am'] = tArr;

  // 12 AM should produce 0 hours
  const numerichours = hours === '12' && ampm.toUpperCase() !== 'PM'
    ? 0
    : +hours;

  const addPmHours = /PM/i.test(ampm) && numerichours < 12 ? 12 : 0;

  // if minutes is undedfined as for 9 AM entry replace it with 0
  return (numerichours + addPmHours) * 60 + ( +minutes || 0);
}

function minToTime(min) {
  if (isNaN(min)) { return ''; }

  let hours = Math.floor(min / 60);
  const minutes = min % 60;
  let minutes_str;
  minutes_str = (minutes < 10 ? '0' : '') + minutes; // adding leading zero

  const ampm = hours % 24 < 12 ? 'AM' : 'PM';
  hours = hours < 13
    ? hours
    : hours % 12;

  // if hours is 0 change it to 12
  return (hours || 12) + ':' + minutes_str + ' ' + ampm;
}

function formatTime(ts) {
  return reFormatted.test(ts) ? ts : minToTime(timeToMin(ts));
}

function buildListFromTo(
  fromTime, toTime, step = 15,
  startWithEmpty = false, showDuration = false) {
  // step = step || 15;
  const startMin = timeToMin(fromTime);
  const toMin = timeToMin(toTime);
  const listArr = [];

  if (startWithEmpty) { listArr.push(''); }

  for (let i = startMin; i <= toMin; i += step) {
    listArr.push(
      minToTime(i) +
      (showDuration
        ? (' (' + duration(i - startMin) + ')').replace(' ()', '') : '')
    );
  }

  return listArr;
}

function duration(min) {
  const hours = Math.floor(min / 60);
  const minutes = min % 60;

  const hours_str = hours
    ? hours + (hours > 1 ? ' hrs ' : ' hr ')
    : ' ';

  const minutes_str = minutes ? minutes + ' mins' : '';

  return (hours_str + minutes_str).replace(/^ | $/, '');
}
