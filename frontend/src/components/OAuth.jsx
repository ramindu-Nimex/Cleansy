import { Button } from "flowbite-react"
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase.js";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const OAuth = () => {
   const auth = getAuth(app)
   const dispatch = useDispatch()
   const navigate = useNavigate()

   const handleGoogleClick = async () => {
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({ prompt: 'select_account' })
      try {
         const result = await signInWithPopup(auth, provider)
         const res = await fetch('/api/auth/google', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json'
            },
            body: JSON.stringify({
               name: result.user.displayName,
               email: result.user.email,
               googlePhotoURL: result.user.photoURL
            })
         })
         const data = await res.json()
         if(res.ok) {
            dispatch(signInSuccess(data))
            navigate('/')
            toast.success("User logged in successfully")
          }
      } catch (error) {
         toast.error("Couldn't Authorized with Google");
      }
   }

  return (
    <Button type="button" gradientDuoTone="pinkToOrange" onClick={handleGoogleClick} className="uppercase">
      <FcGoogle className='text-2xl bg-white rounded-full mr-2 u'/> Continue With Google
   </Button>
  )
}

export default OAuth