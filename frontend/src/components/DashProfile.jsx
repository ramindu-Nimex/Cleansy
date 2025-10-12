import { Alert, Button, Modal, Spinner, TextInput } from 'flowbite-react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { app } from '../firebase.js'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateStart, updateSuccess, updateFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signOutSuccess } from '../../redux/user/userSlice.js'
import { useDispatch } from 'react-redux'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { FcHome } from 'react-icons/fc'
import { GrResources } from "react-icons/gr";
import {Link} from 'react-router-dom'
import DOMPurify from 'dompurify' // Added for XSS sanitization

const DashProfile = () => {
  const {currentUser, error, loading} = useSelector(state => state.user)
  const [imageFile, setImageFile] = useState(null)
  const [imageFileUrl, setImageFileUrl] = useState(null)
  const [imageFileUploadedProgress, setImageFileUploadedProgress] = useState(null)
  const [imageFileUploadError, setImageFileUploadError] = useState(null)
  const [imageFileUploading, setImageFileUploading] = useState(false)
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null)
  const [updateUserError, setUpdateUserError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({})
  const filePickerRef = useRef();
  const dispatch = useDispatch()

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if(file) {
      setImageFile(file)
      setImageFileUrl(URL.createObjectURL(file))
    }
  }
  
  useEffect(() => {
    if(imageFile) {
      uploadImage()
    }
  }, [imageFile])

  const uploadImage = async () => {
    setImageFileUploading(true)
    setImageFileUploadError(null)
    const storage = getStorage(app)
    const fileName = new Date().getTime() + imageFile.name
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, imageFile)
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setImageFileUploadedProgress(progress.toFixed(0))
      },
      (error) => {
        setImageFileUploadError('could not upload image (File must be less than 2MB)')
        setImageFileUploadedProgress(null)
        setImageFile(null)
        setImageFileUrl(null)
        setImageFileUploading(false)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          const safeUrl = DOMPurify.sanitize(downloadURL) // sanitize uploaded URL
          setImageFileUrl(safeUrl)
          setFormData({...formData, profilePicture: safeUrl})
          setImageFileUploading(false)
        })
      }
    )
  }

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUpdateUserError(null)
    setUpdateUserSuccess(null)
    if(Object.keys(formData).length === 0) {
      setUpdateUserError('No changes made')
      return
    }
    if(imageFileUploading) {
      setUpdateUserError('Please wait for image to upload')
      return
    }
    try {
      dispatch(updateStart())
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if(!res.ok) {
        dispatch(updateFailure(data.message))
        setUpdateUserError(data.message)
      } else {
        dispatch(updateSuccess(data))
        setUpdateUserSuccess("User's Profile Updated Successfully")
      }
    } catch (error) {
      dispatch(updateFailure(error.message))
      setUpdateUserError(error.message)
    }
  }

  const handleDeleteUser = async () => {
    setShowModal(false)
    try {
      dispatch(deleteUserStart())
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE'
      })
      const data = await res.json()
      if(!res.ok) {
        dispatch(deleteUserFailure(data.message))
      } else {
        dispatch(deleteUserSuccess(data))
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }

  const handleSignout = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST'
      })
      const data = await res.json()
      if(!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signOutSuccess())
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className='text-center my-7 font-extrabold text-3xl underline'>Profile</h1>
      {/* previous version  */}
      {/* <div className="max-w-lg mx-auto p-3 w-full border-2 border-red-500 mb-5">
        <h2 className='text-xl font-bold mb-2'>User Profile (Vulnerable)</h2>
        <div
          dangerouslySetInnerHTML={{
            __html: `
              <p>Username: ${(currentUser.username)}</p>
              ${(currentUser.profilePicture)}
            `
          }}
        />
        <p className="text-red-600 mt-2">This section is vulnerable to DOM XSS!</p>
      </div> */}
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input type="file" accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden/>
        <div className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full" onClick={() => filePickerRef.current.click()}>
            {
               imageFileUploadedProgress && (
                  <CircularProgressbar value={imageFileUploadedProgress || 0} text={`${imageFileUploadedProgress}%`} strokeWidth={5}
                  styles={{
                     root: {
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                     },
                     path: {
                        stroke: `rgba(62, 152, 199, ${imageFileUploadedProgress / 100})`,
                     }
                  }}/>
               )
            }
          <img src={DOMPurify.sanitize(imageFileUrl || currentUser.profilePicture)} alt="user" className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${imageFileUploadedProgress && imageFileUploadedProgress < 100 && 'opacity-60'}`} />
        </div>
        {
          imageFileUploadError && <Alert className="mt-7 py-3 bg-gradient-to-r from-red-100 via-red-300 to-red-400 shadow-shadowOne text-center text-red-600 text-base tracking-wide animate-bounce">{imageFileUploadError}</Alert>
        }
        <TextInput type='text' id='username' placeholder='Username' defaultValue={currentUser.username} onChange={handleChange}/>
        <TextInput type='email' id='email' placeholder='Email' defaultValue={currentUser.email} onChange={handleChange}/>
        <TextInput type='password' id='password' placeholder='password' onChange={handleChange}/>
        <Button type='submit' gradientDuoTone='purpleToBlue' className="uppercase" disabled={loading || imageFileUploading}>
          {loading ? <><Spinner size='sm'/><span className="pl-3">Loading...</span></> : 'Update'}
        </Button>
        
      </form>
      {
        !currentUser.isAdmin && (
          <>
            <Link to={'/create-apartmentListing'}>
              <Button type='submit' gradientDuoTone="pinkToOrange" className='flex flex-col gap-4 w-full uppercase my-4'>
                <FcHome className='mr-2 text-3xl bg-red-300 rounded-full p-1 border-2' />Sell or Rent Your Apartments
              </Button>
            </Link>
          </>
        )
      }
      {
        currentUser.isPropertyAdmin && (
          <>
            <Link to={'/create-sharedResourceListing'}>
              <Button type='submit' gradientDuoTone="pinkToOrange" className='flex flex-col gap-4 w-full uppercase my-4'>
                <GrResources className='mr-2 text-3xl bg-red-300 rounded-full p-1 border-2' />Manage Properties 
              </Button>
            </Link>
          </>
        )
      }
      <div className="text-red-500 flex justify-between mt-5">
        <span className='cursor-pointer' onClick={() => setShowModal(true)}>Delete Account</span>
        <span className='cursor-pointer' onClick={handleSignout}>Sign Out</span>
      </div>
      {
        updateUserSuccess && <Alert className="mt-7 py-3 bg-gradient-to-r from-green-200 via-green-300 to-green-400 shadow-shadowOne text-center text-green-800 text-base tracking-wide animate-bounce">{updateUserSuccess}</Alert>
      }
      {
        updateUserError && <Alert className="mt-7 py-3 bg-gradient-to-r from-red-100 via-red-300 to-red-400 shadow-shadowOne text-center text-red-600 text-base tracking-wide animate-bounce">{updateUserError}</Alert>
      }
      {
        error && <Alert className="mt-7 py-3 bg-gradient-to-r from-red-100 via-red-300 to-red-400 shadow-shadowOne text-center text-red-600 text-base tracking-wide animate-bounce">{error}</Alert>
      }
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">Are you sure you want to delete your account?</h3>
            <div className="flex justify-center gap-4">
              <Button color='failure' onClick={handleDeleteUser}>
                Yes I'm Sure
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>No, Cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default DashProfile