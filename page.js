function myCalculate() {
/* Dane Podstawowe */
    let creditValue = document.getElementById('credit-value').value;
    let creditDuration = document.getElementById('credit-duration').value;
    let commission = document.getElementById('service-charge').value;
    // Oprocentowanie = Wibor + marża banku
    let bankMargin = document.getElementById('bank-margin').value;
    let wiborStart = document.getElementById('wibor-start').value;
    let percentage = parseFloat(bankMargin) + parseFloat(wiborStart);
/* Dane dodatkowe */

    // miesiąc pierwszej raty
    let myDate = new Date(document.getElementById("first-rate-day").value);
    
/* Podsumowanie */
    // Credit value - "kwota kredytu"
    document.getElementById('credit-value-result').innerHTML = creditValue;
    // Bank commission calculation - "Prowizja"
    document.getElementById('commission-result').innerHTML = (creditValue * commission) / 100;

/* wywołanie funkcji sumInterest */
    let sumInterestMonthly = sumInterest(creditDuration, creditValue, percentage);
/* wywałanie funkci sumInterestConst */
    let sumInterestMonthlyConst = sumInterestConst(creditDuration, creditValue, percentage);

/* Warunek wywołania funkcji - wybór typu rat */
    let sel = document.getElementById("rate-type");
        if(sel.value == 'constant') {
        /* wywołanie funkcji calcConstant */
            let myMap = calcConstant(creditDuration, creditValue, percentage, myDate);

            document.getElementById('current-rate-type').innerHTML = "Raty: stałe";
        
        /* Podsumowanie - raty stałe */
            // "Odsetki do spłaty" - suma całkowita rat
            document.getElementById('interest-monthly-summmary-result').innerHTML = parseFloat(sumInterestMonthlyConst).toFixed(2);
            // "Całkowity koszt kredytu" - odsetki do spłaty + prowizja
            document.getElementById('total-cost-loan-result').innerHTML = parseFloat(sumInterestMonthlyConst + ((creditValue * commission) / 100)).toFixed(2);
            // "Razem" - całkowity koszt kredytu + kwota kredytu
            document.getElementById('overall-result').innerHTML = parseFloat(parseFloat(creditValue) + sumInterestMonthlyConst + ((creditValue * commission) / 100)).toFixed(2);

        /* wywołanie funkcji removeTable() */
            removeTable();
        /* Wygenerowanie dynamicznej tabeli na bazie mapy */
            generateTable(myMap);
            makeMyChart(myMap);  
        }
        else {
        /* wywołanie funkcji calc */
            let myMap = calc(creditDuration, creditValue, percentage, myDate);

            document.getElementById('current-rate-type').innerHTML = "Raty: malejące";

        /* Podsumowanie - raty malejące */
            // "Odsetki do spłaty" - całkowita suma rat
            document.getElementById('interest-monthly-summmary-result').innerHTML = parseFloat(sumInterestMonthly).toFixed(2);
            // "Całkowity koszt kredytu" - odsetki do spłaty + prowizja
            document.getElementById('total-cost-loan-result').innerHTML = parseFloat(sumInterestMonthly + ((creditValue * commission) / 100)).toFixed(2);
            // "Razem" - całkowity koszt kredytu + kwota kredytu
            document.getElementById('overall-result').innerHTML = parseFloat(parseFloat(creditValue) + sumInterestMonthly + ((creditValue * commission) / 100)).toFixed(2);

        /* wywołanie funkcji removeTable() */
            removeTable();
        /* Wygenerowanie dynamicznej tabeli na bazie mapy */
            generateTable(myMap);
            makeMyChart(myMap);  
        }; 
};

