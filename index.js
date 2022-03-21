const PORT = 8000

const axios = require("axios").default;
const express = require("express")
const cors = require("cors")

const app = express()

app.get('/word', (req, res) => {
    const options = {
        method: 'GET',
        url: 'https://random-words5.p.rapidapi.com/getRandom',
        params: {wordLength: '5'},
        headers: {
          'x-rapidapi-host': 'random-words5.p.rapidapi.com',
          'x-rapidapi-key': '237c301ce7mshbfbfe7cd8648088p162278jsn97333e1fbe2e'
        }
      };
      
      axios.request(options).then(function (response) {
          console.log(response.data)
          res.json(response.data);
      }).catch(function (error) {
          console.error(error);
      });
})

app.listen(PORT, () => console.log('Seever running on port ' + PORT))

