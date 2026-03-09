import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Orders = () => {

  const { backendUrl, token , currency, products } = useContext(ShopContext);
  const navigate = useNavigate();

  const [orderData,setorderData] = useState([])

  // Helper to check if a product is reviewed by the current user
  // This is tricky without userId in frontend, but we can check if the product has ANY reviews from a user name that matches? No, that's unsafe.
  // Instead, let's just show the average rating for the product if it exists.
  const getProductRatingInfo = (productId) => {
    const product = products.find(p => p._id === productId);
    return product ? { rating: product.averageRating, count: product.reviewCount } : null;
  }

  const loadOrderData = async () => {
    try {
      if (!token) {
        return null
      }

      const response = await axios.post(backendUrl + '/api/order/userorders',{},{headers:{token}})
      if (response.data.success) {
        let allOrdersItem = []
        response.data.orders.map((order)=>{
          order.items.map((item)=>{
            item['status'] = order.status
            item['payment'] = order.payment
            item['paymentMethod'] = order.paymentMethod
            item['date'] = order.date
            item['orderId'] = order._id
            allOrdersItem.push(item)
          })
        })
        setorderData(allOrdersItem.reverse())
      }
      
    } catch (error) {
      
    }
  }

  useEffect(()=>{
    loadOrderData()
  },[token])

  return (
    <div className='border-t pt-16'>

        <div className='text-2xl'>
            <Title text1={'MY'} text2={'ORDERS'}/>
        </div>

        <div>
            {
              orderData.map((item,index) => {
                const ratingInfo = getProductRatingInfo(item._id);
                
                return (
                <div key={index} className='py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                    <div className='flex items-start gap-6 text-sm'>
                        <img className='w-16 sm:w-20' src={item.image[0]} alt="" />
                        <div>
                          <p className='sm:text-base font-medium'>{item.name}</p>
                          <div className='flex items-center gap-3 mt-1 text-base text-gray-700'>
                            <p>{currency}{item.price}</p>
                            <p>Quantity: {item.quantity}</p>
                            <p>Size: {item.size}</p>
                          </div>
                          <p className='mt-1'>Date: <span className=' text-gray-400'>{new Date(item.date).toDateString()}</span></p>
                          <p className='mt-1'>Payment: <span className=' text-gray-400'>{item.paymentMethod}</span></p>
                          {ratingInfo && ratingInfo.count > 0 && (
                            <p className='mt-2 text-yellow-500 font-medium'>
                              ★ {ratingInfo.rating} ({ratingInfo.count} reviews)
                            </p>
                          )}
                        </div>
                    </div>
                    <div className='md:w-1/2 flex justify-between'>
                        <div className='flex items-center gap-2'>
                            <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
                            <p className='text-sm md:text-base'>{item.status}</p>
                        </div>
                        <div className='flex flex-col gap-2'>
                          <button onClick={()=>navigate(`/track-order/${item.orderId}`)} className='border px-4 py-2 text-sm font-medium rounded-sm hover:bg-gray-50 transition-colors'>Track Order</button>
                          <button onClick={()=>navigate(`/product/${item._id}`)} className='border px-4 py-2 text-sm font-medium rounded-sm hover:bg-gray-50 transition-colors'>View Product</button>
                        </div>
                    </div>
                </div>
                )
              })
            }
        </div>
    </div>
  )
}

export default Orders
