import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import dbConnection from "./dbConfig/dbConnection.js";

// logging
import { httpLogger, contextMiddleware } from "./utils/logHandler/httpLogger.js";
import errorHandler from "./utils/logHandler/errorHandler.js";
import { getLogger } from "./utils/logHandler/contextLogger.js";

// routes ...
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import apartmentListingRoutes from "./routes/IT22577160_Routes/apartmentListing.route_02.js";
import PaymentProfileCreationRoutes from "./routes/IT22602978_Routes/PaymentProfileCreation.route_03.js";
import TaskAssignRoute from "./routes/IT22607232_Routes/s1_TaskAssignRoute.js";
import RequestLeaveRoutes from "./routes/IT22603418_Routes/RequestLeave.route_04.js";
import visitorListingRoutes from "./routes/IT22561466_Routes/visitorListing.route.js";
import serviceListingRoutes from "./routes/IT22350114_Routes/serviceListingRoute.js";
import amenitiesListingRoutes from './routes/IT22003546_Routes/amenitiesListing.route.js';
import sharedResourcesListingRoutes from './routes/IT22577160_Routes/sharedResourcesListing.route_02.js';
import commentRoutes from './routes/IT22577160_Routes/comment.route_02.js';
import checkoutRoutes from './routes/IT22577160_Routes/checkout.route_02.js';
import RateTasksRoutes from './routes/IT22607232_Routes/RateTasksRoute_01.js';
import amenitiesBookingRoutes from './routes/IT22003546_Routes/amenitiesBooking.route_05.js';
import TaskAnalysisRoute from './routes/IT22607232_Routes/TaskAnalysisRoute_01.js';
import taskcategoriesRoutes from './routes/IT22607232_Routes/taskcategoriesRoute_01.js';
import tasklabelsRoutes from './routes/IT22607232_Routes/taskLabels_01.js';
import AdminPaymentHandlingRoutes from "./routes/IT22602978_Routes/AdminPaymentHandling.route_03.js";
import serviceBookingRoutes from "./routes/IT22350114_Routes/serviceBookingRoutes.js";
import StaffAdminRoutes from "./routes/IT22603418_Routes/StaffAdmin.route_04.js";
import StaffAttendanceRoutes from "./routes/IT22603418_Routes/StaffAttendance.route_04.js";
import conversationRoutes from "./routes/IT22577160_Routes/conversation.route_02.js";
import messageRoutes from "./routes/IT22577160_Routes/messages.route_02.js";
import AnnouncementsRoutes from "./routes/IT22196460_Routes/AnnouncementsRoutes.js";
import EstimationRoutes_01 from './routes/IT22607232_Routes/EstimationRoutes_01.js';
import carparkListingRoutes from './routes/IT22561466_Routes/carparkListing.route.js';
import StaffRegisterRoutes from "./routes/IT22603418_Routes/StaffRegister.route_04.js";

dotenv.config();

const app = express();

// if behind proxy/load balancer, trust it so secure cookies work
app.set('trust proxy', 1);

// parsers first
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

// CORS: restrict origins and enable credentials for cookie-based auth
const parseOrigins = (val) =>
  (val || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

const defaultOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000'
];

const allowedOrigins = parseOrigins(process.env.CORS_ORIGINS) || [];
const origins = allowedOrigins.length ? allowedOrigins : defaultOrigins;

app.use(
  cors({
    origin(origin, callback) {
      // allow same-origin or non-browser clients (no origin)
      if (!origin) return callback(null, true);
      const ok = origins.includes(origin);
      return callback(ok ? null : new Error('Not allowed by CORS'), ok);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  })
);

// http logging + per-request context
app.use(httpLogger);
app.use(contextMiddleware);

// DB
dbConnection();

// health (kept simple and quiet)
app.get('/health', (req, res) => res.status(200).send('ok'));

// routes
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

// IT22602978 Routes
app.use("/api/PaymentProfileCreation", PaymentProfileCreationRoutes);
app.use("/api/AdminPaymentHandling", AdminPaymentHandlingRoutes);
// IT22603418 Routes
app.use("/api/RequestLeave", RequestLeaveRoutes);
app.use("/api/StaffAdmin", StaffAdminRoutes);
app.use("/api/StaffAttendance", StaffAttendanceRoutes);
app.use("/api/StaffRegister", StaffRegisterRoutes);

// IT22350114 Routes
app.use("/api/serviceListing", serviceListingRoutes);
app.use("/api/serviceBooking", serviceBookingRoutes);

//IT22607232 Routes
app.use("/api/taskAssign", TaskAssignRoute);
app.use("/api/taskRating", RateTasksRoutes);
app.use("/api/taskAnalysis", TaskAnalysisRoute);
app.use("/api/categeories", taskcategoriesRoutes);
app.use("/api/labels", tasklabelsRoutes);
app.use("/api/workEstimation", EstimationRoutes_01);

// IT22577160 Routes
app.use("/api/apartmentListing", apartmentListingRoutes);
app.use("/api/sharedResourcesListing", sharedResourcesListingRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/conversation", conversationRoutes);
app.use("/api/messages", messageRoutes);

// IT22003546 Routes
app.use("/api/amenitiesListing", amenitiesListingRoutes);
app.use("/api/amenitiesBooking", amenitiesBookingRoutes);

//IT22561466 Routes
app.use('/api/visitorListing', visitorListingRoutes);
app.use('/api/carparkListing', carparkListingRoutes);

// IT22196460 Routes
app.use('/api/announcements', AnnouncementsRoutes);

// central error handler LAST
app.use(errorHandler);

// start
const port = process.env.PORT || 3000;
app.listen(port, () => {
  const log = getLogger();
  log.info({ port }, 'server started');
});
