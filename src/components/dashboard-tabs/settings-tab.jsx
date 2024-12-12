import React from 'react'
import { useState, useEffect } from 'react'

export default function SettingTab() {

  let [houseInfo, setHouseInfo] = useState([]);

  const fetchHouseInfo = async() => {
    try {
      
      let house_id = sessionStorage.getItem('selected-home-id');

      let response = await fetch(`http://localhost:4000/api/home/home-info/${house_id}`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json', 
            'Authorization': 'Bearer ' + sessionStorage.getItem('AuthToken')
        },
      })

      const data = await response.json();

      setHouseInfo(data);

      console.log(data);

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    fetchHouseInfo();
  },[])

  return (
    <div></div>
  )
}


//<div>SettingTab - ustawienia domu zmiana nazwy, kod zaproszeniowy, usuwanie uzytkownikow, itp opuszczanie (nie admin) usuwanie domu, w koncie wyswietlanie informacji o koncie uzytkownika i o domach do ktorych przypisany</div>