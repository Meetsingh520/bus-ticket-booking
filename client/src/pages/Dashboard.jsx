import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Ticket, XCircle } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchMyBookings = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('/api/bookings/mybookings', config);
        setBookings(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBookings();
  }, [user, navigate]);

  const handleCancelBooking = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.put(`/api/bookings/${id}/cancel`, {}, config);
        // Refresh bookings
        const { data } = await axios.get('/api/bookings/mybookings', config);
        setBookings(data);
      } catch (err) {
        alert(err.response?.data?.message || err.message);
      }
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-8 flex items-center gap-3">
          <UserIcon /> Welcome, {user?.name}
        </h1>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Ticket className="text-blue-600" /> My Bookings
          </h2>

          {loading ? (
            <div className="text-center py-10">Loading your bookings...</div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <p className="text-slate-500 mb-4">You have no bookings yet.</p>
              <Link to="/search" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
                Book a Ticket
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.map((booking) => (
                <div key={booking._id} className="border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row justify-between gap-6 hover:shadow-md transition">
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Booking ID: {booking._id}</p>
                        <h3 className="text-lg font-bold text-slate-800">{booking.bus?.name || 'Bus Unavailable'}</h3>
                        <p className="text-sm text-slate-600">
                          {booking.bus?.route?.from} to {booking.bus?.route?.to}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        booking.status === 'Paid' ? 'bg-green-100 text-green-700' :
                        booking.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {booking.status}
                      </span>
                    </div>

                    <div className="text-sm text-slate-600 mb-2">
                      <span className="font-semibold">Seats:</span> {booking.seats.map(s => s.seatNumber).join(', ')}
                    </div>
                    <div className="text-sm text-slate-600 mb-4">
                      <span className="font-semibold">Date of Travel:</span> {new Date(booking.travelDate).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex flex-col justify-between items-end min-w-[150px]">
                    <div className="text-2xl font-bold text-slate-800">${booking.totalAmount}</div>
                    
                    <div className="flex flex-col gap-2 w-full mt-4">
                      <Link
                        to={`/confirmation/${booking._id}`}
                        className="text-center w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 px-4 rounded-lg transition text-sm"
                      >
                        View Ticket
                      </Link>
                      {booking.status !== 'Cancelled' && (
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          className="w-full flex items-center justify-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2 px-4 rounded-lg transition text-sm"
                        >
                          <XCircle size={16} /> Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const UserIcon = () => (
  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
  </div>
);

export default Dashboard;