/* Funkcja obliczająca dla raty malejącej */
function calc(period, creditValue, percentage, myDate) {
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
        Date: myDate.getFullYear() + "-" + (myDate.getMonth()+1),
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

        let myNewDate = new Date(myDate.setMonth(myDate.getMonth()+1));
        // wypełnianie obiektu 
        let myTableObject = {
            Date: myNewDate.getFullYear() + "-" + (myNewDate.getMonth()+1),
            capitalMonthly: parseFloat(capitalMonthly).toFixed(2),
            interestMonthly: parseFloat(interestMonthly).toFixed(2),
            monthlyInstallment: parseFloat(monthlyInstallment).toFixed(2)
        };
        // intercyjne dodawanie obiektów do mapy
        map1.set(i+1, myTableObject);
    }
return map1;
};
/* suma odsetek rata malejąca*/
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

/* Funkcja obliczająca dla raty stałej */
function calcConstant(period, creditValue, percentage, myDate) {
    // Wysokość raty R=A*(q^n)*(q-1)/[(q^n)-1]
    let monthlyInstallment = (creditValue * Math.pow((1 + (percentage/(100*12))),period) * ((1 + (percentage/(100*12)))-1)) / ((Math.pow((1 + (percentage/(100*12))),period))-1);
    let currentCreditValue = creditValue;
    // first month interest value - pierwsza rata odsetkowa
    let firstMonthInterest = (creditValue * (percentage / 100)) / 12;
    // Pierwsza rata kapitałowa miesięczna
    let capitalMonthly = monthlyInstallment - firstMonthInterest;
    let sumInterestMonthly = firstMonthInterest; 
    // wyswiatlenie pierwszego wiersza tabeli
    //console.log("1" + " : " + parseFloat(capitalMonthly).toFixed(2) + " : " + parseFloat(firstMonthInterest).toFixed(2) + " : " + parseFloat(monthlyInstallment).toFixed(2) + " : " + parseFloat(creditValue).toFixed(2) + " : " + parseFloat(sumInterestMonthly).toFixed(2)); 
    // Obiekt z pierwszym wierszem tabeli
    let myFirstTableObject = {
        Date: myDate.getFullYear() + "-" + (myDate.getMonth()+1),
        capitalMonthly: parseFloat(capitalMonthly).toFixed(2),
        interestMonthly: parseFloat(firstMonthInterest).toFixed(2),
        monthlyInstallment: parseFloat(monthlyInstallment).toFixed(2)
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
        // Rata kapitałowa miesięczna
        capitalMonthly = monthlyInstallment - interestMonthly;
        // suma odsetek
        sumInterestMonthly = interestMonthly + sumInterestMonthly;
        //tu inicjalizuje obiekt installmentAmount zamiast console.log
        //console.log(i+1 + " : " + parseFloat(capitalMonthly).toFixed(2) + " : " + parseFloat(interestMonthly).toFixed(2) + " : " + parseFloat(monthlyInstallment).toFixed(2) + " : " + parseFloat(currentCreditValue).toFixed(2) + " : " + parseFloat(sumInterestMonthly).toFixed(2));  
        let myNewDate = new Date(myDate.setMonth(myDate.getMonth()+1));
        // wypełnianie obiektu 
        let myTableObject = {
            Date: myNewDate.getFullYear() + "-" + (myNewDate.getMonth()+1),
            capitalMonthly: parseFloat(capitalMonthly).toFixed(2),
            interestMonthly: parseFloat(interestMonthly).toFixed(2),
            monthlyInstallment: parseFloat(monthlyInstallment).toFixed(2)
        };
        // intercyjne dodawanie obiektów do mapy
        map1.set(i+1, myTableObject);
    }
return map1;
};
/* suma odsetek - rata stała */
function sumInterestConst(period, creditValue, percentage) {
    // Wysokość raty R=A*(q^n)*(q-1)/[(q^n)-1]
    let monthlyInstallment = (creditValue * Math.pow((1 + (percentage/(100*12))),period) * ((1 + (percentage/(100*12)))-1)) / ((Math.pow((1 + (percentage/(100*12))),period))-1);
    let currentCreditValue = creditValue;
    // pierwsza rata odsetkowa miesięczna
    let firstMonthInterest = creditValue * (percentage / 100) / 12;
    let sumInterestMonthlyConst = firstMonthInterest;
    // Pierwsza rata kapitałowa miesięczna
    let capitalMonthly = monthlyInstallment - firstMonthInterest;

    for(let i = 1; i < period; i++) {
        // obliczenia aktualnej kwoty kredytu
        currentCreditValue = currentCreditValue - capitalMonthly;
        // rata odsetkowa miesięczna
        let interestMonthly = (currentCreditValue * (percentage / 100)) / 12;
        // Pierwsza rata kapitałowa miesięczna
        capitalMonthly = monthlyInstallment - interestMonthly;
        // suma odsetek
        sumInterestMonthlyConst = interestMonthly + sumInterestMonthlyConst;
    }
return sumInterestMonthlyConst;
};

