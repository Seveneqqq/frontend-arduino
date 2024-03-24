export const fetchData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:4000/api/getdata'); // Dodaj protokół HTTP
      const jsonData = await response.json();
      console.log(jsonData.message);
    } catch (error) {
      console.error('Błąd:', error);
    }
  };



export const sendData = async (textToSend) => {
    try {
      const response = await fetch('http://192.168.100.6:4000/api/sendtext', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text : textToSend }) // Tekst do wysłania w formacie JSON
      });
      
      const responseData = await response.json(); // Odpowiedź serwera
      console.log('Odpowiedź serwera:', responseData);
    } catch (error) {
      console.error('Błąd:', error); console.log({text:textToSend});
    }
};

