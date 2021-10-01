(function () {
  const billingInputs = document.querySelectorAll(".text-input");
  const numInputs = document.querySelectorAll("input[type='number']");
  const radioInput = document.querySelectorAll("input[type='radio']");
  const customInput = document.querySelector("#custom-percent");
  const tipDisplay = document.querySelector(".tip");
  const totalDisplay = document.querySelector(".total");
  const resetButton = document.querySelector(".btn-reset");

  let billAmount = 0.0;
  let amountOfPeople = 0;
  let tipPercentage = 0.0;
  let isBillValueEntered = false;
  let peoplAmntEntered = false;
  let isCheckBoxTrue = false;
  /**
   * Disables reset button and adds active and removes default styling to billing
   * and amount of people text input.
   *
   */
  const onStart = () => {
    resetButton.disabled = true;

    for (let i = 0; i < billingInputs.length; i++) {
      billingInputs[i].addEventListener("keydown", (e) => {
        e.target.classList.add("active-text-input");
        e.target.classList.remove("text-input-grey");
      });
    }
  };

  /**
   * Checks input to make sure that entered value is valid(Not zero, or negative number).
   *
   * @param {HTML} targetHTML - The input to check
   * @returns {Boolean} isOk - A boolean in which returns based on whether the input value is valid.
   */
  const checkInput = (targetHTML) => {
    const errorInputText = targetHTML.previousElementSibling;
    const numBill = parseFloat(targetHTML.value);
    let isOk = true;
    //If input value is less than or equal to 0 or there is nothing entered.
    if (numBill === 0 || targetHTML.value.length < 1) {
      targetHTML.value = "0";
      //Make the error text appear
      errorInputText.style.display = "inherit";
      errorInputText.textContent = "Can't be zero";
      //Adds the error styling classes
      targetHTML.classList.add("error-border");
      targetHTML.classList.remove("active-text-input");
      targetHTML.classList.add("text-input-grey");
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

  const calculateTipPerPerson = () => {
    return (billAmount * tipPercentage) / amountOfPeople;
  };

  //Calculate total per Person
  //((Bill * tip) + Bill )/ total per Person
  const calculateTotalPerPerson = () => {
    return billAmount / amountOfPeople + calculateTipPerPerson();
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
      isBillValueEntered = false;
      peoplAmntEntered = false;
      isCheckBoxTrue = false;
      resetButton.disabled = true;
    });
  };
  //Function calls
  onStart();

  console.log(numInputs);
  for (let i = 0; i < numInputs.length; i++) {
    //Event listener to prevent invalid input from being typed.
    numInputs[i].addEventListener("keydown", (e) => {
      if (e.target.name === "num-people") {
        if (e.key === "-" || e.key === "e" || e.key === ".") {
          e.preventDefault();
        }
      } else {
        if (e.key === "-" || e.key === "e") {
          e.preventDefault();
        }
      }
    });

    //For custom tip input
    if (numInputs[i].name === "tip") {
      numInputs[i].addEventListener("focusout", (e) => {
        const checkedRadioButtons = document.querySelectorAll(
          "input[type='radio']:checked"
        );
        //For loop to go through checked radio buttons
        for (let i = 0; i < checkedRadioButtons.length; i++) {
          //If a radio button has been checked and a value has been enetered for the custom percent input.
          if (checkedRadioButtons.length > 0 && e.target.value.length > 0) {
            checkedRadioButtons[0].checked = false;
            tipPercentage = parseFloat(e.target.value) / 100;
            isCheckBoxTrue = true;
          }
        }
        //If there are no radio buttons checked and no value in custom input.
        if (checkedRadioButtons.length === 0 && e.target.value.length === 0) {
          isCheckBoxTrue = false;
        //If there is no radio buttons checked but a value is entered for the custom tip input.
        } else if (
          checkedRadioButtons.length === 0 &&
          e.target.value.length > 0
        ) {
          //Calculates tip percentage.
          tipPercentage = parseFloat(e.target.value) / 100;
          isCheckBoxTrue = true;
          resetButton.disabled = false;
        }

        //If other inputs are correctly filled in
        if (
          isBillValueEntered &&
          isCheckBoxTrue &&
          peoplAmntEntered &&
          checkInput(billingInputs[0]) &&
          checkInput(billingInputs[1])
        ) {
          //Passes calculated tip per person and total per person to a function in where
          //it will display theses calculations.
          setPerPersonDisplay(
            calculateTipPerPerson(),
            calculateTotalPerPerson()
          );
        } else {
          tipDisplay.textContent = `$0.00`;
          totalDisplay.textContent = `$0.00`;
        }
      });
    }
  }
  //For loop to add 'focusout' event on text inputs
  for (let i = 0; i < billingInputs.length; i++) {
    //Adds 'focusout' event listener to the current index of the collection of input elements
    billingInputs[i].addEventListener("focusout", (e) => {
      //Stores boolean output from the checkInput function where the target input is passed.
      let noError = checkInput(e.target);
      //Enables the reset button in case it was the first value entered.
      resetButton.disabled = false;
      //if statement if the target 'name' is equal to bill
      if (e.target.name === "bill" && noError) {
        //stores current bill amount collected from the bill input.
        billAmount = parseFloat(e.target.value);
        //Boolean value to determine whether anything was entered in the bill input.
        isBillValueEntered = true;
        //Checks to see if input asking Number of People is correctly entered and if at least one checkbox
        //is checked and checks to see if current input is entered correctly.
        if (
          peoplAmntEntered &&
          isCheckBoxTrue &&
          checkInput(billingInputs[1])
        ) {
          //Passes calculated tip per person and total per person to a function in where
          //it will display theses calculations.
          setPerPersonDisplay(
            calculateTipPerPerson(),
            calculateTotalPerPerson()
          );
        }
      } //If the target input has a name of num-people
      else if (e.target.name === "num-people" && noError) {
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
          checkInput(billingInputs[0])
        ) {
          //Passes calculated tip per person and total per person to a function in where
          //it will display theses calculations.
          setPerPersonDisplay(
            calculateTipPerPerson(),
            calculateTotalPerPerson()
          );
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
          //Passes calculated tip per person and total per person to a function in where
          //it will display theses calculations.
          setPerPersonDisplay(
            calculateTipPerPerson(),
            calculateTotalPerPerson()
          );
        }
      }
    });
  }
  for (let i = 0; i < billingInputs.length; i++) {
    billingInputs[i].addEventListener("focusin", (e) => {
      if (e.target.value === "0") {
        e.target.value = "";
      }
    });
  }

  reset();
})();
