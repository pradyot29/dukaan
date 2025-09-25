import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar.jsx';
import Dashboard from './components/Dashboard/Dashboard.jsx';
import BillsList from './components/Bills/BillsList.jsx';
import BillForm from './components/Bills/BillForm.jsx';
import CustomersList from './components/Customers/CustomersList.jsx';
import CustomerForm from './components/Customers/CustomerForm.jsx';
import ItemsList from './components/Items/ItemsList.jsx';
import ItemForm from './components/Items/ItemForm.jsx';
import ShopsList from './components/Shops/ShopsList.jsx';
import ShopForm from './components/Shops/ShopForm.jsx';
import TransactionsList from './components/Transactions/TransactionsList.jsx';
import TransactionForm from './components/Transactions/TransactionForm.jsx';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            
            {/* Bills Routes */}
            <Route path="/bills" element={<BillsList />} />
            <Route path="/bills/new" element={<BillForm />} />
            <Route path="/bills/edit/:id" element={<BillForm />} />
            
            {/* Customers Routes */}
            <Route path="/customers" element={<CustomersList />} />
            <Route path="/customers/new" element={<CustomerForm />} />
            <Route path="/customers/edit/:id" element={<CustomerForm />} />
            
            {/* Items Routes */}
            <Route path="/items" element={<ItemsList />} />
            <Route path="/items/new" element={<ItemForm />} />
            <Route path="/items/edit/:id" element={<ItemForm />} />
            
            {/* Shops Routes */}
            <Route path="/shops" element={<ShopsList />} />
            <Route path="/shops/new" element={<ShopForm />} />
            <Route path="/shops/edit/:id" element={<ShopForm />} />
            
            {/* Transactions Routes */}
            <Route path="/transactions" element={<TransactionsList />} />
            <Route path="/transactions/new" element={<TransactionForm />} />
            <Route path="/transactions/edit/:id" element={<TransactionForm />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;