import React, { useEffect, useState } from 'react'
import { Textarea, Button } from "flowbite-react"
import { Link } from 'react-router-dom';

const Contacts_02 = ({listing}) => {
   const [landlord, setLandlord] = useState(null);
   const [message, setMessage] = useState('');

   const onChange = (e) => {
      setMessage(e.target.value);
   }

   useEffect(() => {
      const fetchLandlord = async () => {
         try {
            const res = await fetch(`/api/user/${listing.userRef}`);
            const data = await res.json();
            setLandlord(data);
         } catch (error) {
            console.log(error);
         }
      }
      fetchLandlord();
   }, [listing.userRef])
  return (
    <>
      {
         landlord && (
            <div className='flex flex-col gap-2'>
               <p>
                  Contact <span className='font-semibold'>{landlord.username}</span> for get more details about this Apartment from
                  <span className='font-semibold'> {listing.ownerName.toLowerCase()}</span>
               </p>
               <Textarea name='message' id='message' rows={2} value={message} onChange={onChange} placeholder='Enter your message here...' />
               <Link to={`mailto:${landlord.email}?subject=Regarding get more details about this Apartment from ${listing.ownerName}&body=${message}`}>
                  <Button gradientDuoTone="pinkToOrange" className='w-full'>
                     Send Message
                  </Button>
               </Link>
            </div>
         )
      }
    </>
  )
}

export default Contacts_02