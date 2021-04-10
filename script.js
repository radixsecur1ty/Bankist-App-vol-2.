'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
/////////////////////////////////////////////////

/////////////////////////////////////////////////
let currentAccount = 0;
let sorted = false;
//create userNames
const userNames = accounts.map(
  (a, b) =>
    (accounts[b].userName = a.owner
      .slice()
      .split(' ')
      .map(a => a[0])
      .join(''))
);
/////////////////////////////////////////////////
/////////////////////////////////////////////////

/////////////////////////////////////////////////
//login section
btnLogin.addEventListener('click', e => {
  e.preventDefault();
  const currAcc = accounts?.find(a => a.userName === inputLoginUsername.value);
  if (currAcc?.pin === Number(inputLoginPin.value)) {
    containerApp.style.opacity = '100';
    currentAccount = currAcc;
    refreshUI();
  } else {
    alert('Invalid username or password!');
  }
  inputLoginPin.value = inputLoginUsername.value = '';
  inputLoginPin.blur();
});
//global functions
function refreshUI() {
  boxMovements();
  calcIn();
  calcOut();
  calcInterest();
  calcBallance();
}
/////////////////////////////////////////////////
//box movements
function boxMovements() {
  containerMovements.textContent = '';
  let copy = currentAccount.movements.slice();
  let copied = sorted ? copy.sort((a, b) => b - a) : currentAccount.movements;
  copied.map((a, b) => {
    let direction = a > 0 ? 'deposit' : 'withdrawal';
    let str = `<div class="movements__row">
    <div class="movements__type movements__type--${direction}">
      ${b + 1} ${direction}
    </div>
    <div class="movements__date">24/01/2037</div>
    <div class="movements__value">${a}€</div>
  </div>`;
    containerMovements.insertAdjacentHTML('beforeend', str);
  });
}
/////////////////////////////////////////////////
//sort button
btnSort.addEventListener('click', () => {
  sorted = !sorted;
  boxMovements();
});
/////////////////////////////////////////////////
//calculate sums
function calcBallance() {
  labelBalance.textContent = `${Math.round(
    currentAccount.movements.reduce((a, b) => a + b, 0)
  )}€`;
}
function calcIn() {
  labelSumIn.textContent = `${Math.round(
    currentAccount.movements.filter(a => a > 0).reduce((a, b) => a + b, 0)
  )}€`;
}
function calcOut() {
  labelSumOut.textContent = `${Math.round(
    currentAccount.movements.filter(a => a < 0).reduce((a, b) => a + b, 0)
  )}€`;
}
function calcInterest() {
  labelSumInterest.textContent = `${Math.round(
    currentAccount.movements
      .filter(a => a > 0)
      .map(a => (a * currentAccount.interestRate) / 100)
      .reduce((a, b) => a + b, 0)
  )}€`;
}
////////////////////////////////////////////////////////////
//transfer to section
btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  let transTo = accounts?.find(a => a.userName === inputTransferTo.value);
  if (
    transTo &&
    currentAccount !== transTo &&
    Math.round(currentAccount.movements.reduce((a, b) => a + b, 0)) >=
      Number(inputTransferAmount.value) &&
    inputTransferAmount.value > 0
  ) {
    currentAccount.movements.push(-Number(inputTransferAmount.value));
    transTo.movements.push(Number(inputTransferAmount.value));
    refreshUI();
  } else {
    alert('Something wrong!!');
  }
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();
});

///////////////////////////////////////////////////////////////
//loan section
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  let validForLoan = currentAccount.movements.some(
    a => Number(inputLoanAmount.value) < a * 0.1
  );
  if (validForLoan && Number(inputLoanAmount.value) > 0) {
    currentAccount.movements.push(Number(inputLoanAmount.value));
    refreshUI();
  } else alert('Something Wrong');
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});
//////////////////////////////////////////////////////////////////////////////////////
//close account function
btnClose.addEventListener('click', e => {
  e.preventDefault();
  if (
    currentAccount?.userName === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    accounts.splice(accounts.indexOf(currentAccount), 1);
    containerApp.style.opacity = '0';
  } else {
    alert('Something wrong!');
  }
  inputClosePin.value = inputCloseUsername.value = '';
  inputClosePin.blur();
});
//////////////////////////////////////////////////////////////////////////////////////////////////
//
//secont try of the version control
