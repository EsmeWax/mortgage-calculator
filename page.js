function myCalculate() {
/* Dane Podstawowe */
    let creditValue = document.getElementById('credit-value').value;
    let creditDuration = document.getElementById('credit-duration').value;
    let commission = document.getElementById('service-charge').value;
    // Oprocentowanie = Wibor + marża banku
    let bankMargin = document.getElementById('bank-margin').value;
    let wiborStart = document.getElementById('wibor-start').value;
    let percentage = parseFloat(bankMargin) + parseFloat(wiborStart);
    // miesiąc pierwszej raty
    let myDate = new Date(document.getElementById("first-rate-day").value);
    
    // Podsumowanie pokazuje się dopiero po kliknięciu "Oblicz"
    // document.querySelectorAll(".form-part-summary").forEach(x => x.style.display = "block");
    document.querySelectorAll(".form-part-summary").forEach(x => x.style.visibility = "visible");
    document.querySelectorAll(".graphic-results header").forEach(x => x.style.visibility = "visible");

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

            document.getElementById('current-rate-type').innerHTML = "Raty: Stałe";
        
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

            document.getElementById('current-rate-type').innerHTML = "Raty: Malejące";

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
        // Date: myDate.getFullYear() + "-" + (myDate.getMonth()+1),
        Date: myDate.getFullYear() + "-" + (myDate.getMonth() < 9 ? "0" + (myDate.getMonth()+1) : (myDate.getMonth()+1)),
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
            // Date: myNewDate.getFullYear() + "-" + (myNewDate.getMonth()+1),
            Date: myNewDate.getFullYear() + "-" + (myNewDate.getMonth() < 9 ? "0" + (myNewDate.getMonth()+1) : (myNewDate.getMonth()+1)),
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
        // Date: myDate.getFullYear() + "-" + (myDate.getMonth()+1),
        Date: myDate.getFullYear() + "-" + (myDate.getMonth() < 9 ? "0" + (myDate.getMonth()+1) : (myDate.getMonth()+1)),
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
            // Date: myNewDate.getFullYear() + "-" + (myNewDate.getMonth()+1),
            Date: myNewDate.getFullYear() + "-" + (myNewDate.getMonth() < 9 ? "0" + (myNewDate.getMonth()+1) : (myNewDate.getMonth()+1)),
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
        let text0 = document.createTextNode(key);
        let text4 = document.createTextNode(value.Date);
        let text1 = document.createTextNode(value.capitalMonthly);
        let text2 = document.createTextNode(value.interestMonthly);
        let text3 = document.createTextNode(value.monthlyInstallment);
        cell0.appendChild(text0);
        cell4.appendChild(text4);
        cell1.appendChild(text1);
        cell2.appendChild(text2);
        cell3.appendChild(text3);
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
                backgroundColor: 'rgba(255, 69, 0, 0.5)',
                borderColor: ['rgba(255, 69, 0, 1)'],
                borderWidth: 2
            },
            {
                label: 'Odsetki',
                data: newInterestMonthlyArray,
                backgroundColor: 'rgba(75, 119, 190, 0.5)',
                borderColor: ['rgba(75, 119, 190, 1)'],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            legend: {
                labels: {
                    fontColor: '#000000',
                    // fontColor: '#fff',
                    fontSize: 16
                }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        fontColor: '#000000',
                        // fontColor: '#fff',
                        fontSize: 14
                    },
                    stacked: true,
                    gridLines: {
                        color: '#000000',
                        // color: '#fff',
                        // zeroLineColor: '#fff',
                        zeroLineColor: '#000000',
                        borderDash: [8, 4]
                    }
                }],
                xAxes: [{
                    ticks: {
                        fontColor: '#000000',
                        // fontColor: '#fff',
                        maxRotation: 60,
                        minRotation: 0,
                        fontSize: 14
                    },
                    gridLines: {
                        color: 'black',
                        // color: '#fff',
                        // zeroLineColor: '#fff',
                        zeroLineColor: '#000000',
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
                intersect: false,
                callbacks: {
                    label: function(tooltipItem) {
                           return ' '+tooltipItem.yLabel+' PLN';
                        }
                    }
            },
            hover: {
                mode: 'index',
                intersect: false
            }
        }
    });
myChart.update();
};

/* Form validation solution 1 */
function formValidation() {
    // First input field
    let creditValue = document.getElementById('credit-value').value;
    let x = document.getElementsByClassName('label-right-column')[0];
    if (creditValue == "" || creditValue == 0) { 
        x.getElementsByTagName('div')[0].classList.add("invalid-feedback");
        x.getElementsByTagName('div')[0].classList.remove("valid-feedback");
        // x.getElementsByClassName('invalid-feedback')[0].style.display = "block";
        x.getElementsByClassName('invalid-feedback')[0].innerHTML = "Pole wymagane (dodatnie wartości numeryczne) 1";
    } 
    else {
        x.getElementsByTagName('div')[0].classList.remove("invalid-feedback");
        x.getElementsByTagName('div')[0].classList.add("valid-feedback");
        // x.getElementsByClassName('valid-feedback')[0].style.display = "none";
        x.getElementsByClassName('valid-feedback')[0].innerHTML = "";
    }
};

