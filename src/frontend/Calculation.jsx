import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft, FaCalculator, FaRupeeSign, FaGasPump } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { requestService } from "../services/requestService";
import { salesService } from "../services/salesService";
import { rateService } from "../services/rateService";

export default function Calculation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // Get data from sales-summary page
  const { paymentMethods: receivedPaymentMethods, totalSales, salesData } = location.state || {};
  
  // Use received data or fallback to mock data
  const [salesAmount] = useState(totalSales || 125000);
  
  // Use real payment methods data from sales-summary
  const [paymentMethods] = useState(receivedPaymentMethods || {
    credit: { amount: 0, liters: 0, fuelType: 'MS' },
    upi: { amount: 0 },
    hpPay: { amount: 0 },
    dtPlus: { amount: 0 }
  });
  
  const [approvedExpenses, setApprovedExpenses] = useState([]);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [testingData, setTestingData] = useState({
    liters: "",
    fuelType: "MS"
  });
  
  const [rates, setRates] = useState({
    MS: 95.50,
    MSP: 98.20,
    HSD: 87.30,
    CNG: 65.40
  });

  const [calculations, setCalculations] = useState({
    totalSales: 0,
    totalExpenses: 0,
    testingCost: 0,
    netAmount: 0,
    cashAmount: 0
  });

  useEffect(() => {
    fetchApprovedExpenses();
    fetchRates();
  }, [user]);

  useEffect(() => {
    calculateNet();
  }, [approvedExpenses, testingData]);

  const fetchApprovedExpenses = async () => {
    try {
      if (user?.id) {
        const unusedExpenses = await requestService.getUnusedApprovedExpenses(user.id);
        setApprovedExpenses(unusedExpenses);
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const fetchRates = async () => {
    try {
      const currentRates = await rateService.getRates();
      setRates(currentRates);
    } catch (error) {
      console.error('Error fetching rates:', error);
    }
  };

  const calculateNet = () => {
    const totalExpenses = approvedExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
    const testingCost = testingData.liters ? 
      parseFloat(testingData.liters) * rates[testingData.fuelType] : 0;
    
    const netAmount = salesAmount - totalExpenses - testingCost;
    const cashAmount = paymentMethods.cash.amount || 0;
    
    setCalculations({
      totalSales: salesAmount,
      totalExpenses,
      testingCost,
      netAmount,
      cashAmount
    });
  };

  const handleTestingChange = (field, value) => {
    setTestingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveRecord = async () => {
    setSaving(true);
    try {
      const salesRecord = {
        user_id: user.id,
        checkpoint: salesData?.checkpoint || 'Unknown',
        readings: salesData?.readings || {},
        calculations: salesData?.calculations || [],
        total_sales_amount: salesAmount,
        payment_methods: paymentMethods,
        total_other_payments: (paymentMethods.credit?.amount || 0) + 
                             parseFloat(paymentMethods.upi?.amount || 0) + 
                             parseFloat(paymentMethods.hpPay?.amount || 0) + 
                             parseFloat(paymentMethods.dtPlus?.amount || 0),
        net_cash: calculations.netAmount - 
                 ((paymentMethods.credit?.amount || 0) + 
                  parseFloat(paymentMethods.upi?.amount || 0) + 
                  parseFloat(paymentMethods.hpPay?.amount || 0) + 
                  parseFloat(paymentMethods.dtPlus?.amount || 0)),
        approved_expenses: calculations.totalExpenses,
        testing_cost: calculations.testingCost,
        testing_details: testingData,
        final_net_cash: calculations.netAmount - 
                       ((paymentMethods.credit?.amount || 0) + 
                        parseFloat(paymentMethods.upi?.amount || 0) + 
                        parseFloat(paymentMethods.hpPay?.amount || 0) + 
                        parseFloat(paymentMethods.dtPlus?.amount || 0))
      };

      await salesService.saveSalesRecord(salesRecord);
      
      // Mark expenses as used in calculation
      if (approvedExpenses.length > 0) {
        const expenseIds = approvedExpenses.map(expense => expense.id);
        await requestService.markExpensesAsUsed(expenseIds);
      }
      
      setMessage("Sales record saved successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Error saving sales record: " + error.message);
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate("/home")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <FaArrowLeft className="text-xl" />
            <span className="text-lg">Back to Dashboard</span>
          </button>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FaCalculator className="text-4xl text-purple-600" />
            <h1 className="text-4xl font-bold text-gray-800">Daily Calculation</h1>
          </div>
          <p className="text-lg text-gray-600">Sales - Expenses - Testing = Net Amount</p>
          
          {/* Success Message */}
          {message && (
            <div className={`mt-4 px-4 py-3 rounded ${
              message.includes('Error') 
                ? 'bg-red-100 border border-red-400 text-red-700'
                : 'bg-green-100 border border-green-400 text-green-700'
            }`}>
              {message}
            </div>
          )}
        </div>

        {/* Main Calculation Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Today's Financial Summary</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Breakdown */}
            <div className="space-y-6">
              {/* Sales Amount */}
              <div className="bg-green-100 rounded-xl p-6 border-2 border-green-500">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-green-800">Total Sales</h3>
                    <p className="text-sm text-green-600">From fuel sales today</p>
                  </div>
                  <div className="text-2xl font-bold text-green-800 flex items-center">
                    <FaRupeeSign className="mr-1" />
                    {calculations.totalSales.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Approved Expenses */}
              <div className="bg-red-100 rounded-xl p-6 border-2 border-red-500">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-red-800">Approved Expenses</h3>
                    <p className="text-sm text-red-600">{approvedExpenses.length} approved items</p>
                  </div>
                  <div className="text-2xl font-bold text-red-800 flex items-center">
                    - <FaRupeeSign className="mr-1" />
                    {calculations.totalExpenses.toLocaleString()}
                  </div>
                </div>
                
                {approvedExpenses.length > 0 && (
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {approvedExpenses.map((expense, index) => (
                      <div key={index} className="flex justify-between text-sm bg-white bg-opacity-70 p-2 rounded">
                        <span>{expense.description}</span>
                        <span>₹{expense.amount?.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Testing Cost */}
              <div className="bg-orange-100 rounded-xl p-6 border-2 border-orange-500">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-orange-800">Testing Cost</h3>
                    <p className="text-sm text-orange-600">Fuel used for testing</p>
                  </div>
                  <div className="text-2xl font-bold text-orange-800 flex items-center">
                    - <FaRupeeSign className="mr-1" />
                    {calculations.testingCost.toFixed(2)}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-orange-700 mb-2">
                      Testing Liters
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={testingData.liters}
                      onChange={(e) => handleTestingChange('liters', e.target.value)}
                      placeholder="0.0"
                      className="w-full px-3 py-2 border-2 border-orange-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-orange-700 mb-2">
                      Fuel Type
                    </label>
                    <select
                      value={testingData.fuelType}
                      onChange={(e) => handleTestingChange('fuelType', e.target.value)}
                      className="w-full px-3 py-2 border-2 border-orange-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                    >
                      <option value="MS">MS (₹{rates.MS || 95.50})</option>
                      <option value="MSP">MSP (₹{rates.MSP || 98.20})</option>
                      <option value="HSD">HSD (₹{rates.HSD || 87.30})</option>
                      <option value="CNG">CNG (₹{rates.CNG || 65.40})</option>
                    </select>
                  </div>
                </div>
                
                {testingData.liters && (
                  <div className="mt-3 p-2 bg-white bg-opacity-70 rounded text-sm">
                    <strong>Calculation:</strong> {testingData.liters} L × ₹{rates[testingData.fuelType] || 0} = ₹{calculations.testingCost.toFixed(2)}
                  </div>
                )}
              </div>
            </div>

            {/* Right Side - Final Calculation */}
            <div className="flex flex-col justify-center">
              <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl p-8 text-white shadow-2xl">
                <h3 className="text-2xl font-bold mb-6 text-center">Final Calculation</h3>
                
                <div className="space-y-4 text-lg">
                  <div className="flex justify-between items-center">
                    <span>Total Sales:</span>
                    <span className="flex items-center">
                      <FaRupeeSign className="mr-1" />
                      {calculations.totalSales.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Less: Expenses:</span>
                    <span className="flex items-center text-red-300">
                      - <FaRupeeSign className="mr-1" />
                      {calculations.totalExpenses.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Less: Testing:</span>
                    <span className="flex items-center text-orange-300">
                      - <FaRupeeSign className="mr-1" />
                      {calculations.testingCost.toFixed(2)}
                    </span>
                  </div>
                  
                  {/* Payment Methods Breakdown */}
                  <div className="border-t border-white border-opacity-30 pt-4">
                    <div className="text-base font-semibold mb-3">Less: Other Payment Methods</div>
                    <div className="ml-4 space-y-2 text-base">
                      <div className="flex justify-between items-center">
                        <span>Credit:</span>
                        <span className="flex items-center text-yellow-300">
                          - <FaRupeeSign className="mr-1" />
                          {(paymentMethods.credit?.amount || 0).toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span>UPI:</span>
                        <span className="flex items-center text-yellow-300">
                          - <FaRupeeSign className="mr-1" />
                          {(parseFloat(paymentMethods.upi?.amount || 0)).toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span>HP Pay:</span>
                        <span className="flex items-center text-yellow-300">
                          - <FaRupeeSign className="mr-1" />
                          {(parseFloat(paymentMethods.hpPay?.amount || 0)).toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span>Dt Plus:</span>
                        <span className="flex items-center text-yellow-300">
                          - <FaRupeeSign className="mr-1" />
                          {(parseFloat(paymentMethods.dtPlus?.amount || 0)).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <hr className="border-white border-opacity-50" />
                  
                  <div className="flex justify-between items-center text-2xl font-bold">
                    <span>Total Net Cash to Deposit:</span>
                    <span className={`flex items-center ${calculations.netAmount >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                      <FaRupeeSign className="mr-1" />
                      {(calculations.netAmount - (paymentMethods.credit?.amount || 0) - parseFloat(paymentMethods.upi?.amount || 0) - parseFloat(paymentMethods.hpPay?.amount || 0) - parseFloat(paymentMethods.dtPlus?.amount || 0)).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              

              
              {/* Save Button */}
              <div className="text-center mt-6">
                <button
                  onClick={handleSaveRecord}
                  disabled={saving}
                  className={`px-8 py-3 rounded-lg font-semibold text-white transition-all duration-300 ${
                    saving
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-purple-600 hover:bg-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105"
                  }`}
                >
                  {saving ? "Saving..." : "Save Sales Record"}
                </button>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => navigate("/home/sales-summary", {
                    state: salesData
                  })}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg transition-all duration-300"
                >
                  View Sales Details
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-lg transition-all duration-300"
                >
                  Print Summary
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}