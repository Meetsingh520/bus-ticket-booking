import Bus from '../models/Bus.js';

// @desc    Get all buses
// @route   GET /api/buses
// @access  Public
export const getBuses = async (req, res) => {
  try {
    const { from, to, date } = req.query;
    
    let query = {};
    
    // We would ideally populate route and filter by from/to if provided
    // For simplicity, we fetch all buses if no query, or we can filter by from/to on the route ref
    
    const buses = await Bus.find({ isAvailable: true }).populate('route');
    
    if (from && to) {
      const filteredBuses = buses.filter(bus => 
        bus.route && 
        bus.route.from.toLowerCase() === from.toLowerCase() && 
        bus.route.to.toLowerCase() === to.toLowerCase()
      );
      return res.json(filteredBuses);
    }

    res.json(buses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single bus
// @route   GET /api/buses/:id
// @access  Public
export const getBusById = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id).populate('route');
    if (bus) {
      res.json(bus);
    } else {
      res.status(404).json({ message: 'Bus not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a bus
// @route   POST /api/buses
// @access  Private/Admin
export const createBus = async (req, res) => {
  try {
    const bus = new Bus(req.body);
    const createdBus = await bus.save();
    res.status(201).json(createdBus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a bus
// @route   DELETE /api/buses/:id
// @access  Private/Admin
export const deleteBus = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (bus) {
      await bus.deleteOne();
      res.json({ message: 'Bus removed' });
    } else {
      res.status(404).json({ message: 'Bus not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