function formValidation1() {
    // second input field
    let creditDuration = document.getElementById('credit-duration').value;
    let x = document.getElementsByClassName('label-right-column')[1];
    // let maxValue = 420;
    if (creditDuration == "" || creditDuration == 0) { 
        x.getElementsByTagName('div')[0].classList.add("invalid-feedback");
        x.getElementsByTagName('div')[0].classList.remove("valid-feedback");
        x.getElementsByClassName('invalid-feedback')[0].innerHTML = "Pole wymagane (dodatnie wartości numeryczne) 2";
    } 
    else {
        x.getElementsByTagName('div')[0].classList.remove("invalid-feedback");
        x.getElementsByTagName('div')[0].classList.add("valid-feedback");
        x.getElementsByClassName('valid-feedback')[0].innerHTML = "";
    }
};

function formValidation2() {
    // fourth input field
    let bankMargin = document.getElementById('bank-margin').value;
    let x = document.getElementsByClassName('label-right-column')[3];
    // let maxValue = 100;
    if (bankMargin == "" || bankMargin == 0) { 
        x.getElementsByTagName('div')[0].classList.add("invalid-feedback");
        x.getElementsByTagName('div')[0].classList.remove("valid-feedback");
        x.getElementsByClassName('invalid-feedback')[0].innerHTML = "Pole wymagane (dodatnie wartości numeryczne) 3";
    } 
    else {
        x.getElementsByTagName('div')[0].classList.remove("invalid-feedback");
        x.getElementsByTagName('div')[0].classList.add("valid-feedback");
        x.getElementsByClassName('valid-feedback')[0].innerHTML = "";
    }
};

function formValidation4() {
    // fourth input field
    let wiborStart = document.getElementById('wibor-start').value;
    let x = document.getElementsByClassName('label-right-column')[4];
    // let maxValue = 100;
    if (wiborStart == "" || wiborStart == 0) { 
        x.getElementsByTagName('div')[0].classList.add("invalid-feedback");
        x.getElementsByTagName('div')[0].classList.remove("valid-feedback");
        x.getElementsByClassName('invalid-feedback')[0].innerHTML = "Pole wymagane (dodatnie wartości numeryczne) 4";
    } 
    else {
        x.getElementsByTagName('div')[0].classList.remove("invalid-feedback");
        x.getElementsByTagName('div')[0].classList.add("valid-feedback");
        x.getElementsByClassName('valid-feedback')[0].innerHTML = "";
    }
};

function formValidation5() {
    // fifth input field
    let commission = document.getElementById('service-charge').value;
    let x = document.getElementsByClassName('label-right-column')[5];
    // let maxValue = 100;
    if (commission == "" || commission == 0) { 
        x.getElementsByTagName('div')[0].classList.add("invalid-feedback");
        x.getElementsByTagName('div')[0].classList.remove("valid-feedback");
        x.getElementsByClassName('invalid-feedback')[0].innerHTML = "Pole wymagane (dodatnie wartości numeryczne) 5";
    } 
    else {
        x.getElementsByTagName('div')[0].classList.remove("invalid-feedback");
        x.getElementsByTagName('div')[0].classList.add("valid-feedback");
        x.getElementsByClassName('valid-feedback')[0].innerHTML = "";
    }
};




function formValidation0() {
    // const input = document.querySelector('input');
    // input.addEventListener('input', evt => {
    //     const value = input.value;

    let creditValue = document.getElementById('credit-value').value;
    let creditDuration = document.getElementById('credit-duration').value;
    let bankMargin = document.getElementById('bank-margin').value;
    let wiborStart = document.getElementById('wibor-start').value; 
    let commission = document.getElementById('service-charge').value;

    //second input field
    // if (creditDuration == "" || creditDuration == 0) {
    //     window.alert("Please enter a valid number"); 
    //     return false; 
    // }
    
    // if (bankMargin == "") {
    //     window.alert("Please enter a valid number"); 
    //     return false; 
    // } 
    // if (wiborStart == "") {
    //     window.alert("Please enter a valid number"); 
    //     return false; 
    // } 
    // if (commission == "") {
    //     alert("Please enter a valid number"); 
    //     return false; 
    // } 
   
// return true; 


    // looping through each value of the form element
    // let txt = "";
    // for (let i = 0; i < document.forms[0].length; i++) {
    //     txt = txt + document.forms[0].elements[i].value + "<br>";
    // }
    // console.log(txt);
// };

 // looping through each value of the form element
    // for (let i = 0; i < document.forms[0].length; i++) {
    //     document.forms[0].elements[i].value.addEventListener('input', function(e){
    //         if (elements[i].value == "") {
    //             window.alert("Please enter a valid number"); 
    //             return false; 
    //         } 
    //     })
};