import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Projects from "./pages/Projects";
import Header from "./components/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import CreateApartmentListing from "./pages/IT22577160_Pages/CreateApartmentListing";
import UpdateApartmentListing_02 from "./pages/IT22577160_Pages/UpdateApartmentListing_02";
import DashMaintenance from "./components/IT22607232_Components/DashMaintenance";
import TaskAssign from "./pages/IT22607232_Pages/s1_TaskAssignCreation";
import RequestLeave_04 from "./pages/IT22603418_Pages/RequestLeave_04";
import OnlyPropertyAdminPrivateRoute_02 from "./components/IT22577160_Components/OnlyPropertyAdminPrivateRoute_02";
import CreateSharedResources_02 from "./pages/IT22577160_Pages/CreateSharedResources_02";
import UpdateSharedResources_02 from "./pages/IT22577160_Pages/UpdateSharedResources_02";
import Updatepaymentpage_03 from "./pages/IT22602978_Pages/Updatepaymentpage_03";
import SharedResourcesPage_02 from "./pages/IT22577160_Pages/SharedResourcesPage_02";
import ScrollToTop_02 from "./components/IT22577160_Components/ScrollToTop_02";
import MarketPlace from "./pages/IT22577160_Pages/MarketPlace";
import SearchResources_02 from "./pages/IT22577160_Pages/SearchResources_02";
import TasksTable_01 from "./components/IT22607232_Components/TasksTable_01";
import S1_UpdateTasks from "./pages/IT22607232_Pages/s1_UpdateTasks";
import ApartmentListingPage_02 from "./pages/IT22577160_Pages/ApartmentListingPage_02";
import SearchApartments_02 from "./pages/IT22577160_Pages/SearchApartments_02";
import CheckOutPage_02 from "./pages/IT22577160_Pages/CheckOutPage_02";
import AmenityCreate from "./pages/IT22003546_Pages/AmenityCreate_05";
import AddVisitors from "./pages/IT22561466_Pages/AddVisitors";
import GamePage_02 from "./pages/IT22577160_Pages/GamePage_02";
import AmenityList_05 from "./components/IT22003546_Components/AmenityList_05";
import RatingWorkGroup_01 from "./components/IT22607232_Components/RatingWorkGroup_01";
import AmenityUpdate_05 from "./pages/IT22003546_Pages/AmenityUpdate_05";
import RateReview_01 from "./pages/IT22607232_Pages/RateReview_01";
import Team from "./pages/Team";
import Contact from "./pages/Contact";
import BoxTile from "./components/IT22003546_Components/UserAmenityView";
import AmenityDetails from "./components/IT22003546_Components/AmenityDetailsEach_05";
import BookAmenity from "./pages/IT22003546_Pages/BookAmenity_05";
import ServiceListingCreate from "./pages/IT22350114_Pages/ServiceCreate_06";
import BookingList_05 from "./components/IT22003546_Components/BookingList_05";
import BookingUpdate_05 from "./pages/IT22003546_Pages/BookingUpdate_05";
import ResidentServiceView from "./components/IT22350114_Components/ServiceResidentView_06";
import DashServiceList_06 from "./components/IT22350114_Components/DashServiceList_06";
import FinalAdminPayments_03 from "./pages/IT22602978_Pages/FinalAdminPayments_03";
import BookServiceCreate from './pages/IT22350114_Pages/BookServiceCreate_06';
import SignInQR from "./pages/IT22602978_Pages/SignInQR_03";
import PayNowpage_03 from './pages/IT22602978_Pages/PayNowpage_03';

