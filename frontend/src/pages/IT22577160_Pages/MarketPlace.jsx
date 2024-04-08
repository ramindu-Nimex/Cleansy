import { AiFillHeart, AiFillStar, AiOutlineEye, AiOutlineHeart, AiOutlineSearch, AiOutlineShoppingCart, AiOutlineStar } from "react-icons/ai";
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MarketPlaceHeader_02 from '../../components/IT22577160_Components/MarketPlaceHeader_02';

const MarketPlace = () => {
   const [resources, setResources] = useState([]);
   const [showMore, setShowMore] = useState(false);

   useEffect(() => {
      const fetchPost = async () => {
         const res = await fetch('/api/sharedResourcesListing/getSharedResources')
         const data = await res.json()
         setResources(data.resources)
         if(data.resources.length === 9) {
            setShowMore(true);
         } else {
            setShowMore(false);
         }
      }
      fetchPost();
   }, [])

   const handleShowMore = async () => {
      const numberOfPosts = resources.length;
      const startIndex = numberOfPosts;
      const urlParams = new URLSearchParams(location.search);
      urlParams.set('startIndex', startIndex);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/sharedResourcesListing/getSharedResources?${searchQuery}`);
      if(!res.ok) {
         return;
      }
      if(res.ok) {
         const data = await res.json();
         setResources([...resources, ...data.resources]);
         if(data.resources.length === 9) {
            setShowMore(true);
         } else {
            setShowMore(false);
         }
      }
   }

  return (
   <>
      <MarketPlaceHeader_02 />
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7'>
        {
           resources && resources.length > 0 && (
              <div className='flex flex-col gap-6'>
               {/* <h1 className='text-center my-7 font-extrabold text-3xl underline'>Market Place</h1> */}
               <div className='flex flex-wrap gap-12'>
                  {resources.map((resource) => (
                     <div key={resource._id}>
                        <div className='group relative w-full border border-teal-500 overflow-hidden rounded-lg sm:w-[330px] transition-all'>
                           <Link to={`/sharedResource/${resource.slug}`}>
                              <img src={resource.image} alt="post cover" className='h-[230px] w-full object-cover  transition-all duration-300 z-20' />
                           </Link>
                           <div className="p-3 flex flex-col gap-2">
                              <p className='text-lg font-semibold line-clamp-2'>{resource.title}</p>
                              <div className='flex justify-between'>
                                 <span className='italic text-sm'>{resource.category}</span>
                                 <div className="flex text-xs">
                                    <AiFillStar className='mr-2 cursor-pointer' color='#F6BA00' size={20}/>
                                    <AiFillStar className='mr-2 cursor-pointer' color='#F6BA00' size={20}/>
                                    <AiFillStar className='mr-2 cursor-pointer' color='#F6BA00' size={20}/>
                                    <AiFillStar className='mr-2 cursor-pointer' color='#F6BA00' size={20}/>
                                    <AiOutlineStar className='mr-2 cursor-pointer' color='#F6BA00' size={20}/>
                                 </div>
                              </div>
                              <div className='flex justify-between items-center'>
                                 <div className='flex'>
                                    <h5 className='font-bold text-[18px] text-slate-800 dark:text-teal-500 font-Roboto'>
                                       {resource.regularPrice === 0 ? resource.regularPrice + " $" : resource.regularPrice - resource.discountPrice + " $"}
                                    </h5>
                                    <h4 className='font-[500] text-[16px] text-[#d55b45] pl-3 mt-[-4px] line-through'>
                                       {resource.regularPrice ? resource.regularPrice + " $" : null}
                                    </h4>
                                 </div>
                                 <div className='flex items-center gap-4'>
                                    <AiOutlineHeart size={22}/>
                                    <AiOutlineEye size={22} title="Quick view"/>
                                    <AiOutlineShoppingCart size={22} title="Add to cart" />
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
            
         )
        }
        {
            showMore && (
               <button onClick={handleShowMore} className='text-teal-500 hover:underline p-7 text-center w-full'>
                  Show More
               </button>
            )
         }
      </div>
   </>
   
  )
}

export default MarketPlace