'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// MODAL

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.close-modal');

// Function to add 'hidden' class
const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

// Close modal window when close button is clicked
btnCloseModal.addEventListener('click', closeModal);

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const account5 = {
  owner: 'Ayyan Jamil',
  movements: [430, -200, 600, 450, -700, 50, 90],
  interestRate: 1.2,
  pin: 5555,
};

const account6 = {
  owner: 'Zain Jamil',
  movements: [300, -200, 520, 450, -400, 650, 90],
  interestRate: 1.3,
  pin: 6666,
};

const account7 = {
  owner: 'Saad Jamil',
  movements: [, 10000, 300, -200, 520, 450, -400, 650, 90],
  interestRate: 1.2,
  pin: 7777,
};

const accounts = [
  account1,
  account2,
  account3,
  account4,
  account5,
  account6,
  account7,
];

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

// function to display movements (and sort)
const displayMovements = function (movements, sort = false) {
  const mov = sort ? movements.slice().sort((a, b) => a - b) : movements;

  containerMovements.innerHTML = '';
  mov.forEach(function (mov, i) {
    const type = mov < 0 ? 'withdrawal' : 'deposit';
    const html = `
  <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${mov}€</div>
  </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// function to calculate and display total balance
const calcDisplayBalance = function (acc) {
  const balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  acc.balance = balance;
  labelBalance.textContent = `${acc.balance}€`;
};

// function to calculate and display total incomes, outcomes and interest (summary)
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const outcomes = Math.abs(
    acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0)
  );
  labelSumOut.textContent = `${outcomes}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(interest => interest >= 1)
    .reduce((acc, interest) => acc + interest, 0);

  labelSumInterest.textContent = `${interest}€`;
};

// Computing usernames
const createUsernames = function (accounts) {
  accounts.forEach(function (userAcc) {
    userAcc.username = userAcc.owner
      .toLowerCase()
      .split(' ')
      .map(word => word[0])
      .join('');
  });
};
createUsernames(accounts);
// console.log(accounts);

// -----------------------------------------------------------------------------------
// Implementing login functionality

let currentAcc;
const updateUI = function (acc) {
  // display movements
  displayMovements(acc.movements);

  // display balance
  calcDisplayBalance(acc);

  // display summary
  calcDisplaySummary(acc);
};

// Event handlers

btnLogin.addEventListener('click', function (e) {
  // prevents reloading of page (form submission)
  e.preventDefault();
  const username = inputLoginUsername.value;
  const pin = Number(inputLoginPin.value);

  currentAcc = accounts.find(acc => acc.username === username);

  // if both input fields are empty
  if (!username && !pin) {
    alert('Enter username and PIN!');
  }
  // if the user didn't input username
  else if (!username) {
    alert('Enter username!');
  }
  // if the user didn't input PIN
  else if (!pin) {
    alert('Enter PIN!');
  }
  // user enetered the correct pin
  else if (currentAcc?.pin === pin) {
    // display UI and welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAcc.owner.split(' ')[0]
    }!`;
    containerApp.style.opacity = 1;

    // clearing the input fields
    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginPin.blur();

    // update UI
    updateUI(currentAcc);
  }
  // user entered the wrong username or PIN
  else {
    alert('Wrong username or PIN!');
  }
});
// We don't need to create separate event handler for enter key, because in forms, hitting enter on the input fields means clicking the submit button. So we don't need to do it manually.

// -----------------------------------------------------------------------------------
// Implementing transfers

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const receipent = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  const amount = Number(inputTransferAmount.value);

  // clearing the input fields
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();

  // if the user input a wrong username
  if (!receipent) alert(`Receipent doesn't exist!`);
  // if the receipent is same as the one sending money
  else if (receipent.username === currentAcc.username)
    alert(`You can't send money to yourself!`);
  // if the user enters a negative amount
  else if (amount < 0) alert('Enter valid amount!');
  else {
    if (currentAcc.balance - amount >= 0) {
      // add negative movement to the current user
      currentAcc.movements.push(-amount);

      // add positive movement to receipent
      receipent.movements.push(amount);

      // updateUI
      updateUI(currentAcc);
    }
    // if the user doesn't have enough money
    else alert('Not enought balance!');
  }
});

// implementing loans
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const requestedAmount = Number(inputLoanAmount.value);

  // check if the requested amount is valid
  if (requestedAmount <= 0) alert('Enter valid amount!');
  // check if the user is eligible for loan (10% of the requested amount)
  else if (
    currentAcc.movements.some(mov => mov >= (requestedAmount * 10) / 100)
  ) {
    // transfer the requested amount to  user
    currentAcc.movements.push(requestedAmount);

    // update UI
    updateUI(currentAcc);
  }
  // if the user is not eligible
  else alert('You are not eligible for a loan!');

  // clear the input field
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});

