import express from "express";
import dotenv from "dotenv";
import dbConnection from "./dbConfig/dbConnection.js";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import apartmentListingRoutes from "./routes/IT22577160_Routes/apartmentListing.route_02.js";
import PaymentProfileCreationRoutes from "./routes/IT22602978_Routes/PaymentProfileCreation.route_03.js";
import TaskAssignRoute from "./routes/IT22607232_Routes/s1_TaskAssignRoute.js";
import visitorListingRoutes from './routes/IT22561466_Routes/visitorListing.route.js';
import RequestLeaveRoutes from "./routes/IT22603418_Routes/RequestLeave.route_04.js";
import StaffAdminRoutes from "./routes/IT22603418_Routes/StaffAdmin.route_04.js";
import StaffAttendanceRoutes from "./routes/IT22603418_Routes/StaffAttendance.route_04.js";
import cookieParser from "cookie-parser";
import serviceListingRoutes from "./routes/IT22350114_Routes/serviceListingRoute.js";
import amenitiesListingRoutes from './routes/IT22003546_Routes/amenitiesListing.route.js';
import AnnouncementsRoutes from './routes/IT22196460_Routes/AnnouncementsRoutes.js';
import sharedResourcesListingRoutes from './routes/IT22577160_Routes/sharedResourcesListing.route_02.js';
import commentRoutes from './routes/IT22577160_Routes/comment.route_02.js';
import checkoutRoutes from './routes/IT22577160_Routes/checkout.route_02.js';
import RateTasksRoutes from './routes/IT22607232_Routes/RateTasksRoute_01.js';
import amenitiesBookingRoutes from './routes/IT22003546_Routes/amenitiesBooking.route_05.js';
import NotificationRoutes from './routes/IT22196460_Routes/notificationRoutes.js';
import AnnounceRoutes from './routes/IT22196460_Routes/AnnounceRoutes.js';
dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());


dbConnection();

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

// IT22602978 Routes
app.use("/api/PaymentProfileCreation", PaymentProfileCreationRoutes);

// IT22603418 Routes
app.use("/api/RequestLeave", RequestLeaveRoutes);
app.use("/api/StaffAdmin", StaffAdminRoutes);
app.use("/api/StaffAttendance", StaffAttendanceRoutes);

// IT22350114 Routes
app.use("/api/serviceListing", serviceListingRoutes);

//IT22607232 Routes
app.use("/api/taskAssign", TaskAssignRoute);
app.use("/api/taskRating", RateTasksRoutes);

// IT22577160 Routes
app.use('/api/apartmentListing', apartmentListingRoutes);
app.use('/api/sharedResourcesListing', sharedResourcesListingRoutes);
app.use('/api/comment', commentRoutes);
app.use('/api/checkout', checkoutRoutes);

// IT22003546 Routes
app.use('/api/amenitiesListing', amenitiesListingRoutes);

// IT22196460 Routes
app.use('/api/announcements', AnnouncementsRoutes);
app.use('/api/Notification', NotificationRoutes);
app.use('/api/Announcements', AnnounceRoutes);



app.use('/api/amenitiesBooking', amenitiesBookingRoutes);
//IT22561466 Routes
app.use('/api/visitorListing', visitorListingRoutes);





app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
