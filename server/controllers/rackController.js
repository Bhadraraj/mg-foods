const asyncHandler = require("express-async-handler");
const Rack = require("../models/rackModel");
const Item = require("../models/itemModel");

// @desc    Get all racks
// @route   GET /api/racks
// @access  Private
const getRacks = asyncHandler(async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            location,
            rackType,
            category,
            isActive,
            search,
        } = req.query;

        // Build query object - remove store filter if causing issues
        const query = {};
        
        // Add store filter only if user has store property
        if (req.user && req.user.store) {
            query.store = req.user.store;
        }

        // Add other filters
        if (location) query.location = new RegExp(location, "i");
        if (rackType) query.rackType = rackType;
        if (category) query.category = category;
        if (isActive !== undefined) query.isActive = isActive === "true";

        // Add search functionality
        if (search) {
            query.$or = [
                { name: new RegExp(search, "i") },
                { code: new RegExp(search, "i") },
                { location: new RegExp(search, "i") },
            ];
        }

        console.log("Query:", JSON.stringify(query, null, 2)); // Debug log

        const racks = await Rack.find(query)
            .populate("createdBy", "name email")
            .populate("updatedBy", "name email")
            .populate("items.item", "name category")
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean(); // Add lean() for better performance

        const total = await Rack.countDocuments(query);

        res.status(200).json({
            success: true,
            count: racks.length,
            total,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            data: racks,
        });
    } catch (error) {
        console.error("Error in getRacks:", error); // Debug log
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch racks",
        });
    }
});

// @desc    Get single rack
// @route   GET /api/racks/:id
// @access  Private
const getRack = asyncHandler(async (req, res) => {
    try {
        // Validate ObjectId format
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: "Invalid rack ID format",
            });
        }

        // Build query - remove store filter if causing issues
        const query = { _id: req.params.id };
        
        // Add store filter only if user has store property
        if (req.user && req.user.store) {
            query.store = req.user.store;
        }

        console.log("Getting rack with query:", JSON.stringify(query, null, 2)); // Debug log

        const rack = await Rack.findOne(query)
            .populate("createdBy", "name email")
            .populate("updatedBy", "name email")
            .populate("items.item", "name category subCategory brand")
            .populate("zones.items.item", "name category");

        if (!rack) {
            return res.status(404).json({
                success: false,
                message: "Rack not found",
            });
        }

        // Get alerts for this rack
        const alerts = rack.checkAlerts();

        res.status(200).json({
            success: true,
            data: {
                ...rack.toJSON(),
                alerts,
            },
        });
    } catch (error) {
        console.error("Error in getRack:", error); // Debug log
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch rack",
        });
    }
});

// @desc    Create new rack
// @route   POST /api/racks
// @access  Private
const createRack = asyncHandler(async (req, res) => {
    try {
        const rackData = {
            ...req.body,
            store: req.body.store || req.user?.store || 'MG Food Court',
            createdBy: req.user._id,
        };

        console.log("Creating rack with data:", JSON.stringify(rackData, null, 2)); // Debug log

        const rack = await Rack.create(rackData);
        await rack.populate("createdBy", "name email");

        res.status(201).json({
            success: true,
            message: "Rack created successfully",
            data: rack,
        });
    } catch (error) {
        console.error("Error in createRack:", error); // Debug log
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Rack code already exists for this store",
            });
        }
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});

// @desc    Update rack
// @route   PUT /api/racks/:id
// @access  Private
const updateRack = asyncHandler(async (req, res) => {
    try {
        // Validate ObjectId format
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: "Invalid rack ID format",
            });
        }

        const query = { _id: req.params.id };
        if (req.user && req.user.store) {
            query.store = req.user.store;
        }

        const rack = await Rack.findOne(query);

        if (!rack) {
            return res.status(404).json({
                success: false,
                message: "Rack not found",
            });
        }

        const updatedRack = await Rack.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedBy: req.user._id },
            { new: true, runValidators: true }
        )
            .populate("createdBy", "name email")
            .populate("updatedBy", "name email")
            .populate("items.item", "name category");

        res.status(200).json({
            success: true,
            message: "Rack updated successfully",
            data: updatedRack,
        });
    } catch (error) {
        console.error("Error in updateRack:", error); // Debug log
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});

// @desc    Delete rack
// @route   DELETE /api/racks/:id
// @access  Private
const deleteRack = asyncHandler(async (req, res) => {
    try {
        // Validate ObjectId format
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: "Invalid rack ID format",
            });
        }

        const query = { _id: req.params.id };
        if (req.user && req.user.store) {
            query.store = req.user.store;
        }

        const rack = await Rack.findOne(query);

        if (!rack) {
            return res.status(404).json({
                success: false,
                message: "Rack not found",
            });
        }

        // Check if rack has items
        if (rack.items.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Cannot delete rack with items. Please move items first.",
            });
        }

        await Rack.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Rack deleted successfully",
        });
    } catch (error) {
        console.error("Error in deleteRack:", error); // Debug log
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});

