const numInputs = document.querySelectorAll("input[type='number']");
const billingInputs = document.querySelectorAll(".text-input");
const radioInput = document.querySelectorAll("input[type='radio']");
const customInput = document.querySelector("#custom-percent");
const tipDisplay = document.querySelector(".tip");
const totalDisplay = document.querySelector(".total");
const resetButton = document.querySelector(".btn-reset");

let billAmount = 0.0;
let amountOfPeople = 0;
let tipPercentage = 0.0;
let CalculatedtipPerPerson = 0.0;
let calculatedTotalPerPerson = 0.0;
let customTipPercent = 0;
let isBillValueEntered = false;
let peoplAmntEntered = false;
let isCheckBoxTrue = false;
let regExForNum = /^\d*\.?\d*$/g;

const eraseZero = () => {
  for (let i = 0; i < billingInputs.length; i++) {
    billingInputs[i].addEventListener("focusin", (e) => {
      if (e.target.value === "0") {
        e.target.value = "";
      }
    });
  }
};

const onStart = () =>{
  resetButton.disabled = true;

  for(let i =0; i < billingInputs.length; i++){
    billingInputs[i].addEventListener("keydown", (e)=>{
      e.target.classList.add("active-text-input");
      e.target.classList.remove("text-input-grey");
    });
  }

}
const checkForZero = (targetHTML) => {
  //Variable for error text that will appear when space or letters are entered
  const errorInputText = targetHTML.previousElementSibling;
  let isOk = true;
  let numBill = parseFloat(targetHTML.value);

  if (numBill <= 0 || targetHTML.value.length < 1) {
    //if there is not text then the value will be 0
    targetHTML.value = "0";
    //Make the error text appear
    errorInputText.style.display = "inherit";
    errorInputText.textContent = "Can't be zero";
    //Adds the error styling.
    targetHTML.classList.add("error-border");
    targetHTML.classList.remove("active-text-input");
    targetHTML.classList.add("text-input-grey");

    if(numBill < 0){
      errorInputText.textContent = "Invalid Number.";
    }
    isOk = false;
    tipDisplay.textContent = `$0.00`;
    totalDisplay.textContent = `$0.00`;
  } else if (parseInt(numBill) > 0) {
    targetHTML.classList.remove("error-border");
    targetHTML.classList.remove("text-input-grey");
    targetHTML.classList.add("active-text-input");
    errorInputText.style.display = "none";
    isOk = true;
  }

  return isOk;
};

//Calculate Tip Per Person
//Bill * tip / amount of people

//Calculate total per Person
//((Bill * tip) + Bill )/ total per Person
//Fix when the tip Per Person gets calculated.
const calculate = () => {
  for (let i = 0; i < billingInputs.length; i++) {
    billingInputs[i].addEventListener("focusout", (e) => {
      let noError = checkForZero(e.target);
      if (e.target.name === "bill") {
        billAmount = parseFloat(e.target.value);
        isBillValueEntered = true;
        resetButton.disabled = false;
        if (
          peoplAmntEntered &&
          isCheckBoxTrue &&
          noError &&
          checkForZero(billingInputs[1])
        ) {
          CalculatedtipPerPerson =
            (billAmount * tipPercentage) / amountOfPeople;
          calculatedTotalPerPerson =
            billAmount / amountOfPeople + CalculatedtipPerPerson;
          setPerPersonDisplay(CalculatedtipPerPerson, calculatedTotalPerPerson);
        }
      } else if (e.target.name === "num-people") {
        amountOfPeople = e.target.value;
        peoplAmntEntered = true;
        resetButton.disabled = false;
        if (
          isBillValueEntered &&
          isCheckBoxTrue &&
          noError &&
          checkForZero(billingInputs[0])
        ) {
          CalculatedtipPerPerson =
            (billAmount * tipPercentage) / amountOfPeople;
          calculatedTotalPerPerson =
            billAmount / amountOfPeople + CalculatedtipPerPerson;
          setPerPersonDisplay(CalculatedtipPerPerson, calculatedTotalPerPerson);
        }
      }
    });
  }

  for (let j = 0; j < radioInput.length; j++) {
    radioInput[j].addEventListener("change", (e) => {
      if (e.target.checked) {
        let tipText = e.target.nextElementSibling.textContent;
        tipText = tipText.replace("%", "");
        tipPercentage = parseFloat(tipText) / 100;
        isCheckBoxTrue = true;
        customInput.value = "";
        resetButton.disabled = false;

        if (
          isBillValueEntered &&
          peoplAmntEntered &&
          checkForZero(billingInputs[0]) &&
          checkForZero(billingInputs[1])
        ) {
          CalculatedtipPerPerson =
            (billAmount * tipPercentage) / amountOfPeople;
          calculatedTotalPerPerson =
            billAmount / amountOfPeople + CalculatedtipPerPerson;
          setPerPersonDisplay(CalculatedtipPerPerson, calculatedTotalPerPerson);
        }
      }
    });
  }

  customInput.addEventListener("focusout", (e) => {
    for (let i = 0; i < radioInput.length; i++) {
      if (radioInput[i].checked) {
        radioInput[i].checked = false;
      }
    }
    tipPercentage = parseFloat(e.target.value) / 100;
    console.log(e.target.value.length);
    if(e.target.value.length > 0){
    isCheckBoxTrue = true;
    resetButton.disabled = false;
    }
    else{
      isCheckBoxTrue = false;
      tipDisplay.textContent = `$0.00`;
      totalDisplay.textContent = `$0.00`;
    }
    if (
      isBillValueEntered &&
      isCheckBoxTrue &&
      peoplAmntEntered &&
      checkForZero(billingInputs[0]) &&
      checkForZero(billingInputs[1])
    ) {
      CalculatedtipPerPerson = (billAmount * tipPercentage) / amountOfPeople;
      calculatedTotalPerPerson = billAmount / amountOfPeople + CalculatedtipPerPerson;
      setPerPersonDisplay(CalculatedtipPerPerson, calculatedTotalPerPerson);
    }
  });
};

const setPerPersonDisplay = (tipPerPerson, totalPerPerson) => {
  tipDisplay.textContent = `$${tipPerPerson.toFixed(2)}`;
  totalDisplay.textContent = `$${totalPerPerson.toFixed(2)}`;
};

const reset = () => {
  resetButton.addEventListener("click", (e) => {
    for (let i = 0; i < billingInputs.length; i++) {
      billingInputs[i].value = "0";
      billingInputs[i].classList.remove("error-border");
      billingInputs[i].classList.remove("active-text-input");
      billingInputs[i].classList.add("text-input-grey");
      billingInputs[i].previousElementSibling.style.display = "none";
    }
    for (let i = 0; i < radioInput.length; i++) {
      radioInput[i].checked = false;
    }

    customInput.value = "";

    tipDisplay.textContent = `$0.00`;
    totalDisplay.textContent = `$0.00`;
    billAmount = 0.0;
    amountOfPeople = 0;
    tipPercentage = 0.0;
    CalculatedtipPerPerson = 0.0;
    calculatedTotalPerPerson = 0.0;
    isBillValueEntered = false;
    peoplAmntEntered = false;
    isCheckBoxTrue = false;
    resetButton.disabled = true;
  });
};

onStart();
eraseZero();
calculate();
reset();
