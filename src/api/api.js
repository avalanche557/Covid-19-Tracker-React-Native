import axios from 'react-native-axios'

const api_key = "f0d3694b64mshc73dc93bf6ddf7cp196416jsnd7d1df0b828a";
const host = "covid-19-data.p.rapidapi.com";
const header = {
    "x-rapidapi-host": host,
    "Content-Type": "application/json",
    "x-rapidapi-key": api_key
}

export function getTotal() {
    const URL = 'https://covid-19-data.p.rapidapi.com/totals'
    return axios.get(URL, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            "x-rapidapi-host": host,
            "x-rapidapi-key": api_key
        },
    })
    .then(response => {
        if(response.status === 200 && response.data) {
            return response.data[0]
        }
        return 
    })
}

export function getSelectedCountry(name) {
    const URL = 'https://covid-19-data.p.rapidapi.com/country'
    return axios.get(URL, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            "x-rapidapi-host": host,
            "x-rapidapi-key": api_key
        },
        params: {
            "name": name
        }
    })
    .then(response => {
        console.log(response)
        if(response.status === 200 && response.data) {
            return response.data[0]
        }
        return 
    })
}

export function getAllCountry () {
    const URL = 'http://country.io/names.json';
    return axios.get(URL)
    .then(response => {
        if(response.status === 200 && response.data) {
            return response.data
        }
        return 
    })

}

export function getFlagOfCountry () {
    const URL = 'https://www.countryflags.io/us/flat/64.png'
    return axios.get(URL)
    .then(response => {
        if(response.status === 200 && response.data) {
            console.log(response)
            return response.data
        }
        return 
    })
}


export function getAllDataForAll(date) {
    const URL = 'https://covid-19-data.p.rapidapi.com/report/totals';
    return axios.get(URL, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            "x-rapidapi-host": host,
            "x-rapidapi-key": api_key
        },
        params: {
            "date": date
        }
    })
    .then(response => {
        if(response.status === 200 && response.data) {
            return response.data[0].recovered
        }
        return 
    })
}



export function getCountryDataApi(date, name) {
    let sum = 0
    const URL = 'https://covid-19-data.p.rapidapi.com/report/country/name';
    return axios.get(URL, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            "x-rapidapi-host": host,
            "x-rapidapi-key": api_key
        },
        params: {
            "date": date,
            "name": name
        }
    })
    .then(response => {
        console.log('res', response)
        if(response.status === 200 && response.data) {

            for(let i = 0 ; i < response.data[0].provinces.length; i++) {
                sum = sum + response.data[0].provinces[i].recovered
                return sum
            }
        }
        return 
    })
}