import DashServiceBookList_06 from './components/IT22350114_Components/DashServiceBookList_06';
import ServiceUpdate_06 from './pages/IT22350114_Pages/ServiceUpdate_06';
import UpdateVisitorListing from "./pages/IT22561466_Pages/UpdateVisitorListing";
import VisitorDetails from "./pages/IT22561466_Pages/VisitorDetails";
import UserCoversation_02 from "./components/IT22577160_Components/UserCoversation_02";
import TaskTracker_01 from './components/IT22607232_Components/TaskTracker_01'
import  WorkEstimation_01 from './pages/IT22607232_Pages/WorkEstimation_01'
import announcementList from './components/IT22196460_Components/announcementList';
import DeleteAnnouncementform from './components/IT22196460_Components/DeleteAnnouncementform';
import AnnouncementForAdmin from './components/IT22196460_Components/AnnouncementForAdmin';
import AnnouncementList from './pages/IT22196460_Pages/AnnouncementList';
import UpdateAnnouncementForm from './pages/IT22196460_Pages/UpdateAnnouncementForm';
import AnnouncementDetails from './pages/IT22196460_Pages/AnnouncementDetails';
import CreateAnnouncementForm from './pages/IT22196460_Pages/CreateAnnouncementForm';
import AnnouncementPage from './components/IT22196460_Components/AnnouncementPage';
import EstimationOne_01 from './pages/IT22607232_Pages/EstimationOne_01';
import WorkEstimate_01 from './pages/IT22607232_Pages/WorkEstimate_01';
import VisitorAdminPage from "./pages/IT22561466_Pages/VisitorAdminPage";
import searchVisitor from './pages/IT22561466_Pages/VisitorAdminPage'
import SearchVisitors from "./pages/IT22561466_Pages/SearchVisitors";
import RequestCarPark from "./pages/IT22561466_Pages/RequestCarPark";
import Parkingslot from "./pages/IT22561466_Pages/Parkingslot";
import ParkingslotOrder from "./pages/IT22561466_Pages/ParkingslotOrder";
import ServiceBookingUpdate_06 from "./pages/IT22350114_Pages/ServiceBookingUpdate_96";
import CarParkAdminPage from "./pages/IT22561466_Pages/CarParkAdminPage";
import { initCSRF } from "./api";


