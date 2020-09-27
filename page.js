// function changecolor() {
//     document.getElementById("count-btn").style.backgroundColor = "red";
// }

function myCalculate() {
    /*  */
    let creditValue = document.getElementById('credit-value').value;
    let creditDuration = document.getElementById('credit-duration').value; 
    document.getElementById('result').innerHTML = creditValue / creditDuration;

    /* Bank commission calculation */
    let commission = document.getElementById('service-charge').value;
    document.getElementById('commission-result').innerHTML = (creditValue * commission) / 100;

    /* Credit value */
    document.getElementById('credit-value-result').innerHTML = creditValue;



    /* Object */
    let installmentAmount = {
        capitalPart: (creditValue/creditDuration),
        interestPart: 1000,
        summaryPart: function() {
                return this.capitalPart + this.interestPart;
            }
    };

    /* MAP */
    let map1 = new Map([["2020-08", installmentAmount]]);
    console.log(map1);



    // wywołanie funkcji calc
    calc(creditDuration,creditValue,3);
}


function calc (period,creditValue,percentage) {

    // rata kapitałowa miesięczna
    let capitalMonthly = creditValue/period;
    let currentCreditValue = creditValue;

    console.log("1" + " : " + capitalMonthly + " : " + (creditValue * (percentage / 100)) / 12); 

    for(let i = 1; i < period; i++ ) {

        // obliczenia aktualnej kwoty kredytu
        currentCreditValue = currentCreditValue - capitalMonthly;

        // rata odsetkowa miesięczna
        let interestMonthly = (currentCreditValue * (percentage / 100)) / 12;

        //tu inicjalizuje obiekt installmentAmount zamiast console.log
        console.log(i+1 + " : " + capitalMonthly + " : " + interestMonthly + " : " + currentCreditValue);  
    }
};