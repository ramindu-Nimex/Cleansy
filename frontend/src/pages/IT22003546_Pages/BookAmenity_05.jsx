import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { app } from "../../firebase"

import {
  Button,
  Label,
  TextInput,
  Textarea,
  Alert,
  FileInput,
} from "flowbite-react";

const convertTimeRangeToArray = (timeRange) => {
  const [startTime, endTime] = timeRange.split('to').map(time => time.trim());
  const adjustedEndTime = endTime === '24:00' ? '24:00' : `${parseInt(endTime.split(':')[0]) + 1}:00`;
  return [startTime, adjustedEndTime];
};

const BookAmenity = () => {
  const { amenityId } = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState([])
  const [availableTimes, setAvailableTimes] = useState([]); 
  

  const generateBookingId = () => `BID-${Math.floor(10000 + Math.random() * 90000)}`;


  const [formData, setFormData] = useState({
    bookingDate: "",
    ime: "",
    duration: "",
    amenityId: "",
    amenityTitle: "",
    residentUsername: "",
    residentName: "",
    residentEmail: "",
    residentContact: "",
    specialRequests: "",
    bookingID: generateBookingId(),
    status: "Pending",
    pricePerHour: 0,
    bookingPrice: 0,
    imageUrls: [],
  });

  const handleImageSubmit = () => {
    if(files.length > 0 && files.length + formData.imageUrls.length < 7) {
       setUploading(true);
       setImageUploadError(false);
       const promises = [];

       for (let i = 0; i < files.length; i++) {
          promises.push(storeImage(files[i]));
       }

       Promise.all(promises).then((urls) => {
          setFormData({
             ...formData,
             imageUrls: formData.imageUrls.concat(urls)
          })
          setImageUploadError(false);
          setUploading(false);
       }).catch((err) => {
          setImageUploadError('Image Upload failed (2mb max per Image)');
          setUploading(false);
       })
    } else {
       setImageUploadError('You can only upload 6 Images per listing')
       setUploading(false);
    }
 }

 const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
       const storage = getStorage(app);
       const fileName = new Date().getTime() + file.name;
       const storageRef = ref(storage, fileName);
       const uploadTask = uploadBytesResumable(storageRef, file);
       uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload is ${progress}% done`);
          },
          (error) => {
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            })
          }
        )
    })
 }

 const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    })
 }

  useEffect(() => {
    const fetchAmenityDetails = async () => {
      try {
        const res = await fetch(`/api/amenitiesListing/get/${amenityId}`);
        const data = await res.json();
        if (data.success === false) {
          console.error("Error fetching amenity details");
          return;
        }
 
        setFormData((prevData) => ({
          ...prevData,
          amenityId: data.amenityID,
          amenityTitle: data.amenityTitle,
          residentUsername: currentUser.username,
          residentEmail: currentUser.email,
          pricePerHour: data.amenityPrice,
          amenityAvailableTimes: data.amenityAvailableTimes,
        }));

        const availableTimes = convertTimeRangeToArray(data.amenityAvailableTimes);
        setAvailableTimes(availableTimes);

        console.log(availableTimes)

      } catch (error) {
        console.error("Error fetching amenity details", error);
      }
    };

    fetchAmenityDetails();
  }, [amenityId]);

  const calculateTotalPrice = () => {
    if (formData.duration && formData.pricePerHour) {
      const total = formData.duration * formData.pricePerHour;
      setFormData((prevData) => ({
        ...prevData,
        bookingPrice: total,
      }));
    }
  };


  const handleChange = (e) => {
    const { name, value, type } = e.target;

  
    let processedValue = value;

    
    if (value === "true" || value === "false") {
        processedValue = value === "true";
    }

   
    if (name === "duration" && type === "number") {
        if (parseFloat(value) < 0) {
            alert("Invalid input for Duration: no negative values allowed.");
            return; 
        }
    }

    if (name === "residentName" && type === "text") {
        const onlyLettersAndSpaces = /^[A-Za-z\s]+$/;  
        if (!onlyLettersAndSpaces.test(value)) {
            alert("Invalid input for Resident Name: only letters and spaces are allowed.");
            return; 
        }
    }

    
    if (name === "residentContact" && type === "number") {
        if (parseInt(value) <= 0 || !Number.isInteger(parseFloat(value))) {
            alert("Invalid input for Resident Contact: please enter a positive integer.");
            return; 
        }
    }

    
    if (name === "bookingTime" && availableTimes.length === 2) {
        const [startTime, endTime] = availableTimes;
        if (value < startTime || value > endTime) {
            alert("Please select a time within the available range.");
            return; 
        }
    }

    
    setFormData(prevState => ({
        ...prevState,
        [name]: processedValue
    }));
};






  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError("Please upload at least one image");
      if (formData.bookingID === currentUser.bookingID) return setError('BookingID already exists');
      setLoading(true);
      setError(false);

      const payload = {
        ...formData,
        userRef: currentUser._id,
        bookingStatus: "Pending",
      };

      console.log("Submitting the following data to the backend:", payload);

      const response = await fetch('/api/amenitiesBooking/create', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
      });
      const data = await response.json();
      setLoading(false);
      if (data.success === false) {
          return setError(data.message);
      }

      navigate('/dashboard?tab=bookings');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Book Amenity</h1>
      <div className="flex p-3 w-[40%] mx-auto flex-col md:flex-row md:items-center gap-20 md:gap-20 mt-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full justify-center">
          <div>
            <Label htmlFor="bookingId">Booking ID:</Label>
            <TextInput
              type="text"
              id="bookingId"
              name="bookingID"
              value={formData.bookingID}
              disabled 
            />
          </div>

          <div>
            <Label htmlFor="amenityID">Amenity ID:</Label>
            <TextInput
              type="text"
              id="amenityID"
              name="amenityNum"
              value={formData.amenityId}
              readOnly
            />
          </div>

          <div>
            <Label htmlFor="amenityTitle" >Amenity Title:</Label>
            <TextInput
              type="text"
              id="amenityTitle"
              name="amenityTitle"
              value={formData.amenityTitle}
              readOnly
              
            />
          </div>

          <div>
            <Label htmlFor="residentUsername" >Resident Username</Label>
            <TextInput
              type="text"
              id="residentUsername"
              name="username"
              value={formData.residentUsername}
              readOnly
            />

          </div>
          <div>
              <Label htmlFor="name" >Resident Name:</Label>
              <TextInput
                type="text"
                id="residentName"
                name="residentName"
                required
                onChange={handleChange}
              />
          </div>

          <div>
            <Label htmlFor="residentEmail" >Resident Email</Label>
            <TextInput
              type="email"
              name="residentEmail"
              value={formData.residentEmail}
              onChange={handleChange}
            />  
          </div>

          <div>
            <Label htmlFor="contact" >Resident Contact:</Label>
            <TextInput
              type="number"
              id="residentContact"
              name="residentContact"
              required
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="date" >Date:</Label>
            <TextInput
              type="date"
              id="eventDate"
              min={new Date().toISOString().split('T')[0]}
              name="bookingDate"
              required
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="time" >Time:</Label>
            <TextInput
              type="time"
              id="eventTime"
              name="bookingTime"
              min={availableTimes[0]}
              max={availableTimes[1]}
              required
              onChange={handleChange}
            />   
          </div>

          <div>
            <Label htmlFor="duration" >Duration (Hours):</Label>
            <TextInput
              type="number"
              id="duration"
              name="duration"
              required
              onChange={handleChange}
            />
            <Button onClick={calculateTotalPrice} gradientDuoTone={"purpleToBlue"}>
            Calculate Total Price
          </Button>  
          </div>

          <div>
            <Label htmlFor="totalPrice" >Total Price:</Label>
            <TextInput
              type="text"
              id="totalPrice"
              name="totalPrice"
              value={`LKR ${formData.bookingPrice.toFixed(2)}`}
              onChange={handleChange}
              disabled
            />
          </div>

          <div>
            <Label htmlFor="specialRequests" >Special Requests:</Label>
            <Textarea
              id="specialRequests"
              name="specialRequests"
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col gap-4 flex-1">
            <p className="font-semibold">Payment Image: <span className="font-normal text-gray-600 ml-2">2 Images Max</span></p>
            <div className="flex gap-4">
                <FileInput onChange={(e) => setFiles(e.target.files)} type='file' id="image" accept="image/*" multiple className="w-full" />
                <button onClick={handleImageSubmit} type="button" disabled={uploading} className="p-1 text-red-700 border border-red-700 rounded uppercase hover:shadow-lg disabled:opacity-80">{uploading ? 'Uploading...' : 'Upload'}</button>
            </div>
            <p className="text-red-700">{imageUploadError && imageUploadError}</p>
            {
              formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
                  <div key={`image-${index}`} className="flex justify-between p-3 border items-center">
                      <img src={url} alt={`listing image ${index}`} className='w-20 h-20 object-contain rounded-lg' />
                      <Button type="button" onClick={() => handleRemoveImage(index)} gradientDuoTone="pinkToOrange">Delete</Button>
                  </div>
              ))
            }

         </div>

          <div className="flex flex-col gap-4 flex-1">
            <Button 
            type="submit"
            gradientDuoTone="purpleToBlue"
            className="uppercase"
            >{loading ? "Booking Amenity" : "Book Amenity"}</Button> 
              {error && <Alert className='mt-7 py-3 bg-gradient-to-r from-red-100 via-red-300 to-red-400 shadow-shadowOne text-center text-red-600 text-base tracking-wide animate-bounce'>{error}</Alert>}
          </div>  
        </form>
      </div>  
    </div>
  );
};

export default BookAmenity;
