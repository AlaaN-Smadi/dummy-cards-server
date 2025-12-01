require('dotenv').config();
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
const baseUrl = process.env.BASE_URL || `http://localhost:${PORT}`;

app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

// In-memory storage for cards and short links
const cards = new Map();
const shortLinks = new Map();

// Sample card data generator
const generateSampleCard = (userName = "John Doe", cardNumber = null) => {
  const randomBalance = Math.floor(Math.random() * 2000) + 500;
  const randomDate = () => {
    const start = new Date(2024, 0, 1);
    const end = new Date();
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split('T')[0];
  };
  
  return {
    cardStatus: "valid",
    user: {
      name: userName
    },
    balance: randomBalance,
    balanceHistory: Array.from({length: 3}, () => ({
      date: randomDate(),
      change: Math.floor(Math.random() * 300) - 100,
      description: ["Purchase reward", "Fuel purchase", "Bonus points", "Store credit"][Math.floor(Math.random() * 4)]
    })),
    showers: Array.from({length: Math.floor(Math.random() * 5) + 2}, () => ({
      expires: `2025-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`
    })),
    expiringPoints: Array.from({length: 3}, () => ({
      points: Math.floor(Math.random() * 500) + 100,
      expiresOn: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`
    })),
    fuelDiscounts: [{
      location: ["Station A", "Station B", "Highway Stop"][Math.floor(Math.random() * 3)],
      discount: `${Math.floor(Math.random() * 20) + 5} cents/gallon`,
      expiresOn: "2024-12-31"
    }],
    moreInformation: [
      { name: "Rewards Program", description: "Earn points on every purchase" },
      { name: "Special Offers", description: "Exclusive member discounts" },
      { name: "Mobile App", description: "Download for exclusive deals" },
      { name: "VIP Access", description: "Priority customer service" }
    ],
    clubs: Array.from({length: Math.floor(Math.random() * 3) + 1}, (_, i) => ({
      clubId: `club-${Math.floor(Math.random() * 1000)}`,
      clubName: ["Gold Member", "Platinum Elite", "Diamond VIP"][i % 3]
    })),
    rewards: Array.from({length: Math.floor(Math.random() * 4) + 2}, () => {
      const rewardTypes = ["RedBull", "Marlboro", "Coffee", "Snacks"];
      const rewardType = rewardTypes[Math.floor(Math.random() * rewardTypes.length)];
      return {
        rewardId: `${rewardType}-${Date.now()}`,
        title: rewardType,
        description: `Buy 2+ items, save $${(Math.random() * 3 + 0.5).toFixed(2)}`,
        expiresOn: "2025-12-12",
        redeemInfo: {
          barcodeType: "code128",
          barcodeValue: cardNumber ? (() => {
            const shortId = Math.random().toString(36).substring(2, 8);
            shortLinks.set(shortId, cardNumber);
            return `${baseUrl}/s/${shortId}`;
          })() : `${baseUrl}/s/default`,
          instructions: "Present barcode at checkout"
        }
      };
    })
  };
};

// Create card API - POST /create-card
app.post('/create-card', (req, res) => {
  const { userName } = req.body;
  const cardNumber = Math.floor(Math.random() * 9000000000) + 1000000000;
  const card = generateSampleCard(userName, cardNumber.toString());
  
  cards.set(cardNumber.toString(), card);
  
  res.status(201).json({
    success: true,
    cardNumber: cardNumber.toString(),
    card
  });
});

// Get card API - POST /api/cards/:cardNumber/details
app.post('/api/cards/:cardNumber/details', (req, res) => {
  const { cardNumber } = req.params;
  
  let card = cards.get(cardNumber);
  
  if (!card) {
    card = generateSampleCard("John Doe", cardNumber);
    cards.set(cardNumber, card);
  }
  
  res.json({
    success: true,
    card
  });
});

// Refresh card API - GET /refresh-card/:cardNumber
app.get('/refresh-card/:cardNumber', (req, res) => {
  const { cardNumber } = req.params;
  
  const card = generateSampleCard("John Doe", cardNumber);
  cards.set(cardNumber, card);
  
  res.json({
    success: true,
    message: 'Card data refreshed',
    card
  });
});

// Track analytics API - POST /track-analytics
app.post('/track-analytics', (req, res) => {
  console.log('Analytics tracked:', req.body);
  
  res.json({
    success: true,
    message: 'Analytics tracked successfully'
  });
});

// Short link redirect - GET /s/:shortId
app.get('/s/:shortId', (req, res) => {
  const { shortId } = req.params;
  const cardNumber = shortLinks.get(shortId);
  
  if (cardNumber) {
    return res.redirect(`/refresh-card/${cardNumber}`);
  }
  
  res.status(404).json({
    success: false,
    message: 'Short link not found'
  });
});

app.get('/', (req, res) => {
  res.send('👋 server is working 👋')
})

app.listen(PORT, () => {
  console.log(`Server running on ${baseUrl}`);
});