// @desc    Add item to rack
// @route   POST /api/racks/:id/items
// @access  Private
const addItemToRack = asyncHandler(async (req, res) => {
    try {
        const { itemId, itemName, quantity, purchaseId, zoneId } = req.body;

        // Validate required fields
        if (!itemId || !itemName || !quantity) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: itemId, itemName, and quantity",
            });
        }

        // Validate ObjectId format
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: "Invalid rack ID format",
            });
        }

        const query = { _id: req.params.id };
        if (req.user && req.user.store) {
            query.store = req.user.store;
        }

        const rack = await Rack.findOne(query);

        if (!rack) {
            return res.status(404).json({
                success: false,
                message: "Rack not found",
            });
        }

        // Check if rack can accommodate the quantity
        if (!rack.canAccommodate(quantity)) {
            return res.status(400).json({
                success: false,
                message: "Insufficient space in rack",
                availableSpace: rack.availableSpace,
                requestedQuantity: quantity,
            });
        }

        // Validate item exists
        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not found",
            });
        }

        // Add item to rack
        rack.addItem({
            item: itemId,
            itemName: itemName,
            quantity,
            purchaseId,
        });

        rack.updatedBy = req.user._id;
        await rack.save();

        // Populate the updated rack
        await rack.populate("items.item", "name category");

        res.status(200).json({
            success: true,
            message: "Item added to rack successfully",
            data: rack,
        });
    } catch (error) {
        console.error("Error in addItemToRack:", error); // Debug log
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});

// @desc    Remove item from rack
// @route   DELETE /api/racks/:id/items/:itemId
// @access  Private
const removeItemFromRack = asyncHandler(async (req, res) => {
    try {
        const { quantity } = req.body;

        // Validate ObjectId format
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: "Invalid rack ID format",
            });
        }

        const query = { _id: req.params.id };
        if (req.user && req.user.store) {
            query.store = req.user.store;
        }

        const rack = await Rack.findOne(query);

        if (!rack) {
            return res.status(404).json({
                success: false,
                message: "Rack not found",
            });
        }

        const success = rack.removeItem(req.params.itemId, quantity);

        if (!success) {
            return res.status(400).json({
                success: false,
                message: "Insufficient quantity or item not found in rack",
            });
        }

        rack.updatedBy = req.user._id;
        await rack.save();

        await rack.populate("items.item", "name category");

        res.status(200).json({
            success: true,
            message: "Item removed from rack successfully",
            data: rack,
        });
    } catch (error) {
        console.error("Error in removeItemFromRack:", error); // Debug log
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});

// @desc    Get available racks for item
// @route   GET /api/racks/available
// @access  Private
const getAvailableRacks = asyncHandler(async (req, res) => {
    try {
        const { requiredSpace = 1, rackType, category } = req.query;

        // First get available racks using the static method
        let racksQuery = Rack.findAvailableRacks(
            parseInt(requiredSpace),
            rackType,
            category
        );

        // Add store filter if user has store
        if (req.user && req.user.store) {
            racksQuery = racksQuery.find({ store: req.user.store });
        }

        const racks = await racksQuery
            .populate("createdBy", "name email")
            .sort({ availableSpace: -1 })
            .lean();

        res.status(200).json({
            success: true,
            count: racks.length,
            data: racks,
        });
    } catch (error) {
        console.error("Error in getAvailableRacks:", error); // Debug log
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});

// @desc    Get racks by item
// @route   GET /api/racks/by-item/:itemId
// @access  Private
const getRacksByItem = asyncHandler(async (req, res) => {
    try {
        // Validate ObjectId format
        if (!req.params.itemId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: "Invalid item ID format",
            });
        }

        let racksQuery = Rack.findByItem(req.params.itemId);

        // Add store filter if user has store
        if (req.user && req.user.store) {
            racksQuery = racksQuery.find({ store: req.user.store });
        }

        const racks = await racksQuery
            .populate("createdBy", "name email")
            .populate("items.item", "name category")
            .lean();

        res.status(200).json({
            success: true,
            count: racks.length,
            data: racks,
        });
    } catch (error) {
        console.error("Error in getRacksByItem:", error); // Debug log
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});