/* Wygenerowanie dynamicznej tabeli na bazie mapy */
function generateTable(data) {
let table = document.querySelector(".table-summary table");
// Zawartość pozostałych komórek
    data.forEach(function(value, key) {
        let row = table.insertRow();
        let cell0 = row.insertCell();
        let cell4 = row.insertCell();
        let cell1 = row.insertCell();
        let cell2 = row.insertCell();
        let cell3 = row.insertCell();
        //let cell5 = row.insertCell(); //dodane
        let text0 = document.createTextNode(key);
        let text4 = document.createTextNode(value.Date);
        let text1 = document.createTextNode(value.capitalMonthly);
        let text2 = document.createTextNode(value.interestMonthly);
        let text3 = document.createTextNode(value.monthlyInstallment);
        //let text5 = document.createTextNode(value.fixedFees); //dodane
        cell0.appendChild(text0);
        cell4.appendChild(text4);
        cell1.appendChild(text1);
        cell2.appendChild(text2);
        cell3.appendChild(text3);
        //cell5.appendChild(text5);
    });
    generateTableHead();
};
/* Generowanie nagłówków tablicy dynamicznej */
function generateTableHead() {
let table = document.querySelector(".table-summary table");
let dataHeader = ["L.p", "Data", "Rata kapitałowa", "Odsetki", "Rata miesięczna"];
// Nagłówki tabeli
    let thead = table.createTHead();
    let row = thead.insertRow();
    for (let i = 0; i < dataHeader.length; i++) {
        let th = document.createElement("th");
        let text = document.createTextNode(dataHeader[i]);
        th.appendChild(text);
        row.appendChild(th);
    };
};
/* Usuwanie tablicy w celu odświeżenia wyświetlanych wyników */
function removeTable() {
let element = document.getElementById("result-table-summary");
    while(element.firstChild) {
        element.removeChild(element.firstChild);
    }
};

let myChart;
/* Example Chart with chart.js */
function makeMyChart(Map) {
    let ctx = document.getElementById('myChart');
    let mapkeysArray = [...Map.keys()];
    let mapValuesArray = [...Map.values()];
    let newCapitalMonthlyArray = mapValuesArray.map(element => element.capitalMonthly);
    let newInterestMonthlyArray = mapValuesArray.map(element => element.interestMonthly);
    
    if (myChart) {
        myChart.destroy();
    }
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: mapkeysArray,
            datasets: [{
                label: 'Rata kapitałowa',
                data: newCapitalMonthlyArray,
                backgroundColor: ['rgba(255, 99, 132, 0.5)'],
                borderColor: ['rgba(255, 99, 132, 1)'],
                borderWidth: 2
            },
            {
                label: 'Odsetki',
                data: newInterestMonthlyArray,
                backgroundColor: ['rgba(54, 162, 235, 0.5)'],
                borderColor: ['rgba(54, 162, 235, 1)'],
                borderWidth: 2
            }]
        },
        options: {
            legend: {
                labels: {
                    fontColor: '#fff',
                }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        fontColor: '#fff',
                    },
                    stacked: true,
                    gridLines: {
                        color: '#fff',
                        zeroLineColor: '#fff',
                        borderDash: [8, 4]
                    }
                }],
                xAxes: [{
                    ticks: {
                        fontColor: '#fff',
                        maxRotation: 0,
                        minRotation: 0,
                    },
                    gridLines: {
                        color: '#fff',
                        zeroLineColor: '#fff',
                        borderDash: [8, 4]
                    }
                }],
            },
            elements: {
                point: {
                    radius: 0
                }
            },
            tooltips: {
                mode: 'index',
                intersect: false
            },
            hover: {
                mode: 'index',
                intersect: false
            }
        }
    });
