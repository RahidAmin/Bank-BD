'use strict';

//Data

const account1 = {
  owner: 'Rahid Amin',
  movement: [100, 200, 300, -400, -500, 600, .85,850],
  interestRate: 1.2,
  pin: 111,
  movementsDates: [
    "2023-11-18T21:31:17.178Z",
    "2023-12-23T07:42:02.383Z",
    "2023-01-28T09:15:04.904Z",
    "2023-04-01T10:17:24.185Z",
    "2023-05-08T14:11:59.604Z",
    "2023-07-26T17:01:17.194Z",
    "2023-07-28T23:36:17.929Z",
    "2023-08-01T10:51:36.790Z",
  ],
  currency: "USD",
  locale: "en-US",
  
}

const account2 = {
  owner: 'Mujibul Haque',
  movement: [393, 459, -284, 398, -88],
  interestRate: 1.4,
  pin: 222,
  movementsDates: [
    "2023-11-01T13:15:33.035Z",
    "2023-11-30T09:48:16.867Z",
    "2013-12-25T06:04:23.907Z",
    "2023-01-25T14:18:46.235Z",
    "2023-02-05T16:33:06.386Z",
  ],
  currency: "BDT",
  locale: "bn-BD",
}

const account3 = {
  owner: 'Ahnaf Shanto',
  movement: [101, 394, 430, -222, 82],
  interestRate: 1.6,
  pin: 333,
  movementsDates: [
    "2023-11-01T13:15:33.035Z",
    "2024-04-10T09:48:16.867Z",
    "2023-12-25T06:04:23.907Z",
    "2024-01-25T14:18:46.235Z",
    "2024-02-05T16:33:06.386Z",
  ],
  currency: "USD",
  locale: 'en-US',
}

const account = [account1, account2, account3];

//Elements
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


//Format movement dates

const formatMovementDates=function(date,locale)
{
  const calcDaysPassed=function(date1,date2)
  {
   return Math.round(Math.abs((date2-date1)/(1000*60*60*24)));
  }
  const daysPassed=calcDaysPassed(new Date(),date);
 
   if(daysPassed===0)
   {
    return 'Today';
   }
   if(daysPassed===1)
   {
    return 'Yesterday';
   }
   if(daysPassed<=7)
   {
    return `${daysPassed} days ago`;
   }
   
    // const day=`${date.getDate()}`.padStart(2,0);
    // const month=`${date.getMonth()+1}`.padStart(2,0);
    // const year=date.getFullYear();
  
    // return `${day}/${month}/${year}`; 
    return new Intl.DateTimeFormat(locale).format(date); 
    
}


const formatCurrency=function(value,locale,currency)
{
  return new Intl.NumberFormat(locale,{
    style:'currency',
    currency:currency,
  }).format(value);
}



//----------Number 8:Creating Dom elements-------------

const displayMovements = function (acc, sort = false) {
  //it will erase the existing class of movement in html file.
  // console.log(containerMovements.innerHTML);
  containerMovements.innerHTML = '';

  //movements.slice.sort() it will make a copy of movements
  const movs = sort ? acc.movement.slice().sort((a, b) => a - b) : acc.movement;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date= new Date(acc.movementsDates[i]);
    const displayDate=formatMovementDates(date,acc.locale);
    
    const formattedMov=formatCurrency(mov,acc.locale,acc.currency);
    //new Intl.NumberFormat(acc.locale,{
    //   style:'currency',
    //   currency:acc.currency,
    // }).format(mov)

    const html = `<div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>`;

    //here insertAdjacentHTML using for row looping
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });



}


// console.log(containerMovements.innerHTML) //Important


//calculate and display balance

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movement.reduce((acc, mov) => acc + mov, 0);
   
  labelBalance.textContent =formatCurrency(acc.balance,acc.locale,acc.currency);
}


//Calculate Display Summary
const calcDisplaySummary = function (acc) {
  const incomes = acc.movement.filter(mov => mov > 0).reduce((acc, mov) => mov + acc, 0);
  labelSumIn.textContent =formatCurrency(incomes,acc.locale,acc.currency);

  
  const out = acc.movement.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0);

  labelSumOut.textContent =formatCurrency(Math.abs(out),acc.locale,acc.currency);

  const interest = acc.movement.filter(mov => mov > 0).map(deposit => (deposit * acc.interestRate) / 100).filter((int, i, arr) => {
    console.log(arr);
    return int > 1;
  }).reduce((acc, mov) => acc + mov, 0);


  labelSumInterest.textContent =formatCurrency(interest,acc.locale,acc.currency); 

}




