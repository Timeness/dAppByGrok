require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index', { results: null });
});

app.post('/search', async (req, res) => {
  const query = req.body.query;
  try {
    const response = await axios.get('https://api.search.brave.com/res/v1/web/search', {
      params: { q: query },
      headers: { 
        'Accept': 'application/json',
        'X-Subscription-Token': process.env.BRAVE_API_KEY 
      }
    });
    res.render('index', { results: response.data.web.results });
  } catch (error) {
    console.error(error);
    res.render('index', { results: null, error: 'Search failed' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
