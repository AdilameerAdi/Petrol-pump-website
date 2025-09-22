import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft, FaCalculator, FaRupeeSign } from "react-icons/fa";
import { rateService } from "../services/rateService";

export default function SalesSummary() {
  const navigate = useNavigate();
  const location = useLocation();
  const { checkpoint, readings } = location.state || {};
  
  const [rates, setRates] = useState({});

  const [calculations, setCalculations] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentMethods, setPaymentMethods] = useState({
    credit: { enabled: false, liters: '', fuelType: 'MS', amount: 0 },
    upi: { enabled: false, amount: '' },
    hpPay: { enabled: false, amount: '' },
    dtPlus: { enabled: false, amount: '' },
    cash: { enabled: false, amount: '' }
  });
  const [paymentSummary, setPaymentSummary] = useState({ totalCash: 0, totalOther: 0 });
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchRates();
  }, []);

  useEffect(() => {
    if (readings && Object.keys(rates).length > 0) {
      const calcs = Object.entries(readings).map(([nozzle, data]) => {
        const netSale = data.current - data.previous;
        const rate = getNozzleRate(nozzle);
        const totalMoney = netSale * rate;
        
        return {
          nozzle,
          previous: data.previous,
          current: data.current,
          netSale,
          rate,
          totalMoney
        };
      });
      
      setCalculations(calcs);
      setTotalAmount(calcs.reduce((sum, calc) => sum + calc.totalMoney, 0));
    }
  }, [readings, rates]);

  const fetchRates = async () => {
    try {
      const currentRates = await rateService.getRates();
      setRates(currentRates);
    } catch (error) {
      console.error('Error fetching rates:', error);
    }
  };

  const getNozzleRate = (nozzle) => {
    if (nozzle.includes('HSD')) return rates.HSD || 87.30;
    if (nozzle.includes('MS-Auto')) return rates.MS || 95.50;
    if (nozzle.includes('MSP')) return rates.MSP || 98.20;
    if (nozzle.includes('MS')) return rates.MS || 95.50;
    if (nozzle.includes('Nozzle')) return rates.CNG || 65.40;
    return 0;
  };

  useEffect(() => {
    calculatePaymentSummary();
  }, [paymentMethods]);

  const handlePaymentMethodChange = (method, field, value) => {
    setPaymentMethods(prev => {
      const updated = {
        ...prev,
        [method]: {
          ...prev[method],
          [field]: value
        }
      };
      
      // Auto-calculate for credit method
      if (method === 'credit') {
        if (field === 'liters' || field === 'fuelType') {
          const rate = rates[updated.credit.fuelType] || 0;
          const liters = parseFloat(updated.credit.liters || 0);
          updated.credit.amount = liters * rate;
        }
      }
      
      return updated;
    });
  };

  const calculatePaymentSummary = () => {
    let totalOther = 0;
    
    Object.entries(paymentMethods).forEach(([method, data]) => {
      if (data.enabled && method !== 'cash') {
        const amount = method === 'credit' ? data.amount : parseFloat(data.amount || 0);
        totalOther += amount;
      }
    });
    
    const totalCash = totalAmount - totalOther;
    
    setPaymentSummary({ totalCash, totalOther });
  };

  const getFuelType = (nozzle) => {
    if (nozzle.includes('HSD')) return 'HSD';
    if (nozzle.includes('MS-Auto')) return 'MS';
    if (nozzle.includes('MSP')) return 'MSP';
    if (nozzle.includes('MS')) return 'MS';
    if (nozzle.includes('Nozzle')) return 'CNG';
    return 'Unknown';
  };

  const getFuelColor = (nozzle) => {
    const type = getFuelType(nozzle);
    switch(type) {
      case 'MS': return 'bg-blue-100 border-blue-500 text-blue-800';
      case 'MSP': return 'bg-green-100 border-green-500 text-green-800';
      case 'HSD': return 'bg-orange-100 border-orange-500 text-orange-800';
      case 'CNG': return 'bg-purple-100 border-purple-500 text-purple-800';
      default: return 'bg-gray-100 border-gray-500 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate("/home/reading-entry")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <FaArrowLeft className="text-xl" />
            <span className="text-lg">Back to Reading Entry</span>
          </button>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FaCalculator className="text-4xl text-green-600" />
            <h1 className="text-4xl font-bold text-gray-800">Sales Summary</h1>
          </div>
          <p className="text-lg text-gray-600">
            {checkpoint} - Calculation Results
          </p>
        </div>

        {/* Calculations */}
        <div className="space-y-6 mb-8">
          {calculations.map((calc, index) => (
            <div key={index} className={`rounded-xl p-6 border-2 ${getFuelColor(calc.nozzle)} shadow-lg`}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Side - Readings */}
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-center">
                    {calc.nozzle} ({getFuelType(calc.nozzle)})
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-white bg-opacity-70 rounded-lg">
                      <span className="font-medium">Current Reading:</span>
                      <span className="font-bold text-lg">{calc.current.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-white bg-opacity-70 rounded-lg">
                      <span className="font-medium">Previous Reading:</span>
                      <span className="font-bold text-lg">{calc.previous.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-white bg-opacity-90 rounded-lg border-2 border-gray-400">
                      <span className="font-bold">Net Sale (Liters):</span>
                      <span className="font-bold text-xl text-green-700">{calc.netSale.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Right Side - Calculations */}
                <div>
                  <h4 className="text-xl font-bold mb-4 text-center">Calculation</h4>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-white bg-opacity-70 rounded-lg">
                      <span className="font-medium">Rate per Liter:</span>
                      <span className="font-bold text-lg">₹{calc.rate}</span>
                    </div>
                    
                    <div className="p-3 bg-white bg-opacity-70 rounded-lg">
                      <div className="text-center text-sm text-gray-700 mb-2">Formula:</div>
                      <div className="text-center font-mono text-sm">
                        {calc.netSale} × ₹{calc.rate} = ₹{calc.totalMoney.toFixed(2)}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-4 bg-green-200 bg-opacity-90 rounded-lg border-2 border-green-600">
                      <span className="font-bold text-lg">Total Amount:</span>
                      <span className="font-bold text-2xl text-green-800 flex items-center">
                        <FaRupeeSign className="mr-1" />
                        {calc.totalMoney.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Grand Total */}
        <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-8 text-white shadow-2xl mb-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Grand Total</h2>
            <div className="text-6xl font-bold flex items-center justify-center">
              <FaRupeeSign className="mr-2" />
              {totalAmount.toFixed(2)}
            </div>
            <p className="text-xl mt-4 opacity-90">
              Total sales for {calculations.length} nozzle{calculations.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Methods</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Credit */}
            <div className="border-2 border-gray-200 rounded-xl p-4">
              <label className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  checked={paymentMethods.credit.enabled}
                  onChange={(e) => handlePaymentMethodChange('credit', 'enabled', e.target.checked)}
                  className="w-5 h-5 text-blue-600"
                />
                <span className="text-lg font-semibold text-gray-800">Credit</span>
              </label>
              
              {paymentMethods.credit.enabled && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
                    <select
                      value={paymentMethods.credit.fuelType}
                      onChange={(e) => handlePaymentMethodChange('credit', 'fuelType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500"
                    >
                      <option value="MS">MS (₹{rates.MS || 95.50})</option>
                      <option value="MSP">MSP (₹{rates.MSP || 98.20})</option>
                      <option value="HSD">HSD (₹{rates.HSD || 87.30})</option>
                      <option value="CNG">CNG (₹{rates.CNG || 65.40})</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Liters</label>
                    <input
                      type="number"
                      step="0.01"
                      value={paymentMethods.credit.liters}
                      onChange={(e) => handlePaymentMethodChange('credit', 'liters', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    Amount: ₹{paymentMethods.credit.amount.toFixed(2)}
                  </div>
                </div>
              )}
            </div>

            {/* UPI */}
            <div className="border-2 border-gray-200 rounded-xl p-4">
              <label className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  checked={paymentMethods.upi.enabled}
                  onChange={(e) => handlePaymentMethodChange('upi', 'enabled', e.target.checked)}
                  className="w-5 h-5 text-blue-600"
                />
                <span className="text-lg font-semibold text-gray-800">UPI</span>
              </label>
              
              {paymentMethods.upi.enabled && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={paymentMethods.upi.amount}
                    onChange={(e) => handlePaymentMethodChange('upi', 'amount', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500"
                    placeholder="0.00"
                  />
                </div>
              )}
            </div>

            {/* HP Pay */}
            <div className="border-2 border-gray-200 rounded-xl p-4">
              <label className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  checked={paymentMethods.hpPay.enabled}
                  onChange={(e) => handlePaymentMethodChange('hpPay', 'enabled', e.target.checked)}
                  className="w-5 h-5 text-blue-600"
                />
                <span className="text-lg font-semibold text-gray-800">HP Pay</span>
              </label>
              
              {paymentMethods.hpPay.enabled && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={paymentMethods.hpPay.amount}
                    onChange={(e) => handlePaymentMethodChange('hpPay', 'amount', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500"
                    placeholder="0.00"
                  />
                </div>
              )}
            </div>

            {/* Dt Plus */}
            <div className="border-2 border-gray-200 rounded-xl p-4">
              <label className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  checked={paymentMethods.dtPlus.enabled}
                  onChange={(e) => handlePaymentMethodChange('dtPlus', 'enabled', e.target.checked)}
                  className="w-5 h-5 text-blue-600"
                />
                <span className="text-lg font-semibold text-gray-800">Dt Plus</span>
              </label>
              
              {paymentMethods.dtPlus.enabled && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={paymentMethods.dtPlus.amount}
                    onChange={(e) => handlePaymentMethodChange('dtPlus', 'amount', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500"
                    placeholder="0.00"
                  />
                </div>
              )}
            </div>


          </div>
          
          {/* Success Message */}
          {message && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {message}
            </div>
          )}
          
          {/* Submit Payment Methods Button */}
          <div className="text-center mt-6">
            <button
              onClick={() => {
                console.log('Submit button clicked');
                console.log('Current payment methods:', paymentMethods);
                console.log('Payment summary:', paymentSummary);
                setMessage("Payment methods saved successfully!");
                setTimeout(() => setMessage(""), 3000);
              }}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Submit Payment Methods
            </button>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-8 text-white shadow-2xl">
          <h2 className="text-2xl font-bold mb-6 text-center">Payment Summary</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="bg-blue-600 bg-opacity-80 rounded-xl p-4 text-white">
              <h3 className="text-lg font-semibold mb-2">Total Sales</h3>
              <div className="text-2xl font-bold flex items-center justify-center">
                <FaRupeeSign className="mr-1" />
                {totalAmount.toFixed(2)}
              </div>
            </div>
            
            <div className="bg-green-600 bg-opacity-80 rounded-xl p-4 text-white">
              <h3 className="text-lg font-semibold mb-2">Net Cash</h3>
              <div className="text-2xl font-bold flex items-center justify-center">
                <FaRupeeSign className="mr-1" />
                {paymentSummary.totalCash.toFixed(2)}
              </div>
              <p className="text-sm mt-1 opacity-90">Total - Other Payments</p>
            </div>
            
            <div className="bg-orange-600 bg-opacity-80 rounded-xl p-4 text-white">
              <h3 className="text-lg font-semibold mb-2">Other Payments</h3>
              <div className="text-2xl font-bold flex items-center justify-center">
                <FaRupeeSign className="mr-1" />
                {paymentSummary.totalOther.toFixed(2)}
              </div>
            </div>
            

          </div>
          
          {/* Payment Method Breakdown */}
          <div className="mt-8 bg-white bg-opacity-10 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-center">Payment Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {Object.entries(paymentMethods).map(([method, data]) => {
                console.log(`Checking method ${method}:`, data);
                
                if (!data.enabled) {
                  console.log(`${method} is not enabled, skipping`);
                  return null;
                }
                
                console.log(`${method} is enabled, rendering...`);
                
                const methodName = method === 'hpPay' ? 'HP Pay' : method === 'dtPlus' ? 'Dt Plus' : method.charAt(0).toUpperCase() + method.slice(1);
                const amount = method === 'credit' ? data.amount : parseFloat(data.amount || 0);
                
                console.log(`Rendering ${methodName} with amount ${amount}`);
                
                return (
                  <div key={method} className="flex justify-between items-center bg-white rounded p-3 border border-gray-300 text-gray-800">
                    <span className="font-medium">
                      {methodName}
                      {method === 'credit' && data.liters && ` (${data.liters}L ${data.fuelType})`}
                    </span>
                    <span className="font-bold text-green-600">
                      ₹{amount.toFixed(2)}
                    </span>
                  </div>
                );
              })}
              
              {/* Debug: Show if no methods are enabled */}
              {Object.entries(paymentMethods).filter(([method, data]) => data.enabled).length === 0 && (
                <div className="col-span-2 text-center text-white opacity-70">
                  No payment methods enabled
                </div>
              )}
            </div>
            
            {/* Net Cash Calculation */}
            <div className="mt-6 pt-4 border-t border-white border-opacity-30">
              <div className="bg-green-500 bg-opacity-30 rounded-lg p-4 border-2 border-green-300">
                <div className="flex justify-between items-center text-lg">
                  <span className="font-bold">Cash in Hand:</span>
                  <span className="font-bold text-2xl flex items-center">
                    <FaRupeeSign className="mr-1" />
                    {paymentSummary.totalCash.toFixed(2)}
                  </span>
                </div>
                <p className="text-sm mt-2 opacity-90 text-center">
                  Cash in Hand
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => navigate("/home")}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => navigate("/home/calculation", {
              state: {
                paymentMethods: paymentMethods,
                totalSales: totalAmount,
                salesData: {
                  checkpoint,
                  readings,
                  calculations,
                  rates
                }
              }
            })}
            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Proceed Next
          </button>
        </div>
      </div>
    </div>
  );
}