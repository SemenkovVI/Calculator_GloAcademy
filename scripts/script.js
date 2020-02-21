const DAY_STRING = ['день', 'дня', 'дней']

const DATA = {
    whichSite: ['landing', 'multiPage', 'onlineStore'],
    price: [4000, 8000, 26000],
    desktopTemplates: [50, 40, 30],
    adapt: 20,
    mobileTemplates: 15,
    editable: 10,
    metrikaYandex: [500, 1000, 2000],
    analyticsGoogle: [850, 1350, 3000],
    sendOrder: 500,
    deadlineDays: [[2, 7,], [3, 10], [7, 14]],
    deadlinePercent: [20, 17, 15]
}


const startButton = document.querySelector('.start-button');
const firstScreen = document.querySelector('.first-screen');
const mainForm = document.querySelector('.main-form');
const formCalculate = document.querySelector('.form-calculate');
const endButton = document.querySelector('.end-button');
const total = document.querySelector('.total'); 
const fastRange = document.querySelector('.fast-range');
const totalPriceSum = document.querySelector('.total_price__sum');
const buttonAdapt = document.querySelector('#adapt');
const buttonMobileTemplates = document.querySelector('#mobileTemplates');
const buttonDesktopTemplates = document.querySelector('#desktopTemplates');
const buttonEditable = document.querySelector('#editable');
const adaptValue = document.querySelector('.adapt_value');
const mobileTemplatesValue = document.querySelector('.mobileTemplates_value');
const desktopTemplatesValue = document.querySelector('.desktopTemplates_value');
const editableValue = document.querySelector('.editable_value');
const typeSite = document.querySelector('.type-site');
const maxDeadline = document.querySelector('.max-deadline');
const rangeDeadline = document.querySelector('.range-deadline');
const deadlineValue = document.querySelector('.deadline-value');

buttonMobileTemplates.disabled = true;


function declOfNum(n, titles) {
    return n + ' ' + titles[n % 10 === 1 && n % 100 !== 11 ?
        0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2];
}


function showElem(elem){
    elem.style.display = 'block';
}

function hideElem(elem){
    elem.style.display = 'none';
}

function renderTextContent(total, site, maxDay, minDay){

    totalPriceSum.textContent = total;
    typeSite.textContent = site;
    maxDeadline.textContent = declOfNum(maxDay, DAY_STRING);
    rangeDeadline.min = minDay;
    rangeDeadline.max = maxDay;
    deadlineValue.textContent = declOfNum(rangeDeadline.value, DAY_STRING);

}

function priceCalculation(elem){
    let result = 0;
    let index = 0; 
    let options = [];
    let site = '';
    let maxDeadlineDay = DATA.deadlineDays[index][1];
    let minDeadlineDay = DATA.deadlineDays[index][0];
    let overPercent = 0;
    
    if(buttonAdapt.checked){
        buttonMobileTemplates.disabled = false;
    } else {
        buttonMobileTemplates.disabled = true;
        buttonMobileTemplates.checked = false;
    }


    adaptValue.textContent = buttonAdapt.checked ? 'Да' : 'Нет';
    mobileTemplatesValue.textContent = buttonMobileTemplates.checked ? 'Да' : 'Нет'; 
    editableValue.textContent = buttonEditable.checked ? 'Да' : 'Нет'; 
    desktopTemplatesValue.textContent = buttonDesktopTemplates.checked ? 'Да' : 'Нет'; 
    


    if(elem.name ==='whichSite'){
        for(const item of formCalculate.elements){
            if(item.type === 'checkbox'){
                item.checked = false;
            }
        }
        hideElem(fastRange);
    }

    for(const item of formCalculate.elements){
        if(item.name === 'whichSite' && item.checked){
           index = DATA.whichSite.indexOf(item.value);
           site = item.dataset.site;
           maxDeadlineDay = DATA.deadlineDays[index][1];
           minDeadlineDay = DATA.deadlineDays[index][0];
        } else if (item.classList.contains('calc-handler') && item.checked){
            options.push(item.value)
        } else if(item.classList.contains('want-faster') && item.checked){
            const overDay = maxDeadlineDay - rangeDeadline.value;
            overPercent =  overDay * (DATA.deadlinePercent[index] / 100);
        }

    }

    result += DATA.price[index];

    options.forEach(function(key){
        if(typeof(DATA[key]) === 'number'){
            if(key === 'sendOrder'){
                result += DATA[key];
            } else{
                result += DATA.price[index] * DATA[key] / 100;
            }
        } else {
            if(key === 'desktopTemplates'){
                result += DATA.price[index] * DATA[key][index] / 100;
            } else {
                result += DATA[key][index];
            }
        }
    });


    result += result * overPercent;
    

    renderTextContent(result, site, maxDeadlineDay, minDeadlineDay);

}

function handlerCallBackForm(event){
    const target = event.target;

    if(target.classList.contains('want-faster')){
        
        target.checked ? showElem(fastRange) : hideElem(fastRange);
        priceCalculation(target);
    }

    if(target.classList.contains('calc-handler')){
        priceCalculation(target);
    }


}

startButton.addEventListener('click', function(){
    showElem(mainForm);
    hideElem(firstScreen);
});

endButton.addEventListener('click', function(){
   for(const elem of formCalculate.elements){
       if(elem.tagName === 'FIELDSET'){
           hideElem(elem);
       }
   } 

   showElem(total);
});
formCalculate.addEventListener('change', handlerCallBackForm);
