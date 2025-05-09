import { TimeSpanLike } from './interfaces';

export class TimeSpan {
  public static readonly MILLIS_PER_SECOND = 1000;
  public static readonly MILLIS_PER_MINUTE = TimeSpan.MILLIS_PER_SECOND * 60;
  public static readonly MILLIS_PER_HOUR = TimeSpan.MILLIS_PER_MINUTE * 60;
  public static readonly MILLIS_PER_DAY = TimeSpan.MILLIS_PER_HOUR * 24;

  public static readonly ZERO = new TimeSpan(0);
  public static readonly MAX_VALUE = new TimeSpan(Number.MAX_SAFE_INTEGER);
  public static readonly MIN_VALUE = new TimeSpan(Number.MIN_SAFE_INTEGER);

  private static _TIMEZONE_OFFSET: TimeSpan;
  public static get TIMEZONE_OFFSET() {
    if (!this._TIMEZONE_OFFSET) {
      this._TIMEZONE_OFFSET = TimeSpan.fromMinutes(
        new Date().getTimezoneOffset() * -1,
      );
    }

    return TimeSpan._TIMEZONE_OFFSET;
  }

  private readonly _millis: number;

  constructor(millis: number) {
    this._millis = millis;
  }

  public get milliseconds(): number {
    return TimeSpan.round(this._millis % 1000);
  }

  public get seconds(): number {
    return TimeSpan.round((this._millis / TimeSpan.MILLIS_PER_SECOND) % 60);
  }

  public get minutes(): number {
    return TimeSpan.round((this._millis / TimeSpan.MILLIS_PER_MINUTE) % 60);
  }

  public get hours(): number {
    return TimeSpan.round((this._millis / TimeSpan.MILLIS_PER_HOUR) % 24);
  }

  public get days(): number {
    return TimeSpan.round(this._millis / TimeSpan.MILLIS_PER_DAY);
  }

  public get totalDays(): number {
    return this._millis / TimeSpan.MILLIS_PER_DAY;
  }

  public get totalHours(): number {
    return this._millis / TimeSpan.MILLIS_PER_HOUR;
  }

  public get totalMinutes(): number {
    return this._millis / TimeSpan.MILLIS_PER_MINUTE;
  }

  public get totalSeconds(): number {
    return this._millis / TimeSpan.MILLIS_PER_SECOND;
  }

  public get totalMilliseconds(): number {
    return this._millis;
  }

  public add(ts: TimeSpan): TimeSpan {
    const result = this._millis + ts.totalMilliseconds;
    return new TimeSpan(result);
  }

  public subtract(ts: TimeSpan): TimeSpan {
    const result = this._millis - ts.totalMilliseconds;
    return new TimeSpan(result);
  }

  public addDays(value: number): TimeSpan {
    const result = this._millis + value * TimeSpan.MILLIS_PER_DAY;
    return new TimeSpan(result);
  }

  public subtractDays(value: number): TimeSpan {
    const result = this._millis - value * TimeSpan.MILLIS_PER_DAY;
    return new TimeSpan(result);
  }

  public addHours(value: number): TimeSpan {
    const result = this._millis + value * TimeSpan.MILLIS_PER_HOUR;
    return new TimeSpan(result);
  }

  public subtractHours(value: number): TimeSpan {
    const result = this._millis - value * TimeSpan.MILLIS_PER_HOUR;
    return new TimeSpan(result);
  }

  public addMinutes(value: number): TimeSpan {
    const result = this._millis + value * TimeSpan.MILLIS_PER_MINUTE;
    return new TimeSpan(result);
  }

  public subtractMinutes(value: number): TimeSpan {
    const result = this._millis - value * TimeSpan.MILLIS_PER_MINUTE;
    return new TimeSpan(result);
  }

  public addSeconds(value: number): TimeSpan {
    const result = this._millis + value * TimeSpan.MILLIS_PER_SECOND;
    return new TimeSpan(result);
  }

  public addMilliseconds(value: number): TimeSpan {
    const result = this._millis + value;
    return new TimeSpan(result);
  }

  public subtractSeconds(value: number): TimeSpan {
    const result = this._millis - value * TimeSpan.MILLIS_PER_SECOND;
    return new TimeSpan(result);
  }

  public subtractMilliseconds(value: number): TimeSpan {
    const result = this._millis - value;
    return new TimeSpan(result);
  }

  public negate(): TimeSpan {
    return new TimeSpan(-this._millis);
  }

  public equals(value?: any) {
    if (value instanceof TimeSpan) {
      return this._millis === value._millis;
    }

    return false;
  }

  public valueOf() {
    return this._millis;
  }

  public toJSON() {
    return this.toString();
  }

  public toString() {
    let msecs = this._millis;

    let negative = msecs < 0;

    const timeArrText: string[] = [];
    timeArrText.push(to2Digits(Math.floor(Math.abs(this.totalHours))));
    timeArrText.push(to2Digits(this.minutes));
    timeArrText.push(to2Digits(this.seconds));

    let text = timeArrText.join(':');

    if (negative) {
      text = '-' + text;
    }

    return text;
  }

  public static fromDays(value: number): TimeSpan {
    return TimeSpan.interval(value, TimeSpan.MILLIS_PER_DAY);
  }

  public static fromHours(value: number): TimeSpan {
    return TimeSpan.interval(value, TimeSpan.MILLIS_PER_HOUR);
  }

  public static fromMilliseconds(value: number): TimeSpan {
    return TimeSpan.interval(value, 1);
  }

  public static fromMinutes(value: number): TimeSpan {
    return TimeSpan.interval(value, TimeSpan.MILLIS_PER_MINUTE);
  }

  public static fromSeconds(value: number): TimeSpan {
    return TimeSpan.interval(value, TimeSpan.MILLIS_PER_SECOND);
  }

  public static fromTime(
    hours: number,
    minutes: number,
    seconds: number,
  ): TimeSpan;
  public static fromTime(
    days: number,
    hours: number,
    minutes: number,
    seconds: number,
    milliseconds: number,
  ): TimeSpan;
  public static fromTime(
    daysOrHours: number,
    hoursOrMinutes: number,
    minutesOrSeconds: number,
    seconds?: number,
    milliseconds?: number,
  ): TimeSpan {
    if (milliseconds != undefined) {
      return this.fromTimeStartingFromDays(
        daysOrHours,
        hoursOrMinutes,
        minutesOrSeconds,
        seconds,
        milliseconds,
      );
    } else {
      return this.fromTimeStartingFromHours(
        daysOrHours,
        hoursOrMinutes,
        minutesOrSeconds,
        0,
      );
    }
  }

  private static fromTimeStartingFromHours(
    hours: number,
    minutes: number,
    seconds: number,
    milliseconds: number,
  ): TimeSpan {
    const millis =
      TimeSpan.timeToMilliseconds(hours, minutes, seconds) + milliseconds;
    return new TimeSpan(millis);
  }

  private static fromTimeStartingFromDays(
    days: number,
    hours: number,
    minutes: number,
    seconds: number,
    milliseconds: number,
  ): TimeSpan {
    const totalMilliSeconds =
      days * TimeSpan.MILLIS_PER_DAY +
      hours * TimeSpan.MILLIS_PER_HOUR +
      minutes * TimeSpan.MILLIS_PER_MINUTE +
      seconds * TimeSpan.MILLIS_PER_SECOND +
      milliseconds;

    if (
      totalMilliSeconds > TimeSpan.MAX_VALUE.totalMilliseconds ||
      totalMilliSeconds < TimeSpan.MIN_VALUE.totalMilliseconds
    ) {
      throw new Error('TimeSpanTooLong');
    }
    return new TimeSpan(totalMilliSeconds);
  }

  public static parse(span: TimeSpanLike | Date): TimeSpan {
    if (span instanceof TimeSpan) {
      return span;
    }

    if (span instanceof Date) {
      span = Date.now() - span.getTime();
    }

    if (typeof span === 'number') {
      return new TimeSpan(span);
    }

    if (!span) {
      return null;
    }

    if (typeof span === 'object') {
      const { days, hours, minutes, seconds, milliseconds } = span;

      return TimeSpan.fromTime(
        days || 0,
        hours || 0,
        minutes || 0,
        seconds || 0,
        milliseconds || 0,
      );
    }

    const tokens = span.split(':');
    const seconds = tokens[2].split('.');
    let milliseconds: number;
    if (seconds.length === 2) {
      milliseconds = +seconds[1].slice(0, 3);
    } else {
      milliseconds = 0;
    }

    const days = tokens[0].split('.');
    if (days.length == 2) {
      return TimeSpan.fromTimeStartingFromDays(
        +days[0],
        +days[1],
        +tokens[1],
        +seconds[0],
        milliseconds,
      );
    }

    return TimeSpan.fromTimeStartingFromHours(
      +tokens[0],
      +tokens[1],
      +seconds[0],
      milliseconds,
    );
  }

  private static interval(value: number, scale: number): TimeSpan {
    if (Number.isNaN(value)) {
      throw new Error("value can't be NaN");
    }

    const tmp = value * scale;
    const millis = TimeSpan.round(tmp + (value >= 0 ? 0.5 : -0.5));
    if (
      millis > TimeSpan.MAX_VALUE.totalMilliseconds ||
      millis < TimeSpan.MIN_VALUE.totalMilliseconds
    ) {
      throw new Error('TimeSpanTooLong');
    }

    return new TimeSpan(millis);
  }

  private static round(n: number): number {
    if (n < 0) {
      return Math.ceil(n);
    } else if (n > 0) {
      return Math.floor(n);
    }

    return 0;
  }

  private static timeToMilliseconds(
    hour: number,
    minute: number,
    second: number,
  ): number {
    const totalSeconds = hour * 3600 + minute * 60 + second;
    if (
      totalSeconds > TimeSpan.MAX_VALUE.totalSeconds ||
      totalSeconds < TimeSpan.MIN_VALUE.totalSeconds
    ) {
      throw new Error('TimeSpanTooLong');
    }

    return totalSeconds * TimeSpan.MILLIS_PER_SECOND;
  }
}

function to2Digits(n) {
  return String(n).padStart(2, '0');
}
