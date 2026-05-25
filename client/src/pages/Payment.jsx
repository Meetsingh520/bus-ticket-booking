import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BookingContext } from '../context/BookingContext';
import { AuthContext } from '../context/AuthContext';
import { CreditCard, CheckCircle } from 'lucide-react';

const Payment = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { selectedBus, selectedSeats, passengerDetails, clearBookingData } = useContext(BookingContext);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Payment form state
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');

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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 3. Update Booking to Paid
      await axios.put(`/api/bookings/${createdBooking._id}/pay`, {
        id: `mock_tx_${Math.random().toString(36).substring(7)}`,
        paymentMethod: 'Credit Card',
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
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Payment Form */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <CreditCard className="text-blue-600" /> Payment Details
            </h2>

            {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">{error}</div>}

            <form onSubmit={handlePayment} className="space-y-6">
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-6">
                <p className="text-sm text-blue-800 flex items-center gap-2">
                  <span>ℹ️</span> This is a mock payment gateway. Any random numbers will work.
                </p>
              </div>

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

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-6 rounded-xl transition shadow-lg flex justify-center items-center gap-2"
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
                <span className="font-medium">₹0</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-100 text-xl font-bold text-slate-800">
              <span>Total</span>
              <span className="text-blue-600">₹{totalAmount}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Payment;