myChart.update();
};

// dodawanie nowych pól dla danych dodatkowych
// let reqs_id = 0;
// function removeElement(ev) {
//     let button = ev.target;
//     let div = button.parentElement;
//     div.remove();
    // while (div.lastChild) {
    //     div.removeChild(div.lastChild);
    // }
// }

// function addInputRow() {
    //myLabel();
    // increment reqs_id to get a unique ID for the new element
    // reqs_id++; 

    // let containerinputFields = document.createElement('div');
    // containerinputFields.setAttribute('id', 'wrapper-input-fields-row' + reqs_id);
    
    //create textbox
    // let input = document.createElement('input');
    // input.type = "date";
    // input.setAttribute('id', 'fixed-fee-date-from' + reqs_id);
    // input.setAttribute('name', 'fixed-fee-date-from');
    
    // let inputTo = document.createElement('input');
    // inputTo.type = "date";
    // inputTo.setAttribute('id', 'fixed-fee-date-To' + reqs_id);
    // inputTo.setAttribute('name', 'fixed-fee-date-To');
    
    // let inputAmount = document.createElement('input');
    // inputAmount.type = "number";
    // inputAmount.setAttribute('id', 'fixed-fee-amount' + reqs_id);
    // inputAmount.setAttribute('name', 'fixed-fee-amount');

    // let rows = document.getElementById("reqs");
    // rows.appendChild(containerinputFields);

    //create remove button
    // let removeRowButton = document.createElement('button');
    // removeRowButton.setAttribute('id', 'remove-row' + reqs_id);
    // removeRowButton.onclick = function(e) {
    //   removeElement(e)
    // };
    // removeRowButton.setAttribute("type", "button");

    //append elements
//     containerinputFields.appendChild(input);
//     containerinputFields.appendChild(inputTo);
//     containerinputFields.appendChild(inputAmount);
//     containerinputFields.appendChild(removeRowButton);
// }

// function myLabel() {
// let labeldisplay = document.getElementById('row-labels');
//     if(labeldisplay.style.display === 'none') {
//         labeldisplay.style.display = "block";
//     }
//     else {
//         labeldisplay.style.display = "none";
//     }
// }


// dodawanie nowych pól dla danych dodatkowych
// let additional_data_id = 0;
// function removeElement(ev) {
//     let button = ev.target;
//     let div = button.parentElement;
//     div.remove();
// }
// function addInputRow() {
    // increment reqs_id to get a unique ID for the new element
    // additional_data_id++; 

    // let containerinputFields = document.createElement('div');
    // containerinputFields.setAttribute('id', 'wrapper-input-fields-row' + additional_data_id);
    // containerinputFields.setAttribute('class', 'wrapper-input-fields');
    
    //create textbox
    // let input = document.createElement('input');
    // input.type = "date";
    // input.setAttribute('id', 'fixed-fee-date-from' + additional_data_id);
    // input.setAttribute('name', 'fixed-fee-date-from');
    
    // let inputTo = document.createElement('input');
    // inputTo.type = "date";
    // inputTo.setAttribute('id', 'fixed-fee-date-To' + additional_data_id);
    // inputTo.setAttribute('name', 'fixed-fee-date-To');
    
    // let inputAmount = document.createElement('input');
    // inputAmount.type = "number";
    // inputAmount.setAttribute('id', 'fixed-fee-amount' + additional_data_id);
    // inputAmount.setAttribute('name', 'fixed-fee-amount');

    // let rows = document.getElementById("additional-data");
    // rows.appendChild(containerinputFields);

    //create remove button
    // let removeRowButton = document.createElement('button');
    // removeRowButton.setAttribute('id', 'remove-row' + additional_data_id);
    // removeRowButton.onclick = function(e) {
    //   removeElement(e)
    // };
    // removeRowButton.setAttribute("type", "button");

    //append elements
