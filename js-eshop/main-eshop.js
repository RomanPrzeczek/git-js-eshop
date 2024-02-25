function getXMLHttpRequest (url, callback)
{
    let xhr = new XMLHttpRequest(); // A new instance of XMLHttpRequest is created.
    xhr.open('GET', url, true); // The open method initializes a GET request to the specified URL. The third parameter true makes it an asynchronous request.

    xhr.responseType = 'json'; // The responseType value defines the response type.

    xhr.onload = () => { // Inside the onload method, we wait for the response from the server.

        let status = xhr.status;

        if (status == 200) {
            callback(null, xhr.response);
        } else {
            callback(status);
        }
    };

    xhr.send(); // The send method sends the request; the request is asynchronous by default.
} 

function getRate () {
    getXMLHttpRequest('https://data.kurzy.cz/json/meny/b[1].json', (err, data) => {

    if (err != null) {
        console.error(err);
    } else {
        kurz = data.kurzy.EUR.dev_stred;
        let kurzElement = document.getElementById("inputKurz");
        kurzElement.innerHTML = kurz;
    }
});
}

function calculateCZprice () {
    const prePrice = (Math.random()*100+1);
    priceCZ = Math.round(prePrice);
}

function getPrice() {
    document.getElementById("inputAmount").value = 1;
    let priceElement = document.getElementById("inputPiecePrice");

    if (document.getElementById("inputTitle").value){
        calculateCZprice();
        getRate();
        priceElement.innerHTML = `${priceCZ} / ${(priceCZ/kurz).toFixed(2)}`;
    }
    else {
        alert("Please check, if you have fill in the title, which can't be empty.");
        priceElement.innerHTML = "";
    }
}

function erasePriceElement (){
    let priceElemForErase = document.getElementById("inputPiecePrice");
    priceElemForErase.innerHTML="";
}

function find(id){
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

function removeData(id){
    goodsList = JSON.parse(localStorage.getItem('listItems')) ?? []
    goodsList = goodsList.filter(function(value){ 
        return value.id != id; 
    });
    // localStorage.clear();
    localStorage.setItem('listItems', JSON.stringify(goodsList))
    allData()
}

function allData(){  
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

function save(){
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
    allData();
    document.getElementById('form').reset();
    erasePriceElement();
}

