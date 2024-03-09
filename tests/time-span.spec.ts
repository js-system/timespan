import { TimeSpan } from '../src/time-span';

function expectFromHours(time: TimeSpan | null, hours: number) {
	expect(time).toBeDefined();
	expect(time).toBeInstanceOf(TimeSpan);
	expect(time?.totalHours === hours).toBeTruthy();
	expect(time?.totalMinutes === 60 * hours).toBeTruthy();
	expect(time?.totalSeconds === 60 * 60 * hours).toBeTruthy();
	expect(time?.hours === hours).toBeTruthy();
	expect(time?.minutes === 0).toBeTruthy();
	expect(time?.seconds === 0).toBeTruthy();
	expect(time?.milliseconds === 0).toBeTruthy();
}

function expectFromMinutes(time: TimeSpan | null, minutes: number) {
	expect(time).toBeDefined();
	expect(time).toBeInstanceOf(TimeSpan);
	expect(time?.totalMinutes === minutes).toBeTruthy();
	expect(time?.totalSeconds === 60 * minutes).toBeTruthy();
	expect(time?.hours === 0).toBeTruthy();
	expect(time?.minutes === minutes).toBeTruthy();
	expect(time?.seconds === 0).toBeTruthy();
	expect(time?.milliseconds === 0).toBeTruthy();
}

function expectFromSeconds(time: TimeSpan | null, seconds: number) {
	expect(time).toBeDefined();
	expect(time).toBeInstanceOf(TimeSpan);
	expect(time?.totalSeconds === seconds).toBeTruthy();
	expect(time?.hours === 0).toBeTruthy();
	expect(time?.minutes === 0).toBeTruthy();
	expect(time?.seconds === seconds).toBeTruthy();
	expect(time?.milliseconds === 0).toBeTruthy();
}

function expectFromMilliseconds(time: TimeSpan | null, milliseconds: number) {
	expect(time).toBeDefined();
	expect(time).toBeInstanceOf(TimeSpan);
	expect(time?.totalMilliseconds === milliseconds).toBeTruthy();
	expect(time?.hours === 0).toBeTruthy();
	expect(time?.minutes === 0).toBeTruthy();
	expect(time?.seconds === 0).toBeTruthy();
	expect(time?.milliseconds === milliseconds).toBeTruthy();
}

const hoursToTest = [1, 2, 3];
const minutesToTest = [1, 2, 3];
const secondsToTest = [1, 2, 3];

