import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { billService } from '../../services/billService';
import { transactionService } from '../../services/transactionService';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalTaxAmount: 0,
    totalAmountWithoutTax: 0,
    totalAmount: 0,
    totalTransactions: 0
  });
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch bills and transactions
      const [billsResponse, transactionsResponse] = await Promise.all([
        billService.getAllBills(),
        transactionService.getAllTransactions()
      ]);

      const bills = billsResponse.data;
      const transactions = transactionsResponse.data;

      // Calculate stats
      const totalTaxAmount = bills.reduce((sum, bill) => sum + (bill.taxAmount || 0), 0);
      const totalAmountWithoutTax = bills.reduce((sum, bill) => sum + (bill.totalAmountWithoutTax || 0), 0);
      const totalAmount = bills.reduce((sum, bill) => sum + (bill.totalAmount || 0), 0);
      const totalTransactions = transactions.length;

      setStats({
        totalTaxAmount,
        totalAmountWithoutTax,
        totalAmount,
        totalTransactions
      });

      // Prepare chart data for Price by Quantity
      const quantityData = bills.flatMap(bill => 
        (bill.items || []).map(item => ({
          quantity: item.quantity || 1,
          price: item.price || 0
        }))
      );

      // Group by quantity and sum prices
      const quantityGroups = quantityData.reduce((acc, item) => {
        const qty = item.quantity;
        if (!acc[qty]) acc[qty] = 0;
        acc[qty] += item.price;
        return acc;
      }, {});

      const chartDataFormatted = Object.entries(quantityGroups).map(([quantity, price]) => ({
        quantity: parseFloat(quantity),
        price: price
      })).sort((a, b) => a.quantity - b.quantity);

      setChartData(chartDataFormatted);

      // Prepare pie chart data for Quality distribution
      const qualityData = bills.flatMap(bill => 
        (bill.items || []).map(item => item.quality || 'Unknown')
      );

      const qualityGroups = qualityData.reduce((acc, quality) => {
        acc[quality] = (acc[quality] || 0) + 1;
        return acc;
      }, {});

      const pieDataFormatted = Object.entries(qualityGroups).map(([quality, count]) => ({
        name: quality,
        value: count
      }));

      setPieData(pieDataFormatted);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-card-yellow">
          <div className="stat-header">
            <div className="stat-title">Total Tax Amounts</div>
            <div className="stat-icon">💰</div>
          </div>
          <div className="stat-value">₹ {stats.totalTaxAmount.toFixed(2)}</div>
        </div>

        <div className="stat-card stat-card-purple">
          <div className="stat-header">
            <div className="stat-title">Total Amount Without Tax</div>
            <div className="stat-icon">💳</div>
          </div>
          <div className="stat-value">₹ {stats.totalAmountWithoutTax.toFixed(2)}</div>
        </div>

        <div className="stat-card stat-card-green">
          <div className="stat-header">
            <div className="stat-title">Total Total Amounts</div>
            <div className="stat-icon">💵</div>
          </div>
          <div className="stat-value">₹ {stats.totalAmount.toFixed(2)}</div>
        </div>

        <div className="stat-card stat-card-blue">
          <div className="stat-header">
            <div className="stat-title">Total Transactions</div>
            <div className="stat-icon">📊</div>
          </div>
          <div className="stat-value">{stats.totalTransactions}</div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="chart-container">
          <h3 className="chart-title">Price by Quantity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="quantity" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Bar dataKey="price" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3 className="chart-title">Tax Amount by Total Amount</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[{name: 'Tax vs Total', taxAmount: stats.totalTaxAmount, totalAmount: stats.totalAmount}]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Bar dataKey="taxAmount" fill="#ef4444" name="Tax Amount" />
              <Bar dataKey="totalAmount" fill="#10b981" name="Total Amount" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3 className="chart-title">Quality by Price</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3 className="chart-title">Distribution by Quality</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pieData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;