// Implementing close account feature

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  const username = inputCloseUsername.value;
  const pin = Number(inputClosePin.value);

  // if both input fields are empty
  if (!username && !pin) {
    alert('Enter username and PIN!');
  }
  // if the user didn't input username
  else if (!username) {
    alert('Enter username!');
  }
  // if the user didn't input PIN
  else if (!pin) {
    alert('Enter PIN!');
  }

  // check if the credentials are correct
  else if (currentAcc.username === username && currentAcc.pin === pin) {
    // delete user from data (from the accounts array)
    accounts.splice(
      accounts.findIndex(acc => acc.username === currentAcc.username),
      1
    );
    // log user out (hide UI)
    containerApp.style.opacity = 0;
  }
  // user entered wrong username or pin
  else {
    alert('Wrong username or PIN!');
  }
  // clearing the input fields
  inputClosePin.value = inputCloseUsername.value = '';
  inputClosePin.blur();
});

// Sorting

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAcc.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// ----------------------------------------------------------
// Vid 1 - Simple array methods

// let arr = ['a', 'b', 'c', 'd', 'e', 'f'];

// // SLICE
// console.log(arr.slice(-3));
// console.log(arr.slice(1, -3));
// // does NOT mutate the original array
// // used to create a SHALLOW COPY of an array, e.g:
// const arrCopy = arr.slice();

// // SPLICE
// // functions exactly like slice() method, but it MUTATES the original array
// // i.e. it deletes the items defined in splice() from the original array
// // the second paramter is DELETE COUNT i.e. how many items you want to delete, not the END parameter like in slice() method

// console.log(arr.splice(3));
// console.log(arr);
// // used to DELETE the elemens of array.
// // usually to delete the LAST element

// // REVERSE

// arr = ['a', 'b', 'c', 'd', 'e', 'f'];
// let arr2 = ['l', 'k', 'j', 'i', 'h', 'g'];

// console.log(arr2.reverse());
// // it MUTATES the original array
// console.log(arr2);

// // CONCAT
// const letters = arr.concat(arr2);
// console.log(letters);
// // does NOT mutate the original array

// // can also be done using SPREAD operator
// console.log([...arr, ...arr2]);

// // JOIN
// // to join the elements of an array by the defined string

// console.log(letters.join(' - '));

// // SHIFT
// // deletes the first element of the array and returns it
// console.log(arr.shift());
// console.log(arr);

// // UNSHIFT
// // inserts a new element at the start of the array and returns the new length of the array
// console.log(arr.unshift(3));
// console.log(arr);

// // indexOF
// console.log(arr.indexOf('c'));

// // at
// // works the same as bracket notation i.e. arr[0] but we can use negative indexing
// arr = ['a', 'b', 'c', 'd', 'e', 'f'];

// // getting the last element of an array

// // traditional ways
// console.log(arr[arr.length - 1]);
// console.log(arr.slice(-1)[0]);

// // modern at() way
// console.log(arr.at(-1));

// // forEach method

// // const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (const movement of movements) {
//   if (movement < 0) {
//     console.log(`You withdrew ${Math.abs(movement)}`);
//   } else {
//     console.log(`You deposited ${movement}`);
//   }
// }

