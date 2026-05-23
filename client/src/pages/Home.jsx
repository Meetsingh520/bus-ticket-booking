import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookingContext } from '../context/BookingContext';
import { Search, MapPin, Calendar } from 'lucide-react';

const Home = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const { updateSearchParams } = useContext(BookingContext);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    updateSearchParams({ from, to, date });
    navigate(`/search?from=${from}&to=${to}&date=${date}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-blue-600 text-white pt-24 pb-32 px-6">
        <div className="absolute inset-0 overflow-hidden">
          {/* Abstract background shapes */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute top-32 -left-24 w-72 h-72 bg-blue-700 rounded-full blur-3xl opacity-50"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
            Your Journey Starts Here
          </h1>
          <p className="text-xl text-blue-100 mb-12">
            Book bus tickets instantly with the most reliable network.
          </p>
        </div>
      </div>

      {/* Search Component (overlaps hero) */}
      <div className="max-w-5xl mx-auto px-6 -mt-16 relative z-20">
        <div className="glass-dark bg-white text-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-100">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">Leaving From</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-slate-400" size={20} />
                <input
                  type="text"
                  required
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  placeholder="City or Station"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">Going To</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-slate-400" size={20} />
                <input
                  type="text"
                  required
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="City or Station"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">Date of Journey</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 text-slate-400" size={20} />
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition shadow-lg flex justify-center items-center gap-2"
              >
                <Search size={20} />
                Search Buses
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-800">Why choose us?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Instant Booking</h3>
            <p className="text-slate-600">No queues, no waiting. Get your tickets confirmed instantly.</p>
          </div>
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🛡️</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Secure Payments</h3>
            <p className="text-slate-600">We use top-tier encryption to ensure your transactions are 100% safe.</p>
          </div>
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎧</span>
            </div>
            <h3 className="text-xl font-bold mb-2">24/7 Support</h3>
            <p className="text-slate-600">Our customer support team is always here to help you out.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
