import { useState, useEffect, useContext, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle, Download, Printer, ArrowLeft } from 'lucide-react';
import html2pdf from 'html2pdf.js';

const Confirmation = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const receiptRef = useRef();

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` },
        };
        const { data } = await axios.get(`/api/bookings/${id}`, config);
        setBooking(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBooking();
    }
  }, [id, user]);

  const handleDownloadPdf = () => {
    const element = receiptRef.current;
    const opt = {
      margin:       10,
      filename:     `Bus_Ticket_${booking._id}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="text-center py-20">Loading ticket details...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!booking) return null;

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 print:bg-white print:py-0">
      <div className="max-w-3xl mx-auto">
        
        {/* Back Navigation (Hidden on print) */}
        <div className="flex items-center gap-2 mb-6 print:hidden">
          <Link to="/" className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>

        {/* Receipt Container */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden print:shadow-none print:border-none" ref={receiptRef}>
          
          {/* Header */}
          <div className="bg-blue-600 text-white p-8 text-center relative overflow-hidden print:bg-blue-600 print:text-black">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pattern-dots"></div>
            <CheckCircle size={64} className="mx-auto mb-4 text-green-300 relative z-10" />
            <h2 className="text-3xl font-bold relative z-10">Booking Confirmed!</h2>
            <p className="text-blue-100 relative z-10 mt-2">Booking ID: {booking._id}</p>
          </div>

          {/* Ticket Body */}
          <div className="p-8">
            <div className="flex flex-col md:flex-row justify-between border-b border-slate-100 pb-6 mb-6">
              <div>
                <p className="text-sm text-slate-500 mb-1">Bus Operator</p>
                <p className="font-bold text-lg text-slate-800">{booking.bus?.name}</p>
                <p className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-600 rounded inline-block mt-1">
                  {booking.bus?.type}
                </p>
              </div>
              <div className="mt-4 md:mt-0 text-left md:text-right">
                <p className="text-sm text-slate-500 mb-1">Status</p>
                <p className="font-bold text-lg text-green-600 uppercase">{booking.status}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-8 relative">
              <div className="w-1/3 text-center">
                <p className="text-2xl font-bold text-slate-800">{booking.bus?.departureTime}</p>
                <p className="text-slate-500">{booking.bus?.route?.from}</p>
              </div>
              <div className="w-1/3 flex items-center justify-center relative">
                <div className="w-full border-t-2 border-dashed border-slate-300"></div>
                <div className="absolute bg-white px-2 text-slate-400 text-xs">
                  {booking.bus?.route?.estimatedDuration || 'Duration'}
                </div>
              </div>
              <div className="w-1/3 text-center">
                <p className="text-2xl font-bold text-slate-800">{booking.bus?.arrivalTime}</p>
                <p className="text-slate-500">{booking.bus?.route?.to}</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-6 mb-8 border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">Passenger Details</h3>
              <div className="space-y-3">
                {booking.seats.map((seat, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-slate-700 w-8">{seat.seatNumber}</span>
                      <span className="text-slate-600">{seat.passengerName} ({seat.passengerAge}, {seat.passengerGender})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center bg-blue-50 p-6 rounded-xl border border-blue-100">
              <div>
                <p className="text-sm text-blue-800 font-medium">Total Amount Paid</p>
                <p className="text-xs text-blue-600">via {booking.paymentDetails?.paymentMethod || 'Card'}</p>
              </div>
              <p className="text-3xl font-bold text-blue-700">₹{booking.totalAmount}</p>
            </div>
          </div>
        </div>

        {/* Footer Actions (Hidden on print) */}
        <div className="bg-slate-50 p-6 flex justify-center gap-4 print:hidden">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium py-2 px-6 rounded-lg transition"
          >
            <Printer size={18} /> Print
          </button>
          <button 
            onClick={handleDownloadPdf}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition shadow-sm"
          >
            <Download size={18} /> Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;

