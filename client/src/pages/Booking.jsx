import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BookingContext } from '../context/BookingContext';
import { AuthContext } from '../context/AuthContext';
import { UserPlus, CreditCard, ChevronRight } from 'lucide-react';

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const {
    selectedBus,
    selectBus,
    selectedSeats,
    toggleSeat,
    passengerDetails,
    setPassengerDetails
  } = useContext(BookingContext);

  const [loading, setLoading] = useState(!selectedBus);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchBus = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/buses/${id}`);
        selectBus(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (!selectedBus || selectedBus._id !== id) {
      fetchBus();
    }
  }, [id, user, navigate, selectedBus, selectBus]);

  // Generate a mock 2x2 seating layout (e.g., 40 seats)
  const renderSeats = () => {
    const totalSeats = selectedBus?.capacity || 40;
    const rows = Math.ceil(totalSeats / 4);
    let seats = [];

    for (let i = 0; i < rows; i++) {
      let row = [];
      for (let j = 1; j <= 4; j++) {
        const seatNumber = `${i + 1}${String.fromCharCode(64 + j)}`; // 1A, 1B, 1C, 1D...
        const isSelected = selectedSeats.includes(seatNumber);
        // Mock some seats as already booked based on ascii logic just for demo
        const isBooked = (i * 4 + j) % 7 === 0;

        row.push(
          <button
            key={seatNumber}
            disabled={isBooked}
            onClick={() => toggleSeat(seatNumber)}
            className={`w-10 h-10 rounded-t-lg rounded-b-sm font-semibold text-xs flex items-center justify-center transition
              ${isBooked ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 
                isSelected ? 'bg-blue-600 text-white shadow-md transform scale-105' : 
                'bg-white border-2 border-slate-200 text-slate-600 hover:border-blue-400'}`}
          >
            {seatNumber}
          </button>
        );
      }
      
      seats.push(
        <div key={`row-${i}`} className="flex justify-between w-full mb-3">
          <div className="flex gap-2">
            {row[0]}
            {row[1]}
          </div>
          <div className="w-8"></div> {/* Aisle */}
          <div className="flex gap-2">
            {row[2]}
            {row[3]}
          </div>
        </div>
      );
    }
    return seats;
  };

  const handlePassengerChange = (index, field, value) => {
    const updatedDetails = [...passengerDetails];
    if (!updatedDetails[index]) {
      updatedDetails[index] = { passengerName: '', passengerAge: '', passengerGender: 'Male', seatNumber: selectedSeats[index] };
    }
    updatedDetails[index][field] = value;
    updatedDetails[index].seatNumber = selectedSeats[index];
    setPassengerDetails(updatedDetails);
  };

  const proceedToPayment = () => {
    if (selectedSeats.length === 0) return alert('Please select at least one seat');
    
    // Check if all passenger details are filled
    for (let i = 0; i < selectedSeats.length; i++) {
      const p = passengerDetails[i];
      if (!p || !p.passengerName || !p.passengerAge) {
        return alert('Please fill in all passenger details');
      }
    }

    navigate('/payment');
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Col: Seat Selection */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Select Seats</h3>
            
            <div className="flex justify-between mb-8 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-white border-2 border-slate-200 rounded-t-sm"></div> Available
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-600 rounded-t-sm"></div> Selected
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-slate-300 rounded-t-sm"></div> Booked
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col items-center">
              <div className="w-full flex justify-end mb-6">
                {/* Steering wheel icon placeholder */}
                <div className="w-8 h-8 rounded-full border-4 border-slate-300 flex items-center justify-center">
                  <div className="w-1 h-4 bg-slate-300"></div>
                </div>
              </div>
              {renderSeats()}
            </div>
          </div>
        </div>

        {/* Right Col: Passenger Details & Summary */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <UserPlus size={20} className="text-blue-600" /> Passenger Details
            </h3>
            
            {selectedSeats.length === 0 ? (
              <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                Please select seats to enter passenger details.
              </div>
            ) : (
              <div className="space-y-6">
                {selectedSeats.map((seat, index) => (
                  <div key={seat} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <h4 className="font-semibold text-slate-700 mb-3">Seat: {seat}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={passengerDetails[index]?.passengerName || ''}
                          onChange={(e) => handlePassengerChange(index, 'passengerName', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                          placeholder="Passenger Name"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Age</label>
                        <input
                          type="number"
                          required
                          value={passengerDetails[index]?.passengerAge || ''}
                          onChange={(e) => handlePassengerChange(index, 'passengerAge', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                          placeholder="Age"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Gender</label>
                        <select
                          value={passengerDetails[index]?.passengerGender || 'Male'}
                          onChange={(e) => handlePassengerChange(index, 'passengerGender', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Fare Summary</h3>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-600">Base Fare ({selectedSeats.length} seats)</span>
              <span className="font-medium">₹{(selectedBus?.price * selectedSeats.length) || 0}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-600">Taxes & Fees</span>
              <span className="font-medium">₹0</span>
            </div>
            <div className="flex justify-between items-center py-4 text-xl font-bold text-slate-800">
              <span>Total Amount</span>
              <span className="text-blue-600">₹{(selectedBus?.price * selectedSeats.length) || 0}</span>
            </div>
            
            <button
              onClick={proceedToPayment}
              disabled={selectedSeats.length === 0}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition shadow-md disabled:bg-slate-300 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              Proceed to Payment <ChevronRight size={20} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Booking;
