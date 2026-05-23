const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-white text-xl font-bold mb-4 flex items-center gap-2">
            BusBooking
          </h3>
          <p className="text-sm">
            The most reliable way to book your bus tickets online. Fast, secure, and hassle-free.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-blue-400 transition">Home</a></li>
            <li><a href="/search" className="hover:text-blue-400 transition">Search Tickets</a></li>
            <li><a href="/login" className="hover:text-blue-400 transition">Login</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li>Email: support@busbooking.com</li>
            <li>Phone: +1 234 567 8900</li>
            <li>Address: 123 Bus Lane, Transit City</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} BusBooking. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
