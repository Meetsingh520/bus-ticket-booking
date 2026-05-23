import { createContext, useState } from 'react';

export const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    date: '',
  });
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [passengerDetails, setPassengerDetails] = useState([]);

  const updateSearchParams = (params) => {
    setSearchParams(params);
  };

  const selectBus = (bus) => {
    setSelectedBus(bus);
    setSelectedSeats([]); // reset seats when bus changes
    setPassengerDetails([]);
  };

  const toggleSeat = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const clearBookingData = () => {
    setSelectedBus(null);
    setSelectedSeats([]);
    setPassengerDetails([]);
  };

  return (
    <BookingContext.Provider
      value={{
        searchParams,
        updateSearchParams,
        selectedBus,
        selectBus,
        selectedSeats,
        toggleSeat,
        passengerDetails,
        setPassengerDetails,
        clearBookingData
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
