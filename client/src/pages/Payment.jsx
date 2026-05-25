import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BookingContext } from '../context/BookingContext';
import { AuthContext } from '../context/AuthContext';
import { CreditCard, CheckCircle, Smartphone, Building2 } from 'lucide-react';

const Payment = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { selectedBus, selectedSeats, passengerDetails, clearBookingData } = useContext(BookingContext);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Tab State
  const [activeTab, setActiveTab] = useState('card');

  // Payment form state
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [upiId, setUpiId] = useState('');
  const [bank, setBank] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
    if (!selectedBus || selectedSeats.length === 0) {
      navigate('/search');
    }
  }, [user, navigate, selectedBus, selectedSeats]);

  const totalAmount = selectedBus ? selectedBus.price * selectedSeats.length : 0;

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Create Booking in Backend
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      const bookingData = {
        bus: selectedBus._id,
        travelDate: new Date(), // Using current date for demo, should be selected date
        seats: passengerDetails,
        totalAmount,
      };

      const { data: createdBooking } = await axios.post('/api/bookings', bookingData, config);

      // 2. Mock Payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Determine Payment Method String
      let paymentMethodStr = 'Credit/Debit Card';
      if (activeTab === 'upi') paymentMethodStr = 'UPI';
      if (activeTab === 'netbanking') paymentMethodStr = `Net Banking (${bank || 'Bank'})`;

      // 3. Update Booking to Paid
      await axios.put(`/api/bookings/${createdBooking._id}/pay`, {
        id: `mock_tx_${Math.random().toString(36).substring(7)}`,
        paymentMethod: paymentMethodStr,
      }, config);

      setSuccess(true);
      
      // Navigate to confirmation after short delay
      setTimeout(() => {
        clearBookingData();
        navigate(`/confirmation/${createdBooking._id}`);
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <CheckCircle size={80} className="text-green-500 mx-auto mb-6 animate-bounce" />
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Payment Successful!</h2>
          <p className="text-slate-600">Generating your tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Payment Form Area */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Select Payment Method</h2>

            {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">{error}</div>}

            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-6">
              <p className="text-sm text-blue-800 flex items-center gap-2">
                <span>ℹ️</span> This is a mock payment gateway. Any random details will work.
              </p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 mb-6">
              <button
                className={`flex-1 py-3 font-medium text-sm flex justify-center items-center gap-2 transition border-b-2 ${activeTab === 'card' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                onClick={() => setActiveTab('card')}
              >
                <CreditCard size={18} /> Card
              </button>
              <button
                className={`flex-1 py-3 font-medium text-sm flex justify-center items-center gap-2 transition border-b-2 ${activeTab === 'upi' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                onClick={() => setActiveTab('upi')}
              >
                <Smartphone size={18} /> UPI
              </button>
              <button
                className={`flex-1 py-3 font-medium text-sm flex justify-center items-center gap-2 transition border-b-2 ${activeTab === 'netbanking' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                onClick={() => setActiveTab('netbanking')}
              >
                <Building2 size={18} /> Net Banking
              </button>
            </div>

            {/* Forms */}
            <form onSubmit={handlePayment} className="space-y-6">
              
              {activeTab === 'card' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Name on Card</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Card Number</label>
                    <input
                      type="text"
                      required
                      maxLength="16"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                      placeholder="0000 0000 0000 0000"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Expiry Date</label>
                      <input
                        type="text"
                        required
                        maxLength="5"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">CVV</label>
                      <input
                        type="password"
                        required
                        maxLength="3"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                        placeholder="123"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'upi' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-xl mb-4 bg-slate-50">
                    <div className="w-32 h-32 bg-white p-2 border border-slate-200 rounded-lg shadow-sm mb-4">
                      {/* Fake QR Code */}
                      <div className="w-full h-full bg-slate-800" style={{ backgroundImage: 'radial-gradient(circle, #334155 20%, transparent 20%), radial-gradient(circle, #334155 20%, transparent 20%)', backgroundSize: '10px 10px', backgroundPosition: '0 0, 5px 5px' }}></div>
                    </div>
                    <p className="text-sm font-medium text-slate-600">Scan QR Code with any UPI app</p>
                  </div>
                  <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-slate-200"></div>
                    <span className="flex-shrink-0 mx-4 text-slate-400 text-sm">OR</span>
                    <div className="flex-grow border-t border-slate-200"></div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Enter UPI ID</label>
                    <input
                      type="text"
                      required
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                      placeholder="username@upi"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'netbanking' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Select Your Bank</label>
                    <select
                      required
                      value={bank}
                      onChange={(e) => setBank(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
                    >
                      <option value="" disabled>Choose a bank...</option>
                      <option value="HDFC Bank">HDFC Bank</option>
                      <option value="State Bank of India">State Bank of India</option>
                      <option value="ICICI Bank">ICICI Bank</option>
                      <option value="Axis Bank">Axis Bank</option>
                      <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                      <option value="Punjab National Bank">Punjab National Bank</option>
                      <option value="Other Bank">Other Bank</option>
                    </select>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl mt-4">
                    <p className="text-sm text-slate-600 text-center">You will be securely redirected to your bank's portal to complete the payment.</p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-6 rounded-xl transition shadow-lg flex justify-center items-center gap-2 mt-8"
              >
                {loading ? 'Processing...' : `Pay ₹${totalAmount}`}
              </button>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full md:w-80">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-24">
            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Order Summary</h3>
            
            <div className="mb-4">
              <p className="font-semibold text-slate-700">{selectedBus?.name}</p>
              <p className="text-sm text-slate-500">{selectedBus?.route?.from} → {selectedBus?.route?.to}</p>
            </div>

            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Seats ({selectedSeats.join(', ')})</span>
                <span className="font-medium">₹{totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Service Fee</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-100 text-xl font-bold text-slate-800">
              <span>Total Pay</span>
              <span className="text-blue-600">₹{totalAmount}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Payment;
