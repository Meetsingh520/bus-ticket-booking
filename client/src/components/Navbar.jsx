import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Bus, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass sticky top-0 z-50 px-6 py-4 flex justify-between items-center shadow-sm">
      <Link to="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition">
        <Bus size={28} />
        <span className="text-2xl font-bold tracking-tight">BusBooking</span>
      </Link>
      
      <div className="flex items-center gap-6">
        <Link to="/" className="text-slate-600 hover:text-blue-600 font-medium transition">Home</Link>
        <Link to="/search" className="text-slate-600 hover:text-blue-600 font-medium transition">Tickets</Link>
        
        {user ? (
          <div className="flex items-center gap-4">
            {user.role === 'admin' && (
              <Link to="/admin" className="text-red-500 hover:text-red-600 font-medium transition">Admin</Link>
            )}
            <Link to="/dashboard" className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-medium hover:bg-blue-100 transition">
              <User size={18} />
              {user.name}
            </Link>
            <button onClick={handleLogout} className="text-slate-500 hover:text-red-500 transition">
              <LogOut size={20} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-slate-600 hover:text-blue-600 font-medium transition">Login</Link>
            <Link to="/register" className="bg-blue-600 text-white px-5 py-2 rounded-full font-medium hover:bg-blue-700 transition shadow-md hover:shadow-lg">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
