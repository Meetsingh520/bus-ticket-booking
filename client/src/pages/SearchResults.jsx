import { useState, useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BookingContext } from '../context/BookingContext';
import { MapPin, Clock, Users, ArrowRight } from 'lucide-react';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const date = searchParams.get('date') || '';

  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { selectBus } = useContext(BookingContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        setLoading(true);
        // Note: For full app, we would pass from, to, date to API.
        // E.g., const { data } = await axios.get(`/api/buses?from=${from}&to=${to}&date=${date}`);
        const { data } = await axios.get('/api/buses'); // using all for testing
        
        // Front-end filtering if backend doesn't filter perfectly
        const filtered = data.filter(bus => {
          if (!bus.route) return false;
          const matchFrom = from ? bus.route.from.toLowerCase() === from.toLowerCase() : true;
          const matchTo = to ? bus.route.to.toLowerCase() === to.toLowerCase() : true;
          return matchFrom && matchTo;
        });
        
        setBuses(filtered.length > 0 ? filtered : data); // fallback to all data if none match for demo purposes
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBuses();
  }, [from, to, date]);

  const handleBookNow = (bus) => {
    selectBus(bus);
    navigate(`/booking/${bus._id}`);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-blue-600 text-white rounded-2xl p-6 mb-8 flex flex-wrap items-center justify-between shadow-lg">
          <div>
            <h2 className="text-2xl font-bold mb-2">Search Results</h2>
            <div className="flex items-center gap-2 text-blue-100">
              <span className="font-semibold">{from || 'Anywhere'}</span>
              <ArrowRight size={16} />
              <span className="font-semibold">{to || 'Anywhere'}</span>
              <span className="ml-4 px-3 py-1 bg-blue-700 rounded-full text-sm">{date || 'Any Date'}</span>
            </div>
          </div>
          <div className="mt-4 md:mt-0 text-blue-100 font-medium">
            {buses.length} buses found
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
        ) : buses.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-100">
            <div className="text-slate-400 mb-4 flex justify-center"><MapPin size={48} /></div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">No buses found</h3>
            <p className="text-slate-500">Try modifying your search criteria or date.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {buses.map((bus) => (
              <div key={bus._id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-slate-800">{bus.name}</h3>
                      <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-semibold">
                        {bus.type}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-6 text-slate-600">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">{bus.route?.from || 'Start'}</span>
                        <div className="flex items-center gap-1 text-xs mt-1">
                          <Clock size={14} /> {bus.departureTime}
                        </div>
                      </div>
                      
                      <div className="flex-1 px-4 flex flex-col items-center">
                        <span className="text-xs text-slate-400 mb-1">{bus.route?.estimatedDuration || 'N/A'}</span>
                        <div className="w-full border-t-2 border-dashed border-slate-300 relative">
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-slate-300">
                            <ArrowRight size={16} />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-semibold">{bus.route?.to || 'End'}</span>
                        <div className="flex items-center gap-1 text-xs mt-1">
                          <Clock size={14} /> {bus.arrivalTime}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full md:w-auto md:min-w-[200px] bg-slate-50 rounded-xl p-4 flex flex-col items-center justify-center border border-slate-100">
                    <div className="text-2xl font-bold text-blue-600 mb-1">${bus.price}</div>
                    <div className="flex items-center gap-1 text-slate-500 text-sm mb-4">
                      <Users size={16} /> {bus.capacity} seats total
                    </div>
                    <button
                      onClick={() => handleBookNow(bus)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition shadow-sm"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
