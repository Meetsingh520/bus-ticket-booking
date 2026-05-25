import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Route from '../models/Route.js';
import Bus from '../models/Bus.js';
import User from '../models/User.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bus-ticket-booking';

const seedData = async () => {
  try {
    console.log('Connecting to MongoDB at:', MONGO_URI);
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected successfully!');

    // Clear existing data
    console.log('Clearing existing data from database...');
    await Route.deleteMany({});
    await Bus.deleteMany({});
    await User.deleteMany({});
    console.log('Existing collections cleared.');

    // Seed Users
    console.log('Seeding users...');
    const users = [
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin',
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user',
      },
    ];

    const createdUsers = await User.create(users);
    console.log(`Seeded ${createdUsers.length} users successfully.`);

    // Seed Routes
    console.log('Seeding routes...');
    const routesData = [
      { from: 'Chandigarh', to: 'Delhi', distance: 245, estimatedDuration: '5h 0m' },
      { from: 'Ludhiana', to: 'Amritsar', distance: 140, estimatedDuration: '4h 0m' },
      { from: 'Delhi', to: 'Jaipur', distance: 270, estimatedDuration: '7h 0m' },
      { from: 'Chandigarh', to: 'Shimla', distance: 110, estimatedDuration: '5h 0m' },
      { from: 'Mohali', to: 'Jalandhar', distance: 145, estimatedDuration: '3h 0m' },
      { from: 'Delhi', to: 'Manali', distance: 530, estimatedDuration: '11h 30m' },
      { from: 'Chandigarh', to: 'Dehradun', distance: 170, estimatedDuration: '6h 0m' },
      { from: 'Amritsar', to: 'Jammu', distance: 215, estimatedDuration: '9h 0m' },
      { from: 'Patiala', to: 'Chandigarh', distance: 70, estimatedDuration: '2h 30m' },
      { from: 'Delhi', to: 'Chandigarh', distance: 245, estimatedDuration: '6h 0m' },
      { from: 'Shimla', to: 'Manali', distance: 250, estimatedDuration: '8h 0m' },
      { from: 'Jalandhar', to: 'Ludhiana', distance: 60, estimatedDuration: '2h 0m' },
      { from: 'Delhi', to: 'Noida', distance: 40, estimatedDuration: '1h 30m' },
      { from: 'Chandigarh', to: 'Amritsar', distance: 225, estimatedDuration: '6h 0m' },
    ];

    const createdRoutes = [];
    for (const r of routesData) {
      const route = await Route.create(r);
      createdRoutes.push(route);
    }
    console.log(`Seeded ${createdRoutes.length} routes successfully.`);

    // Helper to get Route Object ID by from and to
    const getRouteId = (from, to) => {
      const route = createdRoutes.find(
        (r) => r.from.toLowerCase() === from.toLowerCase() && r.to.toLowerCase() === to.toLowerCase()
      );
      if (!route) {
        throw new Error(`Route not found for: ${from} -> ${to}`);
      }
      return route._id;
    };

    // Seed Buses
    console.log('Seeding buses...');
    const busesData = [
      // 1. City Express (AC Sleeper, 08:00 AM - 01:00 PM, 22 Seats, Online)
      {
        name: 'City Express',
        busNumber: '101',
        type: 'AC Sleeper',
        capacity: 40, // Let's set capacity to 40 (standard layout). The remaining seats count is handled by availability or UI display
        route: getRouteId('Chandigarh', 'Delhi'),
        departureTime: '08:00 AM',
        arrivalTime: '01:00 PM',
        price: 620,
        alternativeRoute: 'Chandigarh → Gurgaon',
        paymentMethod: 'Online',
      },
      {
        name: 'City Express',
        busNumber: '101A',
        type: 'AC Sleeper',
        capacity: 40,
        route: getRouteId('Chandigarh', 'Delhi'),
        departureTime: '08:00 AM',
        arrivalTime: '01:00 PM',
        price: 680,
        alternativeRoute: 'Chandigarh → Panipat → Delhi',
        paymentMethod: 'Online',
      },

      // 2. Punjab Roadways (Non-AC Seater, 07:30 AM - 11:30 AM, 30 Seats, Cash/Online)
      {
        name: 'Punjab Roadways',
        busNumber: '102',
        type: 'Non-AC Seater',
        capacity: 40,
        route: getRouteId('Ludhiana', 'Amritsar'),
        departureTime: '07:30 AM',
        arrivalTime: '11:30 AM',
        price: 450,
        alternativeRoute: 'Ludhiana → Jalandhar → Amritsar',
        paymentMethod: 'Cash/Online',
      },
      {
        name: 'Punjab Roadways',
        busNumber: '102A',
        type: 'Non-AC Seater',
        capacity: 40,
        route: getRouteId('Ludhiana', 'Amritsar'),
        departureTime: '07:30 AM',
        arrivalTime: '11:30 AM',
        price: 600,
        alternativeRoute: 'Ludhiana → Pathankot',
        paymentMethod: 'Cash/Online',
      },

      // 3. Royal Travels (AC Luxury, 09:00 PM - 04:00 AM, 18 Seats, Online)
      {
        name: 'Royal Travels',
        busNumber: '103',
        type: 'AC Luxury',
        capacity: 40,
        route: getRouteId('Delhi', 'Jaipur'),
        departureTime: '09:00 PM',
        arrivalTime: '04:00 AM',
        price: 780,
        alternativeRoute: 'Delhi → Gurugram → Jaipur',
        paymentMethod: 'Online',
      },
      {
        name: 'Royal Travels',
        busNumber: '103A',
        type: 'AC Luxury',
        capacity: 40,
        route: getRouteId('Delhi', 'Jaipur'),
        departureTime: '09:00 PM',
        arrivalTime: '04:00 AM',
        price: 950,
        alternativeRoute: 'Delhi → Ajmer',
        paymentMethod: 'Online',
      },

      // 4. Green Line Bus (Non-AC Seater, 09:30 AM - 02:30 PM, 26 Seats, Online)
      {
        name: 'Green Line Bus',
        busNumber: '104',
        type: 'Non-AC Seater',
        capacity: 40,
        route: getRouteId('Chandigarh', 'Shimla'),
        departureTime: '09:30 AM',
        arrivalTime: '02:30 PM',
        price: 550,
        alternativeRoute: 'Chandigarh → Solan → Shimla',
        paymentMethod: 'Online',
      },
      {
        name: 'Green Line Bus',
        busNumber: '104A',
        type: 'Non-AC Seater',
        capacity: 40,
        route: getRouteId('Chandigarh', 'Shimla'),
        departureTime: '09:30 AM',
        arrivalTime: '02:30 PM',
        price: 700,
        alternativeRoute: 'Chandigarh → Kufri',
        paymentMethod: 'Online',
      },

      // 5. Fast Track Travels (AC Seater, 10:00 AM - 01:00 PM, 20 Seats, Online)
      {
        name: 'Fast Track Travels',
        busNumber: '105',
        type: 'AC Seater',
        capacity: 40,
        route: getRouteId('Mohali', 'Jalandhar'),
        departureTime: '10:00 AM',
        arrivalTime: '01:00 PM',
        price: 350,
        alternativeRoute: 'Mohali → Phagwara → Jalandhar',
        paymentMethod: 'Online',
      },
      {
        name: 'Fast Track Travels',
        busNumber: '105A',
        type: 'AC Seater',
        capacity: 40,
        route: getRouteId('Mohali', 'Jalandhar'),
        departureTime: '10:00 AM',
        arrivalTime: '01:00 PM',
        price: 650,
        alternativeRoute: 'Mohali → Amritsar',
        paymentMethod: 'Online',
      },

      // 6. Himachal Express (AC Sleeper, 08:30 PM - 08:00 AM, 15 Seats, Online)
      {
        name: 'Himachal Express',
        busNumber: '106',
        type: 'AC Sleeper',
        capacity: 40,
        route: getRouteId('Delhi', 'Manali'),
        departureTime: '08:30 PM',
        arrivalTime: '08:00 AM',
        price: 1300,
        alternativeRoute: 'Delhi → Chandigarh → Manali',
        paymentMethod: 'Online',
      },
      {
        name: 'Himachal Express',
        busNumber: '106A',
        type: 'AC Sleeper',
        capacity: 40,
        route: getRouteId('Delhi', 'Manali'),
        departureTime: '08:30 PM',
        arrivalTime: '08:00 AM',
        price: 1100,
        alternativeRoute: 'Delhi → Kullu',
        paymentMethod: 'Online',
      },

      // 7. Northern Travels (AC Seater, 06:00 AM - 12:00 PM, 28 Seats, Cash/Online)
      {
        name: 'Northern Travels',
        busNumber: '107',
        type: 'AC Seater',
        capacity: 40,
        route: getRouteId('Chandigarh', 'Dehradun'),
        departureTime: '06:00 AM',
        arrivalTime: '12:00 PM',
        price: 850,
        alternativeRoute: 'Chandigarh → Haridwar → Dehradun',
        paymentMethod: 'Cash/Online',
      },
      {
        name: 'Northern Travels',
        busNumber: '107A',
        type: 'AC Seater',
        capacity: 40,
        route: getRouteId('Chandigarh', 'Dehradun'),
        departureTime: '06:00 AM',
        arrivalTime: '12:00 PM',
        price: 900,
        alternativeRoute: 'Chandigarh → Rishikesh',
        paymentMethod: 'Cash/Online',
      },

      // 8. Skyline Bus Service (AC Sleeper, 07:00 PM - 04:00 AM, 16 Seats, Online)
      {
        name: 'Skyline Bus Service',
        busNumber: '108',
        type: 'AC Sleeper',
        capacity: 40,
        route: getRouteId('Amritsar', 'Jammu'),
        departureTime: '07:00 PM',
        arrivalTime: '04:00 AM',
        price: 950,
        alternativeRoute: 'Amritsar → Pathankot → Jammu',
        paymentMethod: 'Online',
      },
      {
        name: 'Skyline Bus Service',
        busNumber: '108A',
        type: 'AC Sleeper',
        capacity: 40,
        route: getRouteId('Amritsar', 'Jammu'),
        departureTime: '07:00 PM',
        arrivalTime: '04:00 AM',
        price: 1200,
        alternativeRoute: 'Amritsar → Katra',
        paymentMethod: 'Online',
      },

      // 9. Happy Journey Bus (Non-AC Seater, 08:00 AM - 10:30 AM, 35 Seats, Cash)
      {
        name: 'Happy Journey Bus',
        busNumber: '109',
        type: 'Non-AC Seater',
        capacity: 40,
        route: getRouteId('Patiala', 'Chandigarh'),
        departureTime: '08:00 AM',
        arrivalTime: '10:30 AM',
        price: 300,
        alternativeRoute: 'Patiala → Ambala → Chandigarh',
        paymentMethod: 'Cash',
      },
      {
        name: 'Happy Journey Bus',
        busNumber: '109A',
        type: 'Non-AC Seater',
        capacity: 40,
        route: getRouteId('Patiala', 'Chandigarh'),
        departureTime: '08:00 AM',
        arrivalTime: '10:30 AM',
        price: 250,
        alternativeRoute: 'Patiala → Mohali',
        paymentMethod: 'Cash',
      },

      // 10. Super Deluxe Coach (Volvo AC, 11:00 PM - 05:00 AM, 12 Seats, Online)
      {
        name: 'Super Deluxe Coach',
        busNumber: '110',
        type: 'Volvo AC',
        capacity: 40,
        route: getRouteId('Delhi', 'Chandigarh'),
        departureTime: '11:00 PM',
        arrivalTime: '05:00 AM',
        price: 850,
        alternativeRoute: 'Delhi → Karnal → Chandigarh',
        paymentMethod: 'Online',
      },
      {
        name: 'Super Deluxe Coach',
        busNumber: '110A',
        type: 'Volvo AC',
        capacity: 40,
        route: getRouteId('Delhi', 'Chandigarh'),
        departureTime: '11:00 PM',
        arrivalTime: '05:00 AM',
        price: 700,
        alternativeRoute: 'Delhi → Ambala',
        paymentMethod: 'Online',
      },

      // 11. Mountain Rider (AC Deluxe, 06:00 AM - 02:00 PM, 18 Seats, Online)
      {
        name: 'Mountain Rider',
        busNumber: '111',
        type: 'AC Deluxe',
        capacity: 40,
        route: getRouteId('Shimla', 'Manali'),
        departureTime: '06:00 AM',
        arrivalTime: '02:00 PM',
        price: 950,
        alternativeRoute: 'Shimla → Kullu → Manali',
        paymentMethod: 'Online',
      },
      {
        name: 'Mountain Rider',
        busNumber: '111A',
        type: 'AC Deluxe',
        capacity: 40,
        route: getRouteId('Shimla', 'Manali'),
        departureTime: '06:00 AM',
        arrivalTime: '02:00 PM',
        price: 1000,
        alternativeRoute: 'Shimla → Dharamshala',
        paymentMethod: 'Online',
      },

      // 12. Blue Star Travels (Non-AC Seater, 01:00 PM - 03:00 PM, 32 Seats, Cash/Online)
      {
        name: 'Blue Star Travels',
        busNumber: '112',
        type: 'Non-AC Seater',
        capacity: 40,
        route: getRouteId('Jalandhar', 'Ludhiana'),
        departureTime: '01:00 PM',
        arrivalTime: '03:00 PM',
        price: 280,
        alternativeRoute: 'Jalandhar → Phagwara → Ludhiana',
        paymentMethod: 'Cash/Online',
      },
      {
        name: 'Blue Star Travels',
        busNumber: '112A',
        type: 'Non-AC Seater',
        capacity: 40,
        route: getRouteId('Jalandhar', 'Ludhiana'),
        departureTime: '01:00 PM',
        arrivalTime: '03:00 PM',
        price: 550,
        alternativeRoute: 'Jalandhar → Chandigarh',
        paymentMethod: 'Cash/Online',
      },

      // 13. Metro Link Bus (AC Mini Bus, 07:00 AM - 08:30 AM, 25 Seats, Online)
      {
        name: 'Metro Link Bus',
        busNumber: '113',
        type: 'AC Mini Bus',
        capacity: 40,
        route: getRouteId('Delhi', 'Noida'),
        departureTime: '07:00 AM',
        arrivalTime: '08:30 AM',
        price: 220,
        alternativeRoute: 'Delhi → Ghaziabad → Noida',
        paymentMethod: 'Online',
      },
      {
        name: 'Metro Link Bus',
        busNumber: '113A',
        type: 'AC Mini Bus',
        capacity: 40,
        route: getRouteId('Delhi', 'Noida'),
        departureTime: '07:00 AM',
        arrivalTime: '08:30 AM',
        price: 350,
        alternativeRoute: 'Delhi → Greater Noida',
        paymentMethod: 'Online',
      },

      // 14. Golden Temple Express (AC Sleeper, 09:00 PM - 03:00 AM, 20 Seats, Online)
      {
        name: 'Golden Temple Express',
        busNumber: '114',
        type: 'AC Sleeper',
        capacity: 40,
        route: getRouteId('Chandigarh', 'Amritsar'),
        departureTime: '09:00 PM',
        arrivalTime: '03:00 AM',
        price: 750,
        alternativeRoute: 'Chandigarh → Ludhiana → Amritsar',
        paymentMethod: 'Online',
      },
      {
        name: 'Golden Temple Express',
        busNumber: '114A',
        type: 'AC Sleeper',
        capacity: 40,
        route: getRouteId('Chandigarh', 'Amritsar'),
        departureTime: '09:00 PM',
        arrivalTime: '03:00 AM',
        price: 780,
        alternativeRoute: 'Chandigarh → Jalandhar → Amritsar',
        paymentMethod: 'Online',
      },
    ];

    const createdBuses = await Bus.create(busesData);
    console.log(`Seeded ${createdBuses.length} buses successfully.`);

    console.log('Database seeding finished successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