//     containerinputFields.appendChild(input);
//     containerinputFields.appendChild(inputTo);
//     containerinputFields.appendChild(inputAmount);
//     containerinputFields.appendChild(removeRowButton);
// }






// dodawanie nowych pól dla danych dodatkowych
let additional_data_id = 0;
function removeElement(ev) {
    let button = ev.target;
    let div = button.parentNode.parentNode;
    div.remove();
}
function addInputRow() {
    // increment reqs_id to get a unique ID for the new element
    additional_data_id++; 

/* Wrapper Div wrapping 1 whole row of input data and remove button*/
    let containerinputFields = document.createElement('div');
        containerinputFields.setAttribute('id', 'wrapper-input-fields-row' + additional_data_id);
        containerinputFields.setAttribute('class', 'wrapper-input-fields');

/* Creating separete Div for each field */
    // Div for wrapping an input for date
    let datePickerContainer = document.createElement('div');
        datePickerContainer.setAttribute('id', 'date-picker-container' + additional_data_id);
        datePickerContainer.setAttribute('class', 'date-picker-container');
    // Div for wrapping an input for date
    let datePickerContainerTo = document.createElement('div');
        datePickerContainerTo.setAttribute('id', 'date-picker-container-To' + additional_data_id);
        datePickerContainerTo.setAttribute('class', 'date-picker-container');
    // Div for wrapping an input for amount
    let amountContainer = document.createElement('div');
        amountContainer.setAttribute('id', 'amount-container' + additional_data_id);
        amountContainer.setAttribute('class', 'amount-container');
    // Div for wrapping an remove btn
    let removeBtnContainer = document.createElement('div');
        removeBtnContainer.setAttribute('id', 'remove-row-btn-container' + additional_data_id);
        removeBtnContainer.setAttribute('class', 'remove-row-btn-container');

    //create textbox "date from"
    let input = document.createElement('input');
        input.type = "date";
        input.setAttribute('id', 'fixed-fee-date-from' + additional_data_id);
        input.setAttribute('name', 'fixed-fee-date-from');
        input.setAttribute('value', "2020-10-09");
    //create textbox "date To"
    let inputTo = document.createElement('input');
        inputTo.type = "date";
        inputTo.setAttribute('id', 'fixed-fee-date-To' + additional_data_id);
        inputTo.setAttribute('name', 'fixed-fee-date-To');
        inputTo.setAttribute('value', "2040-10-09");
    //create textbox "amount input"
    let inputAmount = document.createElement('input');
        inputAmount.type = "number";
        inputAmount.setAttribute('id', 'fixed-fee-amount' + additional_data_id);
        inputAmount.setAttribute('name', 'fixed-fee-amount');
        inputAmount.setAttribute('placeholder', "[PLN]");

    let rows = document.getElementById("additional-data");
        rows.appendChild(containerinputFields);

    // Append new divs to main Div
    containerinputFields.appendChild(datePickerContainer);
    containerinputFields.appendChild(datePickerContainerTo);
    containerinputFields.appendChild(amountContainer);
    containerinputFields.appendChild(removeBtnContainer);

    //create remove button
    let removeRowButton = document.createElement('button');
        removeRowButton.setAttribute('id', 'remove-row' + additional_data_id);
        removeRowButton.setAttribute('class', 'close');
        removeRowButton.onclick = function(e) {
            removeElement(e)
        };
        removeRowButton.setAttribute("type", "button");

    //append elements
    datePickerContainer.appendChild(input);
    datePickerContainerTo.appendChild(inputTo);
    amountContainer.appendChild(inputAmount);
    removeBtnContainer.appendChild(removeRowButton);
}