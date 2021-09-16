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



 /**
   * Adds event listener to all text inputs to where when the input is in focused and if the value is zero
   * the input value will be cleared.
   *
   */
const eraseZero = () => {
  for (let i = 0; i < billingInputs.length; i++) {
    billingInputs[i].addEventListener("focusin", (e) => {
      if (e.target.value === "0") {
        e.target.value = "";
      }
    });
  }
};
 /**
   * Disables reset button and adds active and removes default styling to billing 
   * and amount of people text input.
   *
   */
const onStart = () =>{
  resetButton.disabled = true;

  for(let i =0; i < billingInputs.length; i++){
    billingInputs[i].addEventListener("keydown", (e)=>{
      e.target.classList.add("active-text-input");
      e.target.classList.remove("text-input-grey");
    });
  }

}

 /**
   * Checks input to make sure that entered value is valid(Not zero, or negative number).
   *
   * @param {HTML} targetHTML - The input to check
   * @returns {Boolean} isOk - A boolean in which returns based on whether the input value is valid.
   */
const checkInput = (targetHTML) => {
  //Variable for error text that will appear when space or letters are entered
  const errorInputText = targetHTML.previousElementSibling;
  const numBill = parseFloat(targetHTML.value);
  let isOk = true;
  //If input value is less than 0 or there is nothing entered.
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
    //When input value is zero a different error message will appear.
    if(numBill < 0){
      errorInputText.textContent = "Invalid Number.";
    }
    isOk = false;
    //Sets the tip amount per person and total amount per person text to 0
    tipDisplay.textContent = `$0.00`;
    totalDisplay.textContent = `$0.00`;
  } //If text value is valid
  else if (parseInt(numBill) > 0) {
    //Removes error styling or default styling and adds active input styling.
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

 /**
   * Checks input to make sure that entered value is valid(Not zero, or negative number).
   *
   * @returns {Boolean} isOk - A boolean in which returns based on whether the input value is valid.
   */
const calculate = () => {
  //For loop to add 'focusout' event on text inputs
  for (let i = 0; i < billingInputs.length; i++) {
    //Adds 'focusout' event listener to the current index of the collection of input elements
    billingInputs[i].addEventListener("focusout", (e) => {
      //Stores boolean output from the checkInput function where the target input is passed.
      let noError = checkInput(e.target);
      //if statement if the target 'name' is equal to bill
      if (e.target.name === "bill") {
        //stores current bill amount collected from the bill input.
        billAmount = parseFloat(e.target.value);
        //Boolean value to determine whether anything was entered in the bill input.
        isBillValueEntered = true;
        //Enables the reset button in case it was the first value entered.
        resetButton.disabled = false;
        //Checks to see if input asking Number of People is correctly entered and if at least one checkbox
        //is checked and checks to see if current input is entered correctly.
        if (
          peoplAmntEntered &&
          isCheckBoxTrue &&
          noError &&
          checkInput(billingInputs[1])
        ) {
          //Calculates tip per person and stores in variable
          CalculatedtipPerPerson =
            (billAmount * tipPercentage) / amountOfPeople;
          //Calculates total bill per person and stores it in a vairable.
          calculatedTotalPerPerson =
            billAmount / amountOfPeople + CalculatedtipPerPerson;
          //Passes calculated tip per person and total per person to a function in where 
          //it will display theses calculations.
          setPerPersonDisplay(CalculatedtipPerPerson, calculatedTotalPerPerson);
        }
      }//If the target input has a name of num-people 
      else if (e.target.name === "num-people") {
        //Retrieves value stored in people amount input
        amountOfPeople = e.target.value;
        //Sets true to boolean value representing whether a value has been entered.
        peoplAmntEntered = true;
        //Enables the reset button in case it was the first value entered.
        resetButton.disabled = false;
         //Checks to see if input asking Bill amount is correctly entered and if at least one checkbox
        //is checked and checks to see if current input is entered correctly.
        if (
          isBillValueEntered &&
          isCheckBoxTrue &&
          noError &&
          checkInput(billingInputs[0])
        ) {
          //Calculates tip per person and stores in variable
          CalculatedtipPerPerson =
            (billAmount * tipPercentage) / amountOfPeople;
          //Calculates total bill per person and stores it in a vairable.
          calculatedTotalPerPerson =
            billAmount / amountOfPeople + CalculatedtipPerPerson;
          //Passes calculated tip per person and total per person to a function in where 
          //it will display theses calculations.
          setPerPersonDisplay(CalculatedtipPerPerson, calculatedTotalPerPerson);
        }
      }
    });
  }
  //For loop that goes through collection of radio inputs
  for (let j = 0; j < radioInput.length; j++) {
    //Adds event listener to all radio buttons
    radioInput[j].addEventListener("change", (e) => {
      //If current selected radio button is checked
      if (e.target.checked) {
        //Get the label text that is associated with the radio button.
        let tipText = e.target.nextElementSibling.textContent;
        //Remove the percent sign in the string of the label text
        tipText = tipText.replace("%", "");
        //Covert the label text into a float and calculate to move decimal to appropriate place for calculations
        tipPercentage = parseFloat(tipText) / 100;
        //Set variable to true that determines whether checkbox has been entered
        isCheckBoxTrue = true;
        //Sets the custom percentage text box blank when a check box is checked.
        customInput.value = "";
        //Enables the reset button in case it was the first value entered.
        resetButton.disabled = false;
        //If Bill input has a value entered, if amount of people input has a value entered and checks both of those inputs that they have a valid value entered.
        if (
          isBillValueEntered &&
          peoplAmntEntered &&
          checkInput(billingInputs[0]) &&
          checkInput(billingInputs[1])
        ) {
          //Calculates tip per person and stores in variable
          CalculatedtipPerPerson =
            (billAmount * tipPercentage) / amountOfPeople;
          //Calculates total bill per person and stores it in a vairable.
          calculatedTotalPerPerson =
            billAmount / amountOfPeople + CalculatedtipPerPerson;
          //Passes calculated tip per person and total per person to a function in where 
          //it will display theses calculations.
          setPerPersonDisplay(CalculatedtipPerPerson, calculatedTotalPerPerson);
        }
      }
    });
  }
  //Event listener for custom percentage input
  customInput.addEventListener("focusout", (e) => {
    //For loop to go through radio buttons
    console.log(isCheckBoxTrue);
    for (let i = 0; i < radioInput.length; i++) {
      console.log(radioInput[i].checked);
      //If a radio button has been checked and a value has been enetered for the custom percent input.
      if (radioInput[i].checked && e.target.value.length > 0) {
        //Unchecks the current radio button
        radioInput[i].checked = false;
        //Sets the variable that determines whether a value has been determined to true.
        isCheckBoxTrue = true;
        //Enables the reset button in case it was the first value entered.
        resetButton.disabled = false;
        //Calculates tip percentage.
        tipPercentage = parseFloat(e.target.value) / 100;
      }
      //If no radio button has been checked and a value has been entered in the custom percent input.
      else if(radioInput[i].checked === false && e.target.value.length > 0){
        //If checkbox was checked/value entered
        isCheckBoxTrue = true;
        ////Enables the reset button in case it was the first value entered.
        resetButton.disabled = false;
        //Calculates tip percentage.
        tipPercentage = parseFloat(e.target.value) / 100;
      }
      else if(isCheckBoxTrue === false && e.target.value.length === 0){
        isCheckBoxTrue = false;
        tipDisplay.textContent = `$0.00`;
        totalDisplay.textContent = `$0.00`;
      }
    }
    //If bill value is entered, and a value has been picked for the checkbox portion, and amount of people input has a value and both bill and amount of people number inputs are valid.
    if (
      isBillValueEntered &&
      isCheckBoxTrue &&
      peoplAmntEntered &&
      checkInput(billingInputs[0]) &&
      checkInput(billingInputs[1])
    ) {
      //Calculates tip per person and stores in variable
      CalculatedtipPerPerson = (billAmount * tipPercentage) / amountOfPeople;
      //Calculates total bill per person and stores it in a vairable.
      calculatedTotalPerPerson = billAmount / amountOfPeople + CalculatedtipPerPerson;
      //Passes calculated tip per person and total per person to a function in where 
      //it will display theses calculations.
      setPerPersonDisplay(CalculatedtipPerPerson, calculatedTotalPerPerson);
    }
  });
};
/**
   * Sets total HTML text to display calculated tip per person and total per person.
   *
   * @param {Integer} tipPerPerson - Calculated tip per person
   * @param {Integer} totalPerPerson - Calculated total per person.
   */

const setPerPersonDisplay = (tipPerPerson, totalPerPerson) => {
  tipDisplay.textContent = `$${tipPerPerson.toFixed(2)}`;
  totalDisplay.textContent = `$${totalPerPerson.toFixed(2)}`;
};

/**
   * Resets everything to default state.
   *
   */
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
//Function calls
onStart();
eraseZero();
calculate();
reset();
