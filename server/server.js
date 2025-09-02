const express = require("express");

const mongoose = require("mongoose");



// Clear all cached models - FIXED VERSION
if (mongoose.models) {
  Object.keys(mongoose.models).forEach(key => {
    delete mongoose.models[key];
  });
}

// Clear connection models if they exist
if (mongoose.connection && mongoose.connection.models) {
  Object.keys(mongoose.connection.models).forEach(key => {
    delete mongoose.connection.models[key];
  });
}


const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp"); // <--- ADDED: Import hpp for HTTP Parameter Pollution protection
const cookieParser = require("cookie-parser"); // <--- ADDED: Import cookie-parser
require("dotenv").config();
const path = require('path'); 
const authRoutes = require("./routes/auth"); // <--- CORRECTED: Path to auth.js
const userRoutes = require("./routes/users"); // <--- CORRECTED: Path to users.js
const partyRoutes = require("./routes/party"); // <--- CORRECTED: Path to party.js
const expenseRoutes = require("./routes/expense"); // Assuming these exist
const offerRoutes = require("./routes/offers"); // Assuming these exist
const roleRoutes = require("./routes/roleRoutes"); // This was explicitly named by me, so likely correct
const labourRoutes = require("./routes/labourRoutes"); // This was explicitly named by me, so likely correct
const customerRoutes = require("./routes/customerRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const referrerRoutes = require("./routes/referrerRoutes");
const labourAttendanceRoutes = require("./routes/labourAttendanceRoutes");
const itemRoutes = require("./routes/itemRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const brandRoutes = require('./routes/brandRoutes');
const subCategoryRoutes = require('./routes/subCategoryRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const rackRoutes = require('./routes/rackRoutes');
const ledgerRoutes = require('./routes/ledger');
const couponRoutes = require('./routes/couponRoutes');
const referrerPointRoutes = require('./routes/refferPoints');
const tableRoutes = require('./routes/tableRoutes');
const tokenRoutes = require('./routes/tokenRoutes');
const kotRoutes = require('./routes/kotRoutes');

// Clear Node.js module cache for Purchase model
const purchaseModelPath = require.resolve('./models/purchaseModel');
if (require.cache[purchaseModelPath]) {
    delete require.cache[purchaseModelPath];
    console.log('✓ Cleared Node.js cache for Purchase model');
}
const app = express();

// Security middleware
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
app.use(cookieParser()); // <--- ADDED: Use cookie-parser

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"), // 15 minutes in ms
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100"), // Max 100 requests per window
  message: {
    success: false, // <--- UPDATED: Consistent with your API response structure
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use("/api/", limiter); // Apply to all API routes

// CORS configuration
// const corsOptions = {
//   origin: process.env.CORS_ORIGINS
//     ? process.env.CORS_ORIGINS.split(",")
//     : ["'http://localhost:5174"],
//   credentials: true, // Allow cookies to be sent with requests
//   optionsSuccessStatus: 200,
// };

const corsOptions = {
  origin: true, // Allow any origin
  credentials: true, // Allow cookies to be sent with requests
  optionsSuccessStatus: 200,
};


app.use(cors(corsOptions));

// Body parsing middleware
app.use(compression());
app.use(express.json({ limit: "10mb" })); // Parses incoming JSON requests
app.use(express.urlencoded({ extended: true, limit: "10mb" })); // Parses incoming URL-encoded requests

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Restaurant POS API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});



// app.get('/api/test-purchase-model', (req, res) => {
//     try {
//         console.log('=== TESTING PURCHASE MODEL LOADING ===');
        
//         // Clear require cache first
//         const modelPath = require.resolve('./models/purchaseModel');
//         delete require.cache[modelPath];
//         console.log('✓ Cleared require cache for purchaseModel');
        
//         // Now require the model
//         const Purchase = require('./models/purchaseModel');
        
//         console.log('✓ Model loaded successfully');
        
//         res.json({
//             success: true,
//             message: 'Purchase model loaded successfully',
//             modelInfo: {
//                 // Basic info
//                 modelName: Purchase.modelName,
//                 collectionName: Purchase.collection.name,
                
//                 // Schema validation info
//                 purchaseId: {
//                     required: Purchase.schema.paths.purchaseId?.isRequired || false,
//                     type: Purchase.schema.paths.purchaseId?.instance
//                 },
                
//                 // Enum values that were causing errors
//                 enumValues: {
//                     taxType: Purchase.schema.paths.taxType?.enumValues || [],
//                     purchaseType: Purchase.schema.paths.purchaseType?.enumValues || [],
//                     paymentStatus: Purchase.schema.paths.paymentStatus?.enumValues || [],
//                     status: Purchase.schema.paths.status?.enumValues || [],
//                     billingType: Purchase.schema.paths.billingType?.enumValues || []
//                 },
                
//                 // Item schema enum values
//                 itemEnumValues: {
//                     taxType: Purchase.schema.paths['items.taxType']?.enumValues || 
//                              Purchase.schema.obj.items?.[0]?.taxType?.enum || []
//                 },
                
//                 // All schema paths
//                 allPaths: Object.keys(Purchase.schema.paths),
                
//                 // Validation info
//                 requiredPaths: Object.keys(Purchase.schema.paths).filter(path => 
//                     Purchase.schema.paths[path].isRequired
//                 )
//             }
//         });
        
//     } catch (error) {
//         console.error('Model loading error:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Error loading Purchase model',
//             error: error.message,
//             stack: error.stack
//         });
//     }
// });


// API Routes

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/parties", partyRoutes); // <--- CORRECTED: Mounted as '/api/parties' (plural for consistency)
app.use("/api/expense", expenseRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/roles", roleRoutes); // <--- NEW: Mount role routes
app.use("/api/labour", labourRoutes); // <--- NEW: Mount labour routes
app.use("/api/customers", customerRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/referrers", referrerRoutes);
app.use("/api/labour-attendance", labourAttendanceRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/categories", categoryRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/subcategories', subCategoryRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/racks', rackRoutes);
app.use('/api/ledgers', ledgerRoutes);  
app.use('/api/coupons', couponRoutes);  
app.use('/api/referrer-points', referrerPointRoutes);  
app.use('/api/tables', tableRoutes);  
app.use('/api/tokens', tokenRoutes);  
app.use('/api/kots', kotRoutes);  
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack for debugging
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Server Error",
    error: process.env.NODE_ENV === "development" ? err.stack : undefined, // Provide stack in dev
  });
});

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || process.env.MONGO_URI
    ); // <--- UPDATED: Use MONGODB_URI or MONGO_URI
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1); // Exit process with failure
  }
};

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB(); // Connect to DB before starting server

  app.listen(PORT, () => {
    console.log(
      `🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`
    );
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
  });
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.error("Unhandled Promise Rejection:", err.message);
  process.exit(1); // Exit process with failure
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err.message);
  process.exit(1); // Exit process with failure
});

startServer(); // Call the function to start the server

// module.exports = app; // This line is typically not needed if you're directly starting the server
