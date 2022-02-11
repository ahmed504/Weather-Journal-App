/* Global Variables */
let baseURL = 'http://api.openweathermap.org/data/2.5/weather?zip=' ;
let apiKey = '&appid=e031523e601747e26936b71dde136788&units=imperial';

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();

const server = 'http://localhost:8000';

const genData = () =>{
    const zip = document.getElementById('zip').value;
    const feelings = document.getElementById('feelings').value;

    getWthrData(zip).then(data =>{
        if (data) {
            const {
                main: {temp},
                name: city,
                weather: [{description}],
            } = data;

            const info = {
                newDate,
                city,
                temp: Math.round(temp),
                description,
                feelings,
            };

            postData(server + '/add', info);
            updatingUI();
            document.getElementById('entryHolder').style.opacity = 1;
        }
    });
};

const getWthrData = async(zip) =>{
    try{
        const res = await fetch(baseURL + zip + apiKey);
        const data = await res.json();
        return data;
    }catch(error) {
        console.log(error);
    }
};

const postData = async (url = '', info = {})=>{
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(info),
    });

    try {
        const newData = await res.json();
        console.log('You saved', newData);
        return newData;
    }catch(error) {
        console.log(error);
    }
};

const updatingUI = async ()=>{
    const res = await fetch(server + '/all');
    try {
        const allData = await res.json();

        document.getElementById('date').innerHTML = allData.newDate;
        document.getElementById('city').innerHTML = allData.city;
        document.getElementById('temp').innerHTML = allData.temp +'&deg;C';
        document.getElementById('description').innerHTML = allData.description;
        document.getElementById('content').innerHTML = allData.feelings;
    }catch(error){
        console.log(error);
    }
};
document.getElementById('generate').addEventListener('click', genData());