// // doing the same thing with forEach() method
// console.log(`-------------- forEach() ---------------`);

// movements.forEach(function (movement, index, array) {
//   if (movement < 0) {
//     console.log(`Movement ${index}: You withdrew ${Math.abs(movement)}`);
//   } else {
//     console.log(`Movement ${index}: You deposited ${movement}`);
//   }
//   // console.log(array);
// });

// // forEach on maps

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach(function (value, key, map) {
//   console.log(`${key}: ${value}`);
// });

// // forEach on sets
// const currenciesUnique = new Set(['USD', 'PKR', 'USD', 'PKR', 'EUR']);

// currenciesUnique.forEach(function (value, _, set) {
//   console.log(value);
//   // console.log(set);
// });
/*
// map() method
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const euroToUsd = 1.1;
// const movementsUSD = movements.map(function (mov) {
//   return mov * euroToUsd;
// });
// doing  the same thing with arrow function to make it simpler

const movementsUSD = movements.map(mov => mov * euroToUsd);

console.log(movements);
console.log(movementsUSD);

const movementDesriptions = movements.map(
  (mov, i) =>
    `Movement ${i + 1}: You ${mov < 0 ? 'withdrew' : 'deposited'} ${Math.abs(
      mov
    )}`
);

// filter(): elements that pass the given condition are taken, rest are filtered out.

const deposits = movements.filter(function (mov) {
  return mov > 0;
});

// console.log(deposits);

const withdrawals = movements.filter(function (mov) {
  return mov < 0;
});

// console.log(withdrawals);

// reduce()
// to find maximum value
const numbers = [100, 45, -27, 2000, 233];

console.log(
  numbers.reduce(function (acc, curr) {
    return acc > curr ? acc : curr;
  }, numbers[0])
);
*/

const eurToUsd = 1.1;

const movements2 = [200, 450, -400, 3000, -650, -130, 70, 1300];

const totalDepositUSD = movements2
  .filter(mov => mov > 0)
  .map(mov => mov * eurToUsd)
  .reduce((curr, mov) => curr + mov, 0);

console.log(totalDepositUSD);

// const testArray = [1, 2, 3, 4, 5, 6];

// console.log(testArray.map(num => num * 2).reverse());
// console.log(testArray);

const firstWithdrawal = movements2.find(mov => mov < 0);
console.log(firstWithdrawal);

// find()
// using the find() method, we can search the accounts array to find an object that matches a certain property!

const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account);

// doint the same thing using for of loop

let newAcc = undefined;
for (const acc of accounts) {
  if (acc.owner === 'Jessica Davis') {
    newAcc = acc;
  }
}
// console.log(newAcc);

// some(): returns true if the condition is true for atleast one element of the array
console.log(movements2);
console.log(movements2.some(mov => mov < 0));

// every(): same as some(), but it returns true when ALL the elements satisfy the given condition
console.log(movements2.every(mov => mov > 0));

// we can define callback functions separately and then pass them in the methods.
const deposit2 = mov => mov > 0;

console.log(movements2.some(deposit2));
console.log(movements2.every(deposit2));
console.log(movements2.filter(deposit2));

// flat(levelOfDepth): flattens the array based on the level of depth defined.
const arr = [1, 2, 3, 4, [5, [6, [7]]], 8];

console.log(arr.flat(3));

// to calculate the overall balance of all the movements of all the accounts

const accMovements = accounts.map(acc => acc.movements);
const allMovements = accMovements.flat();
const overallBalance = allMovements.reduce((acc, mov) => acc + mov, 0);

const overallBalance2 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov);

// console.log(overallBalance2);

// sort()

// how does callback function in sort() works?

// we have 2 arguments, a and b.
// a and b are ANY TWO CONSECUTIVE elements of the array.

// we define our condition like this:
// if a > b, then return 1 (any value > 0) (means SWITCH the order)
// if a < b, then return -1 (any value < 0) (means KEEP the order)
// if we return 0, positions remain UNCHANGED.

// sorting in ascending order
movements2.sort(function (a, b) {
  if (a > b) return 1;
  if (a < b) return -1;
});
console.log(`Ascending order:`, movements2);

// we can simplify this a LOT! How?
// we know that we want to return POSITIVE number when we need to SWITCH
// so looking at the first condition, a > b, we know that a-b > 0
// and the second condition, a < b, we know that a-b < 0
// so we can simply RETURN a-b, and it will return the +ve or -ve number accordingly.

movements2.sort((a, b) => a - b);
console.log(`Simplified ascending:`, movements2);

// sorting in descending order (switch the 1 and -1)
movements2.sort(function (a, b) {
  if (a > b) return -1;
  if (a < b) return 1;
});
console.log(`Descending order:`, movements2);

// using the same logic as above to simplify this
movements2.sort((a, b) => b - a);
console.log(`Simplified descending:`, movements2);

// creating arrays
const y = new Array(1, 2, 3, 4, 5, 6, 7);
console.log(y);

// empty array + fill() method
const x = new Array(8);
console.log(x);

// fill() method to fill the array
x.fill(2, 3, 6);
console.log(`after filling:`, x);

// Array.from()
const z = Array.from({ length: 7 }, () => 1);
console.log(z);

const q = Array.from({ length: 7 }, (curr, i) => i + 1);
console.log(q);

// create 100 random dice rolls
const randomDiceRolls = Array.from({ length: 100 }, () =>
  Math.trunc(Math.random() * 6 + 1)
);
console.log(randomDiceRolls);

labelBalance.addEventListener('click', function () {
  // selecting our movements from the UI using Array.from()
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', ''))
  );
  console.log(movementsUI);
});

// [2,4,6,8,10]
let i = 0;
const evenNum = Array.from({ length: 10 }, () => {
  i += 2;
  return i;
});

console.log(evenNum.every(num => num % 2 === 0));
console.log(
  evenNum.reduce((acc, curr, i) => {
    console.log(i + 1);
    return acc + curr;
  })
);

// ----------------------
// Practice lecture

// 1. To calculate the sum of all the movements of all the accounts

const bankDepositSum = accounts
  .map(acc =>
    acc.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov)
  )
  .reduce((acc, deposit) => acc + deposit);
console.log(bankDepositSum);

// Jonas' solution:
const bankDepositSum2 = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((sum, deposit) => sum + deposit, 0);
console.log(bankDepositSum2);

// 2. How many deposits >= 1000?
const numDeposits1000 = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov >= 1000).length;

console.log(numDeposits1000);

// Solution using reduce(): using reduce() to COUNT something in the array.

const numDeposits1000_2 = accounts
  .flatMap(acc => acc.movements)
  .reduce((count, mov) => {
    if (mov >= 1000) count++;
    return count;
  }, 0);

console.log(numDeposits1000_2);

// 3. using reduce() to creat an object containing the sum of deposits and sum of withdrawals.

const summaryObj = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (obj, mov) => {
      mov > 0 ? (obj.deposits += mov) : (obj.withdrawals += Math.abs(mov));
      return obj;
    },
    { deposits: 0, withdrawals: 0 }
  );
console.log(summaryObj);

// 4. Covert to title case
// this is a title case -> This Is a Title Case
const convertTitleCase = function (title) {
  const capitalize = str => str[0].toUpperCase() + str.slice(1);
  const exceptions = ['a', 'an', 'and', 'the', 'but', 'or', 'on', 'in', 'with'];
  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word => (exceptions.includes(word) ? word : capitalize(word)))
    .join(' ');
  console.log(capitalize(titleCase));
};

convertTitleCase('this is a title case');
convertTitleCase('this is a LONG title case but NOT TOO long');
convertTitleCase('and this is a NEW title CAse WITH some exceptionS');
convertTitleCase('I AM the AN');
