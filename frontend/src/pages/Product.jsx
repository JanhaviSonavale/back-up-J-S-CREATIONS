import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import axios from 'axios';

const Product = () => {

  const { productId } = useParams();
  const { currency ,addToCart, backendUrl, token, addReview, checkUserOrderedProduct } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('')
  const [size,setSize] = useState('')
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [hasOrdered, setHasOrdered] = useState(false)
  const [activeTab, setActiveTab] = useState('description')

  const fetchProductData = async () => {
    try {
      const response = await axios.post(backendUrl + '/api/product/single', { productId })
      if (response.data.success && response.data.product) {
        setProductData(response.data.product)
        if (response.data.product.image && response.data.product.image.length > 0) {
          setImage(response.data.product.image[0])
        }
      } else {
        setProductData(null)
      }
    } catch (error) {
      console.log(error)
      setProductData(null)
    }
  }

  const checkOrdered = async () => {
    if (token) {
      const ordered = await checkUserOrderedProduct(productId)
      setHasOrdered(ordered)
    }
  }

  useEffect(() => {
    fetchProductData();
  }, [productId])

  useEffect(() => {
    checkOrdered();
  }, [token, productId])

  const submitReview = async () => {
    if (!token) {
      alert('Please login to add a review')
      return
    }
    if (rating === 0 || !comment.trim()) {
      alert('Please provide rating and comment')
      return
    }
    await addReview(productId, rating, comment)
    setRating(0)
    setComment('')
    fetchProductData() // refresh
    setActiveTab('reviews') // Switch to reviews tab to see the change
  }

  const averageRating = productData && productData.reviews && productData.reviews.length > 0 ? (productData.reviews.reduce((sum, r) => sum + r.rating, 0) / productData.reviews.length).toFixed(1) : 0

  return productData === null ? (
    <div className='flex flex-col items-center justify-center min-h-[50vh]'>
      <p className='text-3xl font-medium text-gray-600'>Product not found</p>
    </div>
  ) : productData ? (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      {/*----------- Product Data-------------- */}
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>

        {/*---------- Product Images------------- */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
              {
                productData.image.map((item,index)=>(
                  <img onClick={()=>setImage(item)} src={item} key={index} className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer' alt="" />
                ))
              }
          </div>
          <div className='w-full sm:w-[80%]'>
              <img className='w-full h-auto' src={image} alt="" />
          </div>
        </div>

        {/* -------- Product Info ---------- */}
        <div className='flex-1'>
          <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
          <div className=' flex items-center gap-1 mt-2'>
            {[...Array(5)].map((_, i) => (
              <img key={i} src={i < Math.floor(averageRating) ? assets.star_icon : assets.star_dull_icon} alt="" className="w-3 5" />
            ))}
            <p className='pl-2'>({productData.reviews.length})</p>
          </div>
          <p className='mt-5 text-3xl font-medium'>{currency}{productData.price}</p>
          <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>
          <div className='flex flex-col gap-4 my-8'>
              <p>Select Size</p>
              <div className='flex gap-2'>
                {productData.sizes.map((item,index)=>(
                  <button onClick={()=>setSize(item)} className={`border py-2 px-4 bg-gray-100 ${item === size ? 'border-[var(--theme-primary)] bg-[var(--theme-soft)]' : ''}`} key={index}>{item}</button>
                ))}
              </div>
          </div>
          <button onClick={()=>addToCart(productData._id,size)} className='theme-btn px-8 py-3 text-sm'>ADD TO CART</button>
          <hr className='mt-8 sm:w-4/5' />
          <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
              <p>100% Original product.</p>
              <p>Cash on delivery is available on this product.</p>
              <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      {/* ---------- Description & Review Section ------------- */}
      <div className='mt-20'>
        <div className='flex'>
          <b onClick={() => setActiveTab('description')} className={`border px-5 py-3 text-sm cursor-pointer ${activeTab === 'description' ? 'bg-gray-100' : ''}`}>Description</b>
          <p onClick={() => setActiveTab('reviews')} className={`border px-5 py-3 text-sm cursor-pointer ${activeTab === 'reviews' ? 'bg-gray-100' : ''}`}>Reviews ({productData.reviews.length})</p>
        </div>
        <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500'>
          {activeTab === 'description' ? (
            <p>{productData.description}</p>
          ) : (
            <>
              {productData.reviews.length > 0 ? (
                [...productData.reviews].reverse().map((review, index) => (
                  <div key={index} className='border-b pb-4'>
                    <div className='flex items-center gap-2'>
                      <p className='font-semibold'>{review.user ? review.user.name : 'Unknown User'}</p>
                      <div className='flex'>
                        {[...Array(5)].map((_, i) => (
                          <img key={i} src={i < review.rating ? assets.star_icon : assets.star_dull_icon} alt="" className="w-3" />
                        ))}
                      </div>
                      <p className='text-xs text-gray-400'>{new Date(review.date).toLocaleDateString()}</p>
                    </div>
                    <p>{review.comment}</p>
                  </div>
                ))
              ) : (
                <p>No reviews yet.</p>
              )}
              {token && (
                <div className='mt-4'>
                  <h3 className='font-semibold'>Add a Review</h3>
                  {token ? (
                    <>
                      <div className='flex gap-2 mt-2'>
                        {[1,2,3,4,5].map((star) => (
                          <button key={star} onClick={() => setRating(star)} className={`text-2xl transition-colors ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}>★</button>
                        ))}
                      </div>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder='Your review/feedback about this product...'
                        className='w-full border p-2 mt-2 font-outfit outline-none'
                        rows={3}
                      />
                      <button onClick={submitReview} className='mt-2 theme-btn px-6 py-2 text-sm'>Submit Review</button>
                    </>
                  ) : (
                    <p className='text-gray-500'>Please login to share your feedback.</p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* --------- display related products ---------- */}

      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />

    </div>
  ) : <div className=' opacity-0'></div>
}

export default Product