describe('TimeSpan', () => {
	test('Should create from text using Parse', () => {
		for (const hours of hoursToTest) {
			expectFromHours(TimeSpan.parse(`0${hours}:00:00`), hours);
		}

		for (const minutes of minutesToTest) {
			expectFromMinutes(TimeSpan.parse(`00:0${minutes}:00`), minutes);
		}

		for (const seconds of secondsToTest) {
			expectFromSeconds(TimeSpan.parse(`00:00:0${seconds}`), seconds);
		}
	});

	test('Should create from milliseconds using Parse', () => {
		for (const hours of hoursToTest) {
			expectFromHours(TimeSpan.parse(hours * 60 * 60 * 1000), hours);
		}

		for (const minutes of minutesToTest) {
			expectFromMinutes(TimeSpan.parse(minutes * 60 * 1000), minutes);
		}

		for (const seconds of secondsToTest) {
			expectFromSeconds(TimeSpan.parse(seconds * 1000), seconds);
		}
	});

	test('Should create from milliseconds using fromMilliseconds', () => {
		for (const hours of hoursToTest) {
			expectFromHours(TimeSpan.fromMilliseconds(hours * 60 * 60 * 1000), hours);
		}

		for (const minutes of minutesToTest) {
			expectFromMinutes(
				TimeSpan.fromMilliseconds(minutes * 60 * 1000),
				minutes,
			);
		}

		for (const seconds of secondsToTest) {
			expectFromSeconds(TimeSpan.fromMilliseconds(seconds * 1000), seconds);
		}
	});

	test('Should create from seconds using fromSeconds', () => {
		for (const hours of hoursToTest) {
			expectFromHours(TimeSpan.fromSeconds(hours * 60 * 60), hours);
		}

		for (const minutes of minutesToTest) {
			expectFromMinutes(TimeSpan.fromSeconds(minutes * 60), minutes);
		}

		for (const seconds of secondsToTest) {
			expectFromSeconds(TimeSpan.fromSeconds(seconds), seconds);
		}
	});

	test('Should create from minutes using fromMinutes', () => {
		for (const hours of hoursToTest) {
			expectFromHours(TimeSpan.fromMinutes(hours * 60), hours);
		}

		for (const minutes of minutesToTest) {
			expectFromMinutes(TimeSpan.fromMinutes(minutes), minutes);
		}

		for (const seconds of secondsToTest) {
			expectFromSeconds(TimeSpan.fromMinutes(seconds / 60), seconds);
		}
	});

	test('Should create from hours using fromHours', () => {
		for (const hours of hoursToTest) {
			expectFromHours(TimeSpan.fromHours(hours), hours);
		}

		for (const minutes of minutesToTest) {
			expectFromMinutes(TimeSpan.fromHours(minutes / 60), minutes);
		}

		for (const seconds of secondsToTest) {
			expectFromSeconds(TimeSpan.fromHours(seconds / 60 / 60), seconds);
		}
	});

	test('Add TimeSpan', () => {
		let time = TimeSpan.parse(`01:00:00`);
		let time2 = time?.add(TimeSpan.parse(`01:00:00`));

		expect(time === time2).toBeFalsy();
		expectFromHours(time, 1);
		expectFromHours(time2, 2);
	});

	test('Add Hours', () => {
		let time = TimeSpan.parse(`01:00:00`);
		let time2 = time?.addHours(1);

		expect(time === time2).toBeFalsy();
		expectFromHours(time, 1);
		expectFromHours(time2, 2);
	});

	test('Add Minutes', () => {
		let time = TimeSpan.parse(`00:01:00`);
		let time2 = time?.addMinutes(1);

		expect(time === time2).toBeFalsy();
		expectFromMinutes(time, 1);
		expectFromMinutes(time2, 2);
	});

	test('Add Seconds', () => {
		let time = TimeSpan.parse(`00:00:01`);
		let time2 = time?.addSeconds(1);

		expect(time === time2).toBeFalsy();
		expectFromSeconds(time, 1);
		expectFromSeconds(time2, 2);
	});

	test('Add Milliseconds', () => {
		let time = TimeSpan.parse(`00:00:00`);
		let time2 = time?.addMilliseconds(100);

		expect(time === time2).toBeFalsy();
		expectFromMilliseconds(time, 0);
		expectFromMilliseconds(time2, 100);
	});

	test('Subtract TimeSpan', () => {
		let time = TimeSpan.parse(`02:00:00`);
		let time2 = time?.subtract(TimeSpan.parse(`01:00:00`));

		expect(time === time2).toBeFalsy();
		expectFromHours(time, 2);
		expectFromHours(time2, 1);
	});

	test('Subtract Hours', () => {
		let time = TimeSpan.parse(`02:00:00`);
		let time2 = time?.subtractHours(1);

		expect(time === time2).toBeFalsy();
		expectFromHours(time, 2);
		expectFromHours(time2, 1);
	});

	test('Subtract Minutes', () => {
		let time = TimeSpan.parse(`00:02:00`);
		let time2 = time?.subtractMinutes(1);

		expect(time === time2).toBeFalsy();
		expectFromMinutes(time, 2);
		expectFromMinutes(time2, 1);
	});

	test('Subtract Seconds', () => {
		let time = TimeSpan.parse(`00:00:02`);
		let time2 = time?.subtractSeconds(1);

		expect(time === time2).toBeFalsy();
		expectFromSeconds(time, 2);
		expectFromSeconds(time2, 1);
	});

	test('Subtract Milliseconds', () => {
		let time = TimeSpan.fromMilliseconds(200);
		let time2 = time?.subtractMilliseconds(100);

		expect(time === time2).toBeFalsy();
		expectFromMilliseconds(time, 200);
		expectFromMilliseconds(time2, 100);
	});
});
