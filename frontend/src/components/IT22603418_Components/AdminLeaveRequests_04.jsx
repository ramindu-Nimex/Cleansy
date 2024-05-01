import React, { useState } from "react";
import DashStaff_04 from "./DashStaff_04";
import { Button } from "flowbite-react";

const AdminLeaveRequests_04 = ({ index, request, onAccept, onDeny }) => {
  const {
    _id,
    staffID,
    staffName,
    email,
    phoneNo,
    leaveType,
    startDate,
    endDate,
    startTime,
    endTime,
    comments,
    status,
  } = request; // Destructure properties from request object
  const [showPopup, setShowPopup] = useState(false);

  // Function to handle accepting a leave request
  const handleAccept = () => {
    onAccept(_id);
  };

  // Function to handle denying a leave request
  const handleDeny = () => {
    onDeny(_id);
  };

  // Function to toggle the visibility of the popup
  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  // Function to calculate the duration
  const calculateDuration = () => {
    const sDate = new Date(`${startDate}`);
    const eDate = new Date(`${endDate}`);
    const sTime = new Date(`${startDate}T${startTime}`);
    const eTime = new Date(`${endDate}T${endTime}`);

    // Check if start and end dates are the same
    if (startDate === endDate) {
      // Calculate duration in hours and minutes
      const durationInMilliseconds = eTime - sTime;
      const hours = Math.floor(durationInMilliseconds / (1000 * 60 * 60));
      const minutes = Math.floor(
        (durationInMilliseconds % (1000 * 60 * 60)) / (1000 * 60)
      );
      return `${hours} h ${minutes} min`;
    } else {
      // Calculate duration in days
      const durationInMilliseconds = eDate - sDate;
      const durationInDays = durationInMilliseconds / (1000 * 60 * 60 * 24);
      return `${durationInDays} days`;
    }
  };

  const statusClass =
    status === "accepted"
      ? "text-green-700 font-bold"
      : status === "denied"
      ? "text-red-700 font-bold"
      : "";

  return (
    <tr>
      <td className="border border-gray-300 px-4 py-2">{index}</td>
      <td className="border border-gray-300 px-4 py-2">{_id}</td>
      <td className="border border-gray-300 px-4 py-2">{staffID}</td>
      <td className="border border-gray-300 px-4 py-2">{leaveType}</td>
      <td className="border border-gray-300 px-4 py-2">
        {calculateDuration()}
      </td>
      <td className={`border border-gray-300 px-4 py-2 ${statusClass}`}>
        {status}
      </td>
      <td className="border border-gray-300 px-4 py-2">
        <button className="mr-2" onClick={togglePopup}>
          View More
        </button>
        <button className="mr-2" onClick={handleAccept}>
          Accept
        </button>
        <button onClick={handleDeny}>Deny</button>
      </td>
      <DashStaff_04 isOpen={showPopup} onClose={togglePopup}>
        <div className="popup">
          <div className="popup-inner">
            <div className="max-w-md mx-auto border border-white shadow-md rounded-lg overflow-hidden">
              <table className="w-full">
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 px-4 font-semibold">Staff Name:</td>
                    <td className="py-2 px-4">{staffName}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4 font-semibold">Email:</td>
                    <td className="py-2 px-4">{email}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4 font-semibold">Phone No:</td>
                    <td className="py-2 px-4">{phoneNo}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4 font-semibold">Leave Type:</td>
                    <td className="py-2 px-4">{leaveType}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4 font-semibold">Start Date:</td>
                    <td className="py-2 px-4">{startDate}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4 font-semibold">End Date:</td>
                    <td className="py-2 px-4">{endDate}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4 font-semibold">Start Time:</td>
                    <td className="py-2 px-4">{startTime}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4 font-semibold">End Time:</td>
                    <td className="py-2 px-4">{endTime}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4 font-semibold">Comments:</td>
                    <td className="py-2 px-4">{comments}</td>
                  </tr>
                  <tr className="border-b">
                    <td colSpan="2" className="py-2 px-4 text-center">
                      <Button
                        gradientDuoTone="purpleToBlue"
                        className="mx-auto"
                        style={{ width: "100px" }}
                        onClick={togglePopup}
                      >
                        Close
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </DashStaff_04>
    </tr>
  );
};

export default AdminLeaveRequests_04;