// @desc    Reserve space on a rack
// @route   POST /api/racks/:id/reserve
// @access  Private
const reserveRackSpace = asyncHandler(async (req, res) => {
    try {
        const { quantity } = req.body;

        if (!quantity || quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: "Valid quantity is required",
            });
        }

        const query = { _id: req.params.id };
        if (req.user && req.user.store) {
            query.store = req.user.store;
        }

        const rack = await Rack.findOne(query);
        
        if (!rack) {
            return res.status(404).json({ 
                success: false, 
                message: "Rack not found" 
            });
        }
        
        if (rack.reserveSpace(quantity)) {
            rack.updatedBy = req.user._id;
            await rack.save();
            res.status(200).json({ 
                success: true, 
                message: "Space reserved successfully", 
                data: rack 
            });
        } else {
            res.status(400).json({ 
                success: false, 
                message: "Insufficient space to reserve",
                availableSpace: rack.availableSpace,
                requestedQuantity: quantity
            });
        }
    } catch (error) {
        console.error("Error in reserveRackSpace:", error); // Debug log
        res.status(400).json({ 
            success: false, 
            message: error.message 
        });
    }
});

// @desc    Release reserved space on a rack
// @route   DELETE /api/racks/:id/reserve
// @access  Private
const releaseRackSpace = asyncHandler(async (req, res) => {
    try {
        const { quantity } = req.body;

        if (!quantity || quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: "Valid quantity is required",
            });
        }

        const query = { _id: req.params.id };
        if (req.user && req.user.store) {
            query.store = req.user.store;
        }

        const rack = await Rack.findOne(query);
        
        if (!rack) {
            return res.status(404).json({ 
                success: false, 
                message: "Rack not found" 
            });
        }
        
        rack.releaseReservedSpace(quantity);
        rack.updatedBy = req.user._id;
        await rack.save();
        
        res.status(200).json({ 
            success: true, 
            message: "Reserved space released successfully", 
            data: rack 
        });
    } catch (error) {
        console.error("Error in releaseRackSpace:", error); // Debug log
        res.status(400).json({ 
            success: false, 
            message: error.message 
        });
    }
});

// @desc    Get rack alerts
// @route   GET /api/racks/:id/alerts
// @access  Private
const getRackAlerts = asyncHandler(async (req, res) => {
    try {
        const query = { _id: req.params.id };
        if (req.user && req.user.store) {
            query.store = req.user.store;
        }

        const rack = await Rack.findOne(query);

        if (!rack) {
            return res.status(404).json({
                success: false,
                message: "Rack not found",
            });
        }

        const alerts = rack.checkAlerts();

        res.status(200).json({
            success: true,
            data: {
                rackId: rack._id,
                rackCode: rack.code,
                alerts,
            },
        });
    } catch (error) {
        console.error("Error in getRackAlerts:", error); // Debug log
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});

// @desc    Get all rack alerts for store
// @route   GET /api/racks/alerts/all
// @access  Private
const getAllRackAlerts = asyncHandler(async (req, res) => {
    try {
        const query = { isActive: true };
        if (req.user && req.user.store) {
            query.store = req.user.store;
        }

        const racks = await Rack.find(query).lean();

        const allAlerts = [];

        racks.forEach((rack) => {
            // Create a temporary rack instance to use the checkAlerts method
            const tempRack = new Rack(rack);
            const alerts = tempRack.checkAlerts();
            
            if (alerts.length > 0) {
                allAlerts.push({
                    rackId: rack._id,
                    rackCode: rack.code,
                    rackName: rack.name,
                    alerts,
                });
            }
        });

        res.status(200).json({
            success: true,
            count: allAlerts.length,
            data: allAlerts,
        });
    } catch (error) {
        console.error("Error in getAllRackAlerts:", error); // Debug log
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});

// @desc    Update rack temperature
// @route   PUT /api/racks/:id/temperature
// @access  Private
const updateRackTemperature = asyncHandler(async (req, res) => {
    try {
        const { temperature } = req.body;

        if (temperature === undefined || temperature === null) {
            return res.status(400).json({
                success: false,
                message: "Temperature value is required",
            });
        }

        const query = { _id: req.params.id };
        if (req.user && req.user.store) {
            query.store = req.user.store;
        }

        const rack = await Rack.findOne(query);

        if (!rack) {
            return res.status(404).json({
                success: false,
                message: "Rack not found",
            });
        }

        if (!rack.temperatureControl.hasTemperatureControl) {
            return res.status(400).json({
                success: false,
                message: "Rack does not have temperature control",
            });
        }

        rack.temperatureControl.currentTemperature = temperature;
        rack.updatedBy = req.user._id;
        await rack.save();

        // Check for temperature alerts
        const alerts = rack.checkAlerts();

        res.status(200).json({
            success: true,
            message: "Temperature updated successfully",
            data: {
                rack,
                alerts: alerts.filter((alert) => alert.type === "temperature"),
            },
        });
    } catch (error) {
        console.error("Error in updateRackTemperature:", error); // Debug log
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});

module.exports = {
    getRacks,
    getRack,
    createRack,
    updateRack,
    deleteRack,
    addItemToRack,
    removeItemFromRack,
    getAvailableRacks,
    getRacksByItem,
    reserveRackSpace,
    releaseRackSpace,
    getRackAlerts,
    getAllRackAlerts,
    updateRackTemperature,
};