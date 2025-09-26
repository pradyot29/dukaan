const express = require('express');
   const mongoose = require('mongoose');
   const cors = require('cors');
   require('dotenv').config();

   const app = express();

   // Middleware
   app.use(express.json());
  app.use(cors({
  origin: [
    "http://localhost:3001",               // local frontend
    "https://dukaan-hisaab.vercel.app"  // deployed frontend
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
   app.get('/', (req, res) => res.send('API Running'))
   // Routes
   app.use('/api/bills', require('./routes/billRoutes'));
   app.use('/api/customers', require('./routes/customerRoutes'));
   app.use('/api/items', require('./routes/itemRoutes'));
   app.use('/api/shops', require('./routes/shopRoutes'));
   app.use('/api/transactions', require('./routes/transactionRoutes'));

   // MongoDB connection
   mongoose.connect(process.env.MONGODB_URI)
     .then(() => console.log('Connected to MongoDB'))
     .catch(err => console.error('MongoDB connection error:', err));


  if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;