const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/search', async (req, res) => {
    const query = req.query.q;
    try {
        const response = await axios.get(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Search failed' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port https://localhost:${PORT}`);
});
