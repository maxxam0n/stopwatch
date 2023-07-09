// UI
const stopwatch = document.querySelector('.stopwatch');
const results = stopwatch.querySelector('.stopwatch__results');
const btns = stopwatch.querySelectorAll('.stopwatch__btns > button');
const circle = stopwatch.querySelector('#circle');
const minute = stopwatch.querySelector('#minute');
const second = stopwatch.querySelector('#second');
const millisecond = stopwatch.querySelector('#millisecond');

// Служебные переменные
let isStart = false;
let time = [0, 0, 0];
let circleCount = 0;
let circleTimers = [];
let circleTimerElements = [];

const clickEvent = new Event('click');

// Переключает кнопку старта на кнопку стоп, и наоборот
function toggleStart(button) {
	isStart = !isStart;
	button.textContent = isStart ? 'Стоп' : 'Старт';
	button.classList.toggle('stopwatch__start');
	button.classList.toggle('stopwatch__stop');
}

// Очищает секундомер
function resetTimer(timer) {
	timer.time = [0, 0, 0];
	timer.timerElements.forEach((el, idx) => {
		if (idx == 0) {
			el.textContent = '0';
		} else {
			el.textContent = '00';
		}
	});
}

class Timer {
	constructor(millisecond, second, minute, time) {
		this.timerElements = [millisecond, second, minute];
		this.time = time;
	}

	set timerId(id) {
		this._timerId = id;
	}

	get timerId() {
		return this._timerId;
	}

	startTimer() {
		this.time[0] += 1;

		if (this.time[0] == 10) {
			this.time[0] = 0
			this.time[1] += 1;
		}

		if (this.time[1] == 60) {
			this.time[1] = 0;
			this.time[2] += 1;
		}

		this.timerElements.forEach((el, idx) => {
			if (this.time[idx] <= 9 && idx != 0)
				el.innerHTML = '0' + this.time[idx];
			else
				el.innerHTML = this.time[idx];
		});
	}
}

const mainTimer = new Timer(millisecond, second, minute, time);

btns.forEach(button => {

	if (button.closest('#start')) {
		button.addEventListener('click', function () {

			if (!isStart) {
				mainTimer.timerId = setInterval(function () {
					mainTimer.startTimer();
				}, 100);

				toggleStart(this);

				circle.dispatchEvent(clickEvent);
			}
			else {
				clearInterval(mainTimer.timerId);
				clearInterval(circleTimers[circleCount - 1].timerId);
				toggleStart(this);
			}
		});
	}

	if (button.closest('#circle')) {
		button.addEventListener('click', function () {
			if (isStart) {
				let time = [0, 0, 0];
				this.hidden = false;
				circleCount++;

				if (circleCount > 1) {
					clearInterval(circleTimers[circleCount - 2].timerId);
				}

				const circleData = document.createElement('div');

				circleData.classList.add('stopwatch__data');

				circleData.innerHTML = `<p>Круг ${circleCount}</p><p><span id="circle_${circleCount}_minute">00</span>:<span id="circle_${circleCount}_second">00</span>,<span id="circle_${circleCount}_millisecond">00</span></p>`;

				const millisecond = circleData.querySelector(`#circle_${circleCount}_millisecond`);
				const second = circleData.querySelector(`#circle_${circleCount}_second`);
				const minute = circleData.querySelector(`#circle_${circleCount}_minute`);

				const circleTimer = new Timer(millisecond, second, minute, time);

				circleTimer.timerId = setInterval(function () {
					circleTimer.startTimer();
				}, 100);

				circleTimers.push(circleTimer);
				circleTimerElements.push(circleData);

				results.insertAdjacentElement('afterbegin', circleData);
			}
		});
	}

	if (button.closest('#reset')) {
		button.addEventListener('click', function () {
			clearInterval(mainTimer.timerId);
			clearInterval(circleTimers[circleCount - 1]?.timerId);

			isStart = false;

			circleTimerElements.forEach(el => {
				el.remove();
			});

			resetTimer(mainTimer);

			circleTimers = [];
			circleTimerElements = [];
			circleCount = 0;

			btns.forEach(button => {
				if (button.closest('#start')) {
					button.classList.add('stopwatch__start');
					button.classList.remove('stopwatch__stop');
					button.textContent = 'Старт';
				}

				if (button.closest('#circle')) {
					button.hidden = true;
				}
			});
		});
	}
});