//computing username and add it to the the account array(side effect).

const createUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner.toLowerCase().split(' ').map((name1) => name1[0]).join('');
  })

}

createUserName(account);
console.log(account);

const updateUi = function (acc) {
  //Display Movements
  displayMovements(acc);

  //Display balance
  calcDisplayBalance(acc);

  //Display summary
  calcDisplaySummary(acc);
}

const startLogOutTimer=function()
{
//set time to 5 minutes
let time=60*60;
  const tick=function()
{
 let min=String(Math.trunc(time/60)).padStart(2,0);
 let sec=String(time % 60).padStart(2,0);

//In each call,print the time to UI
labelTimer.textContent=`${min}:${sec}`;

//when 0 seconds,stop timer and log out
if(time === 0)
{
  clearInterval(timer);
  labelWelcome.textContent =`Login to get Started`
  containerApp.style.opacity =0;
}
time--;

}


//call the time every seconds
tick();
const timer=setInterval(tick,1000)

return timer;
}


//Event Handler
let currentAccount,timer1;

//Fake always login
// currentAccount=account1;
// updateUi(currentAccount);
// containerApp.style.opacity = 100;

//Experimenting API




btnLogin.addEventListener('click', function (e) {
  //prevent form from submitting`
  e.preventDefault();

  currentAccount = account.find(function (acc) {

    return acc.userName === inputLoginUsername.value;
  })
  console.log(currentAccount)

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI and message
    labelWelcome.textContent = `Welcome Back,${currentAccount.owner.split(' ')[0]}`
    containerApp.style.opacity = 100;
    
    //----current date and time------//
    // const now=new Date();
    // const day=`${now.getDate()}`.padStart(2,0);
    // const month=`${now.getMonth()+1}`.padStart(2,0);
    // const year=now.getFullYear();
    // const hour=`${now.getHours()}`.padStart(2,0);
    // const min=`${now.getMinutes()}`.padStart(2,0);
    // labelDate.textContent=`${day}/${month}/${year}, ${hour}:${min}`

const now=new Date();

const option={
  day:'numeric',
  month:'numeric',
  year:'numeric',
  minute:'numeric',
  hour:'numeric',
  // weekday:'long'
}
//const locale=navigator.language; //not using here
labelDate.textContent=Intl.DateTimeFormat(currentAccount.locale,option).format(now);

    //Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    if(timer1)clearInterval(timer1)

    timer1=startLogOutTimer();

    //Update Ui
    updateUi(currentAccount);
  }

})

btnTransfer.addEventListener('click', function (event) {
  event.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAccount = account.find(function (acc) {
    return acc.userName === inputTransferTo.value;
  })
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();

  if (amount > 0 && currentAccount.balance >= amount && receiverAccount && receiverAccount?.userName !== currentAccount.userName) {
    //Doing the Transfer
    currentAccount.movement.push(-amount);
    receiverAccount.movement.push(amount);

    //add transfer date

    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAccount.movementsDates.push(new Date().toISOString());

    //Update UI
    updateUi(currentAccount);

    //Reset Timer
    clearInterval(timer1);
    timer1=startLogOutTimer();
  }

})

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movement.some(function (mov) {
    return mov >= amount * .1;
  })) {

    setTimeout(()=>
  {
    currentAccount.movement.push(amount);
 
    //add loan date
    currentAccount.movementsDates.push(new Date().toISOString());

    updateUi(currentAccount);
    

  },5000)
  clearInterval(timer1);
    timer1=startLogOutTimer();
  inputLoanAmount.value = '';
  inputLoanAmount.blur();

   
  }

})

btnClose.addEventListener('click', function (e) {


  e.preventDefault();
  if (inputCloseUsername.value === currentAccount.userName && Number(inputClosePin.value) === currentAccount.pin) {
    //findInd also returns the full index
    const index = account.findIndex(function (acc) {
      return acc.userName === currentAccount.userName;
    })
    //delete account 
    account.splice(index, 1);

    //hide ui
    containerApp.style.opacity = 0;

  }
  inputCloseUsername.value = inputClosePin.value = '';
  inputClosePin.blur();


})

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount,!sorted);
  sorted = !sorted;
})





