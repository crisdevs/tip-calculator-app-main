
const textInputs = document.querySelectorAll("input[type='text']");
const radioInput = document.querySelectorAll("input[type='radio']");
const tipDisplay = document.querySelector(".tip");
const totalDisplay = document.querySelector(".total");

let billAmount = 0.00;
let amountOfPeople = 0;
let tipPercentage = 0.00;
let CalculatedtipPerPerson = 0.00;
let calculatedTotalPerPerson = 0.00;
let isBillValueEntered = false;
let peoplAmntEntered = false;
let isCheckBoxTrue = false;

const setValueToZero = ()=>{
    for(let i =0; i < textInputs.length; i++){
        textInputs[i].addEventListener("focusin", (e) =>{
            if(e.target.value === "0"){
                e.target.value = "";            
            }
        });
    }
}
const checkForError = (targetHTML)=>{
    //Variable for error text that will appear when space or letters are entered
    const errorInputText = targetHTML.previousElementSibling;
    let isOk = false;
    let regExForNum = /^\d*\.?\d*$/g;
    let numBill = targetHTML.value;
    const isNum = regExForNum.test(numBill);
            
    //if regex test does not match what was typed in by user
    if(!isNum && targetHTML.type === "text"){
        //adds error styling to text input and makes error text visible.
        targetHTML.classList.add("error-border");
        errorInputText.style.display = "initial";
        errorInputText.textContent = "Invalid response!";
        isOk = false;
        tipDisplay.textContent = `$0.00`;
        totalDisplay.textContent = `$0.00`;
        }
    else if(isNum && targetHTML.type === "text"){//If only numbers are typed to text input.
        if(parseInt(numBill) < 1){
            errorInputText.style.display = "inherit";
            errorInputText.textContent = "Can't be zero";
            //Adds the error styling.
            targetHTML.classList.add("error-border");
            isOk = false;
            tipDisplay.textContent = `$0.00`;
            totalDisplay.textContent = `$0.00`;
            }
        else if(parseInt(numBill) > 0){
            numBill = parseInt(numBill);
            targetHTML.classList.remove("error-border");
            errorInputText.style.display = "none";
            isOk = true;
            }
        }
        //Checks to see if any text is in the input
        if(targetHTML.value.length < 1 && targetHTML.type === "text"){
            //if there is not text then the value will be 0
            targetHTML.value = "0";
            //Make the error text appear
            errorInputText.style.display = "inherit";
            errorInputText.textContent = "Can't be zero";
            //Adds the error styling.
            targetHTML.classList.add("error-border");
            isOk = false;
            tipDisplay.textContent = `$0.00`;
            totalDisplay.textContent = `$0.00`;
            }
     return isOk;
    }

//Calculate Tip Per Person
//Bill * tip / amount of people

//Calculate total per Person
//((Bill * tip) + Bill )/ total per Person
//Fix when the tip Per Person gets calculated.
const calculate = () =>{

   for(let i =0; i < textInputs.length; i++){
    textInputs[i].addEventListener("focusout", (e)=>{
        let noError = checkForError(e.target);
            if(e.target.name === "bill"){
                billAmount = parseFloat(e.target.value);
                isBillValueEntered = true;
                if(peoplAmntEntered && isCheckBoxTrue && noError && checkForError(textInputs[1])){

                    CalculatedtipPerPerson = (billAmount * tipPercentage) / amountOfPeople;
                    calculatedTotalPerPerson = (billAmount / amountOfPeople) + CalculatedtipPerPerson;
                    setPerPersonDisplay(CalculatedtipPerPerson, calculatedTotalPerPerson);
                }
            }
            else if(e.target.name === "num-people"){
                amountOfPeople = parseInt(e.target.value);
                peoplAmntEntered = true;
                if(isBillValueEntered && isCheckBoxTrue && noError && checkForError(textInputs[0])){
                    CalculatedtipPerPerson = (billAmount * tipPercentage) / amountOfPeople;
                    calculatedTotalPerPerson = (billAmount / amountOfPeople) + CalculatedtipPerPerson;
                    setPerPersonDisplay(CalculatedtipPerPerson, calculatedTotalPerPerson);
                }
            }
        });
   }

    for(let j = 0; j < radioInput.length; j++){
        radioInput[j].addEventListener("change", (e) =>{
           if(e.target.checked){
            let tipText = e.target.nextElementSibling.textContent;
            tipText = tipText.replace("%", "");
            tipPercentage = parseFloat(tipText) / 100;
            isCheckBoxTrue = true;
          
            if(isBillValueEntered && peoplAmntEntered && checkForError(textInputs[0]) && checkForError(textInputs[1])){
                CalculatedtipPerPerson = (billAmount * tipPercentage) / amountOfPeople;
                calculatedTotalPerPerson = (billAmount / amountOfPeople) + CalculatedtipPerPerson;
                setPerPersonDisplay(CalculatedtipPerPerson, calculatedTotalPerPerson);
            }
        }
        });
    }
}


const setPerPersonDisplay = (tipPerPerson, totalPerPerson) =>{
    tipDisplay.textContent = `$${tipPerPerson.toFixed(2)}`;
    totalDisplay.textContent = `$${totalPerPerson.toFixed(2)}`;
}

const reset = () =>{
    const resetButton = document.querySelector(".btn-reset");

    resetButton.addEventListener("click", (e) =>{
        for(let i =0; i < textInputs.length; i++){
            textInputs[i].value = "0";
            textInputs[i].classList.remove("error-border");
            textInputs[i].previousElementSibling.style.display = "none";
        }
        for(let i =0; i < radioInput.length; i++){
            radioInput[i].checked = false;
        }

        tipDisplay.textContent = `$0.00`;
        totalDisplay.textContent = `$0.00`;
        billAmount = 0.00;
        amountOfPeople = 0;
        tipPercentage = 0.00;
        CalculatedtipPerPerson = 0.00;
        calculatedTotalPerPerson = 0.00;
        isBillValueEntered = false;
        peoplAmntEntered = false;
        isCheckBoxTrue = false;
    });
}

setValueToZero();
calculate();
reset();