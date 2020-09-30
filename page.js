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
    // "Całkowity koszt kredytu" - odsetki do spłaty + prowizja
    document.getElementById('total-cost-loan-result').innerHTML = parseFloat(sumInterestMonthly + ((creditValue * commission) / 100)).toFixed(2);
    // "Razem" - całkowity koszt kredytu + kwota kredytu
    document.getElementById('overall-result').innerHTML = parseFloat(parseFloat(creditValue) + sumInterestMonthly + ((creditValue * commission) / 100)).toFixed(2);

/* wywołanie funkcji calc */
    let myMap = calc(creditDuration, creditValue, percentage);

    // Wygenerowanie dynamicznej tabeli na bazie mapy
    let dataHeader = ["L.p", "Rata kapitałowa", "Odsetki", "Rata miesięczna"];
    let table = document.querySelector(".table-summary table");
    generateTable(table, myMap);

    generateTableHead(table, dataHeader);
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
    //console.log("1" + " : " + parseFloat(capitalMonthly).toFixed(2) + " : " + parseFloat(firstMonthInterest).toFixed(2) + " : " + parseFloat(firstMonthlyInstallment).toFixed(2) + " : " + parseFloat(creditValue).toFixed(2) + " : " + parseFloat(sumInterestMonthly).toFixed(2)); 
    // Obiekt z pierwszym wierszem tabeli
    let myFirstTableObject = {
        capitalMonthly: parseFloat(capitalMonthly).toFixed(2),
        interestMonthly: parseFloat(firstMonthInterest).toFixed(2),
        monthlyInstallment: parseFloat(firstMonthlyInstallment).toFixed(2)
    };
    /* MAP - zdefiniowanie mapy */
    let map1 = new Map();
    // wypełnienie mapy pierwszym wierszem
    map1.set(1, myFirstTableObject);
    
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
        //console.log(i+1 + " : " + parseFloat(capitalMonthly).toFixed(2) + " : " + parseFloat(interestMonthly).toFixed(2) + " : " + parseFloat(monthlyInstallment).toFixed(2) + " : " + parseFloat(currentCreditValue).toFixed(2) + " : " + parseFloat(sumInterestMonthly).toFixed(2));  

        // wypełnianie obiektu 
        let myTableObject = {
            capitalMonthly: parseFloat(capitalMonthly).toFixed(2),
            interestMonthly: parseFloat(interestMonthly).toFixed(2),
            monthlyInstallment: parseFloat(monthlyInstallment).toFixed(2)
        };
        // intercyjne dodawanie obiektów do mapy
        map1.set(i+1, myTableObject);
    }

//console.log(map1);
return map1;
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

/* Wygenerowanie dynamicznej tabeli na bazie mapy */
function generateTable(table, data) {
// Zawartość pozostałych komórek
    data.forEach(function(value, key) {
        let row = table.insertRow();
        let cell0 = row.insertCell();
        let cell = row.insertCell();
        let cell1 = row.insertCell();
        let cell2 = row.insertCell();
        let text0 = document.createTextNode(key);
        let text = document.createTextNode(value.capitalMonthly);
        let text1 = document.createTextNode(value.interestMonthly);
        let text2 = document.createTextNode(value.monthlyInstallment);
        cell0.appendChild(text0);
        cell.appendChild(text);
        cell1.appendChild(text1);
        cell2.appendChild(text2);
    });
};

function generateTableHead(table, data) {
// Nagłówki tabeli
    let thead = table.createTHead();
    let row = thead.insertRow();
    for (let i = 0; i < data.length; i++) {
        let th = document.createElement("th");
        let text = document.createTextNode(data[i]);
        th.appendChild(text);
        row.appendChild(th);
    };
};
