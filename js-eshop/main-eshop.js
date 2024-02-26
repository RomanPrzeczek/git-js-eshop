function getXMLHttpRequest (url, callback)  // obslužná funkce pro práci s HTTP endpointy
{
    let xhr = new XMLHttpRequest(); 
    xhr.open('GET', url, true); 

    xhr.responseType = 'json'; 

    xhr.onload = () => { 

        let status = xhr.status;

        if (status == 200) {
            callback(null, xhr.response);
        } else {
            callback(status);
        }
    };
    xhr.send(); 
} 

function getRate () {    // vlastní funkce získávající data z API: data.kurzy.cz pomocí 
    getXMLHttpRequest('https://data.kurzy.cz/json/meny/b[1].json', (err, data) => {

    if (err != null) {
        console.error(err);
    } else {
        kurz = data.kurzy.EUR.dev_stred;    // hodnota aktál kurzu EUR/CZK
        let kurzElement = document.getElementById("inputKurz");
        kurzElement.innerHTML = kurz;   // html element obsahující hodnotu kurzu
    }
});
}

function calculateCZprice () {  // funkce počítající nahodile cenu
    const prePrice = (Math.random()*100+1);
    priceCZ = Math.round(prePrice);
}

function getPrice() {   // f-ce naplnující html elementy formuláře produktu (název,cena,množství)
    document.getElementById("inputAmount").value = 1;   // startovní množství předdefinované na 1 ks
    let priceElement = document.getElementById("inputPiecePrice");

    if (document.getElementById("inputTitle").value){
        calculateCZprice();
        getRate();
        priceElement.innerHTML = `${priceCZ} / ${(priceCZ/kurz).toFixed(2)}`;
    }
    else {  // validace názvu, nesmí být prázdný jinak nelze odeslat formulář
        alert("Please check, if you have fill in the title, which can't be empty.");
        priceElement.innerHTML = "";
    }
}

function erasePriceElement (){  // pomocná f-ce nulující cenu po odeslání formuláře (příprava zadání nového produktu - nové ceny)
    let priceElemForErase = document.getElementById("inputPiecePrice");
    priceElemForErase.innerHTML="";
}

function find(id){  // pocná f-ce pro editaci existující položky
    let inputPanelHover = document.getElementById(`inputPanel`);
    inputPanelHover.style.background = `#c1ecbf`;

    goodsList = JSON.parse(localStorage.getItem('listItems')) ?? []
    goodsList.forEach(function (value){
        if(value.id == id){
            document.getElementById('inputId').value = id
            document.getElementById('inputTitle').value = value.title
            document.getElementById('inputPiecePrice').value = value.piecePriceCZ 
            document.getElementById('inputAmount').value = value.amount
        }
    })
}

function removeData(id){ // pomocná f-ce pro mazání položky
    goodsList = JSON.parse(localStorage.getItem('listItems')) ?? []
    goodsList = goodsList.filter(function(value){ 
        return value.id != id; 
    });
    localStorage.setItem('listItems', JSON.stringify(goodsList))
    allData()
}

function allData(){  // f-ce pro načtení všech existujících položek formou html tabulky
    table.innerHTML = ``
    goodsList = JSON.parse(localStorage.getItem('listItems')) ?? []
    goodsList.forEach(function (value, i){       
        var table = document.getElementById('table')
        table.innerHTML += `
            <tr id="row${i+1}">
                <td class="text-center">${i+1}</td>
                <td class="text-center">${value.title}</td>
                <td class="text-center">${value.piecePriceCZ} / ${value.piecePriceEUR}</td>
                <td class="text-center">${value.amount}</td>
                <td class="text-center">${value.piecePriceCZ*value.amount} / ${(value.piecePriceEUR*value.amount).toFixed(2)}</td>
                <td class="text-center">
                    <button class="btn btn-sm btn-success" onclick="find(${value.id})">
                        <i class="fa fa-edit"></i>
                    </button>
                </td>
                <td class="text-center">
                    <button class="btn btn-sm btn-danger" onclick="removeData(${value.id})">
                        <i class="fa fa-trash"></i>
                    </button>
                </td>
            </tr>
        `
    });
    let inputPanelHover = document.getElementById(`inputPanel`);
    inputPanelHover.style.background = `#87ace2`;
    erasePriceElement();
}

function save(){    // f-ce pro vytvoření/uložení nové položky
        goodsList = JSON.parse(localStorage.getItem('listItems')) ?? []
        var id
        goodsList.length != 0 ? goodsList.findLast((item) => id = item.id) : id = 0

        if(!document.getElementById('inputAmount').value) document.getElementById('inputAmount').value = 1;

        if(document.getElementById('inputId').value!=""){
            goodsList.forEach(value => {
                if(document.getElementById('inputId').value == value.id){
                    value.title         = document.getElementById('inputTitle').value, 
                    value.amount          = document.getElementById('inputAmount').value
                }
            });
            document.getElementById('inputId').value = ''
            getPrice();
        }
        else if (document.getElementById("inputTitle").value!='' && document.getElementById("inputPiecePrice").value!='')
            {
            var item = {
                id          : id + 1, 
                title       : document.getElementById('inputTitle').value, 
                piecePriceCZ      : priceCZ, 
                amount        : document.getElementById('inputAmount').value,
                piecePriceEUR      : (priceCZ/kurz).toFixed(2) 
            }
            goodsList.push(item);
        }
        else {
            alert("Please check, if you have fill in the title, which can't be empty.");
        }   
        localStorage.setItem('listItems', JSON.stringify(goodsList));
        let inputPanelHover = document.getElementById(`inputPanel`);
        inputPanelHover.style.background = `#87ace2`;
    allData();  // znovu načtení seznamu položek (po přidání nové)
    document.getElementById('form').reset();
    erasePriceElement(); // smazání pole ceny položky
}

