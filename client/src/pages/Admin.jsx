import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Bus, Map, Users, Ticket, Plus, Trash2 } from 'lucide-react';

const Admin = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [bookings, setBookings] = useState([]);
  
  // Dashboard stats
  const [stats, setStats] = useState({ totalBuses: 0, totalRoutes: 0, totalBookings: 0, revenue: 0 });

  // Add Bus Form State
  const [newBus, setNewBus] = useState({ name: '', busNumber: '', type: 'AC Seater', capacity: 40, route: '', departureTime: '', arrivalTime: '', price: '' });
  
  // Add Route Form State
  const [newRoute, setNewRoute] = useState({ from: '', to: '', distance: '', estimatedDuration: '' });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      const [busesRes, routesRes, bookingsRes] = await Promise.all([
        axios.get('/api/buses', config),
        axios.get('/api/routes', config),
        axios.get('/api/bookings', config)
      ]);

      setBuses(busesRes.data);
      setRoutes(routesRes.data);
      setBookings(bookingsRes.data);

      const revenue = bookingsRes.data.reduce((acc, curr) => curr.status === 'Paid' ? acc + curr.totalAmount : acc, 0);
      setStats({
        totalBuses: busesRes.data.length,
        totalRoutes: routesRes.data.length,
        totalBookings: bookingsRes.data.length,
        revenue
      });

    } catch (err) {
      console.error(err);
    }
  };

  const handleAddBus = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post('/api/buses', newBus, config);
      setNewBus({ name: '', busNumber: '', type: 'AC Seater', capacity: 40, route: '', departureTime: '', arrivalTime: '', price: '' });
      fetchData();
      alert('Bus added successfully');
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleAddRoute = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post('/api/routes', newRoute, config);
      setNewRoute({ from: '', to: '', distance: '', estimatedDuration: '' });
      fetchData();
      alert('Route added successfully');
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleDeleteBus = async (id) => {
    if(window.confirm('Delete this bus?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`/api/buses/${id}`, config);
        fetchData();
      } catch (err) {
        alert(err.response?.data?.message || err.message);
      }
    }
  };

  const handleDeleteRoute = async (id) => {
    if(window.confirm('Delete this route?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`/api/routes/${id}`, config);
        fetchData();
      } catch (err) {
        alert(err.response?.data?.message || err.message);
      }
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-white rounded-2xl shadow-sm border border-slate-100 p-4 h-fit sticky top-24">
          <h2 className="text-xl font-bold text-slate-800 mb-6 px-4">Admin Panel</h2>
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Users size={20} /> Overview
            </button>
            <button
              onClick={() => setActiveTab('routes')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${activeTab === 'routes' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Map size={20} /> Manage Routes
            </button>
            <button
              onClick={() => setActiveTab('buses')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${activeTab === 'buses' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Bus size={20} /> Manage Buses
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${activeTab === 'bookings' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Ticket size={20} /> All Bookings
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-800 mb-6">Dashboard Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center">
                  <div className="text-blue-600 mb-2"><Map size={32} /></div>
                  <div className="text-3xl font-bold text-slate-800">{stats.totalRoutes}</div>
                  <div className="text-slate-500 text-sm">Total Routes</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center">
                  <div className="text-green-600 mb-2"><Bus size={32} /></div>
                  <div className="text-3xl font-bold text-slate-800">{stats.totalBuses}</div>
                  <div className="text-slate-500 text-sm">Active Buses</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center">
                  <div className="text-purple-600 mb-2"><Ticket size={32} /></div>
                  <div className="text-3xl font-bold text-slate-800">{stats.totalBookings}</div>
                  <div className="text-slate-500 text-sm">Total Bookings</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center">
                  <div className="text-emerald-600 mb-2"><span className="text-3xl font-bold">₹</span></div>
                  <div className="text-3xl font-bold text-slate-800">{stats.revenue}</div>
                  <div className="text-slate-500 text-sm">Total Revenue</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'routes' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2"><Plus size={20}/> Add New Route</h3>
                <form onSubmit={handleAddRoute} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">From</label>
                    <input type="text" required value={newRoute.from} onChange={(e) => setNewRoute({...newRoute, from: e.target.value})} className="w-full px-3 py-2 border rounded-lg" placeholder="City A" />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">To</label>
                    <input type="text" required value={newRoute.to} onChange={(e) => setNewRoute({...newRoute, to: e.target.value})} className="w-full px-3 py-2 border rounded-lg" placeholder="City B" />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">Duration</label>
                    <input type="text" required value={newRoute.estimatedDuration} onChange={(e) => setNewRoute({...newRoute, estimatedDuration: e.target.value})} className="w-full px-3 py-2 border rounded-lg" placeholder="e.g. 5h 30m" />
                  </div>
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700">Add Route</button>
                </form>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Existing Routes</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="p-3 text-sm font-semibold text-slate-600">From</th>
                        <th className="p-3 text-sm font-semibold text-slate-600">To</th>
                        <th className="p-3 text-sm font-semibold text-slate-600">Duration</th>
                        <th className="p-3 text-sm font-semibold text-slate-600 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {routes.map(r => (
                        <tr key={r._id} className="hover:bg-slate-50">
                          <td className="p-3 text-sm">{r.from}</td>
                          <td className="p-3 text-sm">{r.to}</td>
                          <td className="p-3 text-sm">{r.estimatedDuration}</td>
                          <td className="p-3 text-right">
                            <button onClick={() => handleDeleteRoute(r._id)} className="text-red-500 hover:text-red-700"><Trash2 size={16}/></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'buses' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2"><Plus size={20}/> Add New Bus</h3>
                <form onSubmit={handleAddBus} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">Bus Name / Operator</label>
                    <input type="text" required value={newBus.name} onChange={(e) => setNewBus({...newBus, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg" placeholder="Express Travels" />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">Bus Number</label>
                    <input type="text" required value={newBus.busNumber} onChange={(e) => setNewBus({...newBus, busNumber: e.target.value})} className="w-full px-3 py-2 border rounded-lg" placeholder="ABC-1234" />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">Route</label>
                    <select required value={newBus.route} onChange={(e) => setNewBus({...newBus, route: e.target.value})} className="w-full px-3 py-2 border rounded-lg bg-white">
                      <option value="">Select Route</option>
                      {routes.map(r => <option key={r._id} value={r._id}>{r.from} to {r.to}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">Type</label>
                    <select value={newBus.type} onChange={(e) => setNewBus({...newBus, type: e.target.value})} className="w-full px-3 py-2 border rounded-lg bg-white">
                      <option>AC Seater</option>
                      <option>AC Sleeper</option>
                      <option>Non-AC Seater</option>
                      <option>Non-AC Sleeper</option>
                      <option>AC Luxury</option>
                      <option>AC Deluxe</option>
                      <option>Volvo AC</option>
                      <option>AC Mini Bus</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">Departure Time</label>
                    <input type="text" required value={newBus.departureTime} onChange={(e) => setNewBus({...newBus, departureTime: e.target.value})} className="w-full px-3 py-2 border rounded-lg" placeholder="10:00 AM" />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">Arrival Time</label>
                    <input type="text" required value={newBus.arrivalTime} onChange={(e) => setNewBus({...newBus, arrivalTime: e.target.value})} className="w-full px-3 py-2 border rounded-lg" placeholder="04:00 PM" />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">Price (₹)</label>
                    <input type="number" required value={newBus.price} onChange={(e) => setNewBus({...newBus, price: e.target.value})} className="w-full px-3 py-2 border rounded-lg" placeholder="500" />
                  </div>
                  <div className="md:col-span-2 flex justify-end">
                    <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700">Add Bus</button>
                  </div>
                </form>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Existing Buses</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="p-3 text-sm font-semibold text-slate-600">Bus Name</th>
                        <th className="p-3 text-sm font-semibold text-slate-600">Number</th>
                        <th className="p-3 text-sm font-semibold text-slate-600">Route</th>
                        <th className="p-3 text-sm font-semibold text-slate-600">Price</th>
                        <th className="p-3 text-sm font-semibold text-slate-600 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {buses.map(b => (
                        <tr key={b._id} className="hover:bg-slate-50">
                          <td className="p-3 text-sm font-medium">{b.name}</td>
                          <td className="p-3 text-sm">{b.busNumber}</td>
                          <td className="p-3 text-sm">{b.route?.from} to {b.route?.to}</td>
                          <td className="p-3 text-sm">₹{b.price}</td>
                          <td className="p-3 text-right">
                            <button onClick={() => handleDeleteBus(b._id)} className="text-red-500 hover:text-red-700"><Trash2 size={16}/></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-4">All Bookings</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="p-3 text-sm font-semibold text-slate-600">ID</th>
                      <th className="p-3 text-sm font-semibold text-slate-600">User</th>
                      <th className="p-3 text-sm font-semibold text-slate-600">Bus</th>
                      <th className="p-3 text-sm font-semibold text-slate-600">Amount</th>
                      <th className="p-3 text-sm font-semibold text-slate-600">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {bookings.map(b => (
                      <tr key={b._id} className="hover:bg-slate-50">
                        <td className="p-3 text-xs font-mono">{b._id}</td>
                        <td className="p-3 text-sm">{b.user?.name || 'Unknown'}</td>
                        <td className="p-3 text-sm">{b.bus?.name}</td>
                        <td className="p-3 text-sm">₹{b.totalAmount}</td>
                        <td className="p-3 text-sm">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            b.status === 'Paid' ? 'bg-green-100 text-green-700' :
                            b.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
