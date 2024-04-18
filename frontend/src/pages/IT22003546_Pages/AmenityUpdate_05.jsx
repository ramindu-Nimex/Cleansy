import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
    Button,
    Label,
    TextInput,
    Textarea,
} from "flowbite-react";

const AmenityUpdate_05 = () => {
    const navigate = useNavigate();
    const params = useParams();
    const { currentUser } = useSelector((state) => state.user);
    const [formData, setFormData] = useState({
        AmenityID: "",
        AmenityName: "",
        Description: "",
        Location: "",
        Capacity: "",
        AvailableTime: "",
        Price: "",
        //imageURLs: [],
    });

    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchAmenity = async () => {
            const amenityID = params.amenityID;
            const res = await fetch(`/api/amenitiesListing/get/${amenityID}`);
            const data = await res.json();
            if (data.success === false) {
                console.log(data.message);
                return;
            }
            setFormData((prevData) => ({
                ...prevData,
                AmenityID: data.amenityID,
                AmenityName: data.amenityTitle,
                Description: data.amenityDescription,
                Location: data.amenityLocation,
                Capacity: data.amenityCapacity,
                AvailableTime: data.amenityAvailableTimes,
                Price: data.amenityPrice,
                //imageURLs: data.imageURLs,
            }));
        }
        fetchAmenity();
    }
        , []);

    const handleChange = (e) => {
        console.log("Event:", e);
        const { name, value } = e.target;
        console.log("Name:", name);
        console.log("Value:", value);
        setFormData({
            ...formData,
            [name]: value,
        });
    };
        
        

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.AmenityID === currentUser.AmenityID) {
                setError("AmenityID already exists");
                return;
            }
            setLoading(true);
            console.log("Form Data:", formData); // Add this line
            setError(false);
            
            const res = await fetch(`/api/amenitiesListing/update/${params.amenityID}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            setLoading(false);
            if (data.success === false) {
                setError(data.message);
                return;
            }
            navigate("/dashboard?tab=amenity");
        } catch (error) {
            setError("An error occurred while updating the amenity.");
            console.log(error);
        }
    };

    return (
        <div className="min-h-screen mt-20">
            <main>
                <h1 className="text-3xl text-center mt-6 font-extrabold underline text-blue-950 dark:text-slate-300">
                    Update Amenity
                </h1>
            </main>
            <div className="flex p-3 w-[40%] mx-auto flex-col md:flex-row md:items-center gap-20 md:gap-20 mt-10">
                <form onSubmit = {handleSubmit} className="flex flex-col gap-4 w-full justify-center">
                    <div>
                        <Label value="AmenityID" />
                        <TextInput
                            type="text"
                            name="AmenityID"
                            required
                            value={formData.AmenityID}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <Label value="Amenity Name" />
                        <TextInput
                            type="text"
                            name="AmenityName"
                            required
                            value={formData.AmenityName}
                            onChange={handleChange}
                        />
                    </div>   
                    <div>
                        <Label value="Description" />
                        <Textarea
                            name="Description"
                            required
                            value={formData.Description}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <Label value="Location" />
                        <TextInput
                            type="text"
                            name="Location"
                            required
                            value={formData.Location}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <Label value="Capacity" />
                        <TextInput
                            type="number"
                            name="Capacity"
                            required
                            value={formData.Capacity}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <Label value="Price" />
                        <TextInput
                            type="number"
                            name="Price"
                            required
                            value={formData.Price}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <Label value="AvailableTime" />
                        <TextInput
                            type="text"
                            name="AvailableTime"
                            required
                            value={formData.AvailableTime}
                            onChange={handleChange}
                        />
                    </div>
                    {/* <div>
                        <Label value="imageURLs" />
                        <TextInput
                            type="text"
                            name="imageURLs"
                            placeholder="imageURLs"
                            required
                            value={formData.imageURLs}
                            onChange={handleChange}
                        />
                    </div> */}
                    <Button
                        type="submit"
                        gradientDuoTone="purpleToBlue"
                        className="uppercase"
                        >{loading ? "Loading..." : "Update Amenity"}</Button>
                        {error && <p className="text-red-500 mt-4">{error}</p>}
                </form>   
        </div>
    </div>
    );
}

export default AmenityUpdate_05;