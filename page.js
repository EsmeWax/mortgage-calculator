// function changecolor() {
//     document.getElementById("count-btn").style.backgroundColor = "red";
// }
function myCalculate() {
/* Dane Podstawowe */
    let creditValue = document.getElementById('credit-value').value;
    let creditDuration = document.getElementById('credit-duration').value;
    let commission = document.getElementById('service-charge').value;
    // Oprocentowanie = Wibor + marża banku
    let bankMargin = document.getElementById('bank-margin').value;
    let wiborStart = document.getElementById('wibor-start').value;
    let percentage = parseFloat(bankMargin) + parseFloat(wiborStart);

/* wywołanie funkcji sumInterest */
    let sumInterestMonthly = sumInterest(creditDuration, creditValue, percentage);

/* Podsumowanie */
    // Credit value - "kwota kredytu"
    document.getElementById('credit-value-result').innerHTML = creditValue;
    // "Odsetki do spłaty" - całkowita suma
    document.getElementById('interest-monthly-summmary-result').innerHTML = parseFloat(sumInterestMonthly).toFixed(2);
    // Bank commission calculation - "Prowizja"
    document.getElementById('commission-result').innerHTML = (creditValue * commission) / 100;
    // "Całkowity koszt kredytu"
    // "Razem"
    document.getElementById('result').innerHTML = parseFloat(creditValue / creditDuration).toFixed(2);

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

/* wywołanie funkcji calc */
    calc(creditDuration, creditValue, percentage);
}

function calc (period, creditValue, percentage) {
    // rata kapitałowa miesięczna
    let capitalMonthly = creditValue/period;

    let currentCreditValue = creditValue;

    // first month interest value - pierwsza rata odsetkowa
    let firstMonthInterest = (creditValue * (percentage / 100)) / 12;
    // first month installment value - pierwsza rata (kapital + odsetka)
    let firstMonthlyInstallment = capitalMonthly + firstMonthInterest;

    let sumInterestMonthly = firstMonthInterest; 

    // wyswiatlenie pierwszego wiersza tabeli
    console.log("1" + " : " + parseFloat(capitalMonthly).toFixed(2) + " : " + parseFloat(firstMonthInterest).toFixed(2) + " : " + parseFloat(firstMonthlyInstallment).toFixed(2) + " : " + parseFloat(creditValue).toFixed(2) + " : " + parseFloat(sumInterestMonthly).toFixed(2)); 

    for(let i = 1; i < period; i++) {
        // obliczenia aktualnej kwoty kredytu
        currentCreditValue = currentCreditValue - capitalMonthly;
        // rata odsetkowa miesięczna
        let interestMonthly = (currentCreditValue * (percentage / 100)) / 12;
        // monthly installment - rata miesieczna
        let monthlyInstallment = interestMonthly + capitalMonthly;
        // suma odsetek
        sumInterestMonthly = interestMonthly + sumInterestMonthly;

        //tu inicjalizuje obiekt installmentAmount zamiast console.log
        console.log(i+1 + " : " + parseFloat(capitalMonthly).toFixed(2) + " : " + parseFloat(interestMonthly).toFixed(2) + " : " + parseFloat(monthlyInstallment).toFixed(2) + " : " + parseFloat(currentCreditValue).toFixed(2) + " : " + parseFloat(sumInterestMonthly).toFixed(2));  
    }
};

/* suma odsetek */
function sumInterest(period, creditValue, percentage) {
    // rata kapitałowa miesięczna
    let capitalMonthly = creditValue/period;

    let currentCreditValue = creditValue;

    // first month interest value - pierwsza rata odsetkowa
    let firstMonthInterest = (creditValue * (percentage / 100)) / 12;

    let sumInterestMonthly = firstMonthInterest; 

    for(let i = 1; i < period; i++) {
        // obliczenia aktualnej kwoty kredytu
        currentCreditValue = currentCreditValue - capitalMonthly;
        // rata odsetkowa miesięczna
        let interestMonthly = (currentCreditValue * (percentage / 100)) / 12;
        // suma odsetek
        sumInterestMonthly = interestMonthly + sumInterestMonthly;
    }
    return sumInterestMonthly;
};
