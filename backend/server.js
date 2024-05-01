import express from "express";
import dotenv from "dotenv";
import dbConnection from "./dbConfig/dbConnection.js";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import apartmentListingRoutes from "./routes/IT22577160_Routes/apartmentListing.route_02.js";
import PaymentProfileCreationRoutes from "./routes/IT22602978_Routes/PaymentProfileCreation.route_03.js";
import TaskAssignRoute from "./routes/IT22607232_Routes/s1_TaskAssignRoute.js";
import RequestLeaveRoutes from "./routes/IT22603418_Routes/RequestLeave.route_04.js";
import visitorListingRoutes from "./routes/IT22561466_Routes/visitorListing.route.js";
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
import TaskAnalysisRoute from './routes/IT22607232_Routes/TaskAnalysisRoute_01.js';
import taskcategoriesRoutes from './routes/IT22607232_Routes/taskcategoriesRoute_01.js';
import tasklabelsRoutes from './routes/IT22607232_Routes/taskLabels_01.js';
import AdminPaymentHandlingRoutes from "./routes/IT22602978_Routes/AdminPaymentHandling.route_03.js";
import serviceBookingRoutes from "./routes/IT22350114_Routes/serviceBookingRoutes.js";
import StaffAdminRoutes from "./routes/IT22603418_Routes/StaffAdmin.route_04.js";
import StaffAttendanceRoutes from "./routes/IT22603418_Routes/StaffAttendance.route_04.js";
import conversationRoutes from "./routes/IT22577160_Routes/conversation.route_02.js";
import messageRoutes from "./routes/IT22577160_Routes/messages.route_02.js";
import cors from "cors";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
// Use the cors middleware
app.use(cors());

dbConnection();

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

// IT22602978 Routes
app.use("/api/PaymentProfileCreation", PaymentProfileCreationRoutes);
app.use("/api/AdminPaymentHandling", AdminPaymentHandlingRoutes);
// IT22603418 Routes
app.use("/api/RequestLeave", RequestLeaveRoutes);
app.use("/api/StaffAdmin", StaffAdminRoutes);
app.use("/api/StaffAttendance", StaffAttendanceRoutes);

// IT22350114 Routes
app.use("/api/serviceListing", serviceListingRoutes);
app.use("/api/serviceBooking", serviceBookingRoutes);

//IT22607232 Routes
app.use("/api/taskAssign", TaskAssignRoute);
app.use("/api/taskRating", RateTasksRoutes);
app.use("/api/taskAnalysis", TaskAnalysisRoute);
app.use("/api/categeories",taskcategoriesRoutes);
app.use("/api/labels",tasklabelsRoutes);

// IT22577160 Routes
app.use("/api/apartmentListing", apartmentListingRoutes);
app.use("/api/sharedResourcesListing", sharedResourcesListingRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/conversation", conversationRoutes);
app.use("/api/messages", messageRoutes);

// IT22003546 Routes
app.use("/api/amenitiesListing", amenitiesListingRoutes);

// IT22196460 Routes
app.use('/api/announcements', AnnouncementsRoutes);
app.use('/api/Notification', NotificationRoutes);



app.use("/api/amenitiesBooking", amenitiesBookingRoutes);
//IT22561466 Routes
app.use("/api/visitorListing", visitorListingRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
