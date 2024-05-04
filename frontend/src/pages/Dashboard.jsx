import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashUsers from "../components/DashUsers";
import DashSharedResourcesList_02 from "../components/IT22577160_Components/DashSharedResourcesList_02";
import DashStaff_04 from "../components/IT22603418_Components/DashStaff_04";
import DashServices from "../components/IT22350114_Components/DashServices";
import DashApartmentList_02 from "../components/IT22577160_Components/DashApartmentList_02";
import DashPayments_03 from './../components/IT22602978_Components/DashPayments_03';
import DashUserPayments_03 from './../components/IT22602978_Components/DashUserPayments_03';
import AddPaymentProfile_03 from './IT22602978_Pages/AddPaymentProfile_03';
import DashMaintenance from "../components/IT22607232_Components/DashMaintenance"

import DashComments_02 from "../components/IT22577160_Components/DashComments_02";
import BookingList_05 from "../components/IT22003546_Components/BookingList_05";
import AdminPayments_03 from "./IT22602978_Pages/AdminPayments_03";
import AmenityList_05 from "../components/IT22003546_Components/AmenityList_05";
import DashServiceBookList_06 from "../components/IT22350114_Components/DashServiceBookList_06";




const Dashboard = () => {
  const location = useLocation();
  const [tab, setTab] = useState('')
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if(tabFromUrl) {
      setTab(tabFromUrl)
    }
  }, [location.search])
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        {/* Sidebar */}
        <DashSidebar/>
      </div>
      {/* profile */}
      {tab === 'profile' && <DashProfile/>}
      {/* properties */}
      {tab === 'properties' && <DashSharedResourcesList_02 />}
      {/* users */}
      {tab === 'users' && <DashUsers/>}
      {/* staffs */}
      {tab === 'staffs' && <DashStaff_04/>}
      {/* services */}
      {tab === 'services' && <DashServices />}
      {/* Apartment List */}
      {tab === 'apartmentList' && <DashApartmentList_02 />}
      {/* payments */}
      {tab === 'payments' && <DashPayments_03/>}
      {/* user payments */}
      {tab === 'userpayments' && <DashUserPayments_03/>}
      {/* add payments */}
      {tab === 'addpayments' && <AddPaymentProfile_03/>}
      {/* maintenance */}
      {tab === "maintenance" && <DashMaintenance />}
       {/* amenity */}
      {tab == 'amenity' && <AmenityList_05/>}
      {/* Comments */}
      {tab == 'comments' && <DashComments_02/>}
      {/* Booking */}
      {tab == 'bookings' && <BookingList_05/>}
      {/*admin add payments */}
      {tab==='Adminaddpayments'&& <AdminPayments_03/>}
      {/* service bookings */}
      {tab === 'serviceBookings' && <DashServiceBookList_06 />}
      
    </div>
  )
}

export default Dashboard