function App() {
    useEffect(() => {
    initCSRF(); // load CSRF token from backend
  }, []);
  return (
    <>
      <Router>
        <ScrollToTop_02 />
        <Header />

        <div className="min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-in-QR"element={<SignInQR/>}/>
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/search" element={<SearchVisitors />} />
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route
                path="/create-apartmentListing"
                element={<CreateApartmentListing />}
              />
              <Route
                path="/update-apartmentListing/:listingId"
                element={<UpdateApartmentListing_02 />}
              />
              <Route path="/" element={<DashMaintenance />} />
              <Route path="/task-assign" element={<TaskAssign />} />
              <Route path="/tasks-table:taskid" element={<TasksTable_01 />} />
              <Route
                path="/update-tasks/:taskid"
                element={<S1_UpdateTasks />}
              />
              <Route
                path="/service-User:serviceID"
                element={<ResidentServiceView />}
              />
              <Route
                path="/book-service/:serviceID"
                element={<BookServiceCreate />}
              />

              <Route path="/checkout" element={<CheckOutPage_02 />} />
              <Route path="/amenity-create" element={<AmenityCreate />} />
              <Route path="/add-visitors" element={<AddVisitors />} />
              <Route
                path="/booking-List:bookingID"
                element={<BookingList_05 />}
              />
              <Route
                path="/update-booking/:bookingID"
                element={<BookingUpdate_05 />}
              />

              <Route
                path="/book-amenity/:amenityId"
                element={<BookAmenity />}
              />
              <Route
                path="/each-amenity/:amenityId"
                element={<AmenityDetails />}
              />
              <Route path="/amenity-User:amenityID" element={<BoxTile />} />
              <Route
                path="/amenity-List:amenityID"
                element={<AmenityList_05 />}
              />
              <Route
                path="/star-ratingWorkers"
                element={<RatingWorkGroup_01 />}
              />
              <Route
                path="edit-amenity/:amenityID"
                element={<AmenityUpdate_05 />}
              />
              <Route path="/rate-tasks/:taskid" element={<RateReview_01 />} />

              <Route
                path="/service-create"
                element={<ServiceListingCreate />}
              />
              <Route
                path="service-list:serviceID"
                element={<DashServiceList_06 />}
              />
              <Route
                path="/service-User:serviceID"
                element={<ResidentServiceView />}
              />
              
              <Route
                path="/pay-now/:HouseIdQR/:PaymentIdQR"
                element={<PayNowpage_03/>}
                />

              
              
              <Route path="/service-booking-List:bookingID" element={<DashServiceBookList_06 />}/>
            
              <Route path="/service-update/:serviceID" element={<ServiceUpdate_06 />} />
              <Route path="/update-sbooking/:bookingID" element={<ServiceBookingUpdate_06 />} />
              <Route
                path="/visitorListing/:visitorListingId"
                element={<VisitorDetails />}
              />
              <Route
                path="/update-list/:visitorListingId"
                element={<UpdateVisitorListing />}
              />
              <Route path="/conversation/:conversationId" element={<UserCoversation_02 />}/>
                 <Route path="/car-park" element={<RequestCarPark />} />
            </Route>
            <Route element={<OnlyPropertyAdminPrivateRoute_02 />}>
              <Route
                path="/create-sharedResourceListing"
                element={<CreateSharedResources_02 />}
              />
              <Route
                path="/update-sharedResourceListing/:resourceId"
                element={<UpdateSharedResources_02 />}
              />
            </Route>
            <Route path="/projects" element={<Projects />} />
            <Route path="/create_04" element={<RequestLeave_04 />} />
            <Route
              path="/sharedResource/:resourceSlug"
              element={<SharedResourcesPage_02 />}
            />
            <Route path="/marketPlace" element={<MarketPlace />} />
            <Route path="/searchResource" element={<SearchResources_02 />} />
            <Route
              path="/apartmentListing/:listingId"
              element={<ApartmentListingPage_02 />}
            />
            <Route path="/searchApartments" element={<SearchApartments_02 />} />
            <Route path="/success" element={<CheckOutPage_02 />} />
            <Route path="/games" element={<GamePage_02 />} />
            <Route path="/team" element={<Team />} />
            <Route path="/contact" element={<Contact />} />
            {/* <Route path='/create_04' element={<RequestLeave_04/>}/>
              <Route path='/delete_04' element={<RequestDetails_04/>}/> */}
            <Route path="/AdminFinal" element={<FinalAdminPayments_03 />} />
            <Route
              path="/update-paymentprofile/:data"
              element={<Updatepaymentpage_03 />}
            />
                 <Route path="/task-tracker" element={<TaskTracker_01/>} />
                <Route path="/task-estimate" element={<WorkEstimation_01/>} />
              <Route exact path="/create-announcement" element={<CreateAnnouncementForm/>}/>
              <Route path="/" element={<AnnouncementList/>}/>
              <Route path="/announcement/:id" element={<AnnouncementDetails/>}/>
              <Route path="/delete-announcement/:id" element={<DeleteAnnouncementform/>}/>
              <Route exact path="/announcements" element={<AnnouncementForAdmin/>}/>
              <Route path="/announcements" element={<AnnouncementPage/>}/>
              <Route exact path="/update-announcement/:id" element={<UpdateAnnouncementForm/>}/>
              <Route path="/estimation" element={<EstimationOne_01/>} />
              <Route path="/get-estimation/:taskid" element={<WorkEstimate_01/>} />

            <Route path="/admin-page" element={<VisitorAdminPage />} />
            <Route path="/searchVisitor" element={<VisitorAdminPage />} />
            <Route path="/park-slot/:slotID" element={<Parkingslot />} />
            <Route path="/park-slot-order/:carparkListingId" element={<ParkingslotOrder />} />
            <Route path="/carpark-admin-page" element={<CarParkAdminPage/>}/>
            
          </Routes>
        </div>

        <Footer />
      </Router>

      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

export default App;
