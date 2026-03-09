import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useParams } from 'react-router-dom'
import Title from '../components/Title'
import axios from 'axios'

const TrackOrder = () => {
    const { orderId } = useParams()
    const { backendUrl, token, currency } = useContext(ShopContext)
    const [orderData, setOrderData] = useState(null)

    const fetchOrderData = async () => {
        try {
            const response = await axios.post(backendUrl + '/api/order/userorders', {}, { headers: { token } })
            if (response.data.success) {
                const order = response.data.orders.find(item => item._id === orderId)
                if (order) {
                    setOrderData(order)
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (token) {
            fetchOrderData()
        }
    }, [token, orderId])

    if (!orderData) {
        return <div className='p-10 text-center'>Loading order details...</div>
    }

    const trackStatus = [
        { status: "Order Placed", emoji: "📦" },
        { status: "Packing", emoji: "🎁" },
        { status: "Shipped", emoji: "🚚" },
        { status: "Out for delivery", emoji: "🛵" },
        { status: "Delivered", emoji: "🏠" }
    ]
    const currentStatusIndex = trackStatus.findIndex(item => item.status === orderData.status)

    return (
        <div className='border-t pt-16 animate-fade-in'>
            <div className='text-2xl mb-8'>
                <Title text1={'TRACK'} text2={'ORDER'} />
            </div>

            <div className='bg-white p-6 md:p-10 rounded-lg border border-[var(--theme-border)] theme-soft shadow-sm animate-slide-up'>
                <div className='flex flex-col md:flex-row justify-between mb-10 gap-4'>
                    <div>
                        <p className='text-gray-500 text-sm mb-1'>Order ID</p>
                        <p className='font-medium text-lg'>#{orderData._id}</p>
                    </div>
                    <div>
                        <p className='text-gray-500 text-sm mb-1'>Order Date</p>
                        <p className='font-medium'>{new Date(orderData.date).toDateString()}</p>
                    </div>
                    <div className='md:text-right'>
                        <p className='text-gray-500 text-sm mb-1'>Total Paid</p>
                        <p className='font-bold text-xl text-[var(--theme-primary-dark)]'>{currency}{orderData.amount}</p>
                    </div>
                </div>

                {/* Tracking Visualizer */}
                <div className='relative mb-24 mt-16 px-4 max-w-4xl mx-auto'>
                    {/* Background line */}
                    <div className='absolute top-1/2 left-0 w-full h-1.5 bg-gray-200 -translate-y-1/2 rounded-full'></div>
                    
                    {/* Animated Progress line */}
                    <div 
                        className='absolute top-1/2 left-0 h-1.5 bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-primary-dark)] -translate-y-1/2 transition-all duration-1000 ease-in-out rounded-full shadow-[0_0_10px_rgba(197,134,165,0.5)]'
                        style={{ width: `${(currentStatusIndex / (trackStatus.length - 1)) * 100}%` }}
                    ></div>

                    <div className='flex justify-between relative'>
                        {trackStatus.map((item, index) => (
                            <div key={index} className='flex flex-col items-center relative group'>
                                {/* Status Circle */}
                                <div 
                                    className={`w-10 h-10 md:w-14 md:h-14 rounded-full border-4 border-white transition-all duration-700 flex items-center justify-center relative z-20 
                                    ${index <= currentStatusIndex ? 'bg-[var(--theme-primary)] scale-110 shadow-lg' : 'bg-gray-300'}
                                    ${index === currentStatusIndex ? 'ring-4 ring-[var(--theme-soft)] animate-pulse-slow' : ''}`}
                                >
                                    <span className='text-lg md:text-2xl transition-transform duration-500 group-hover:scale-125'>
                                        {index < currentStatusIndex ? '✅' : item.emoji}
                                    </span>
                                </div>
                                
                                {/* Status Text */}
                                <div className={`absolute top-12 md:top-16 text-center w-24 md:w-32 transition-all duration-500 
                                    ${index <= currentStatusIndex ? 'text-[var(--theme-primary-dark)] font-semibold' : 'text-gray-400 font-medium'}`}>
                                    <p className='text-[10px] md:text-sm leading-tight'>
                                        {item.status}
                                    </p>
                                    {index === currentStatusIndex && (
                                        <p className='text-[8px] md:text-[10px] text-[var(--theme-primary)] animate-pulse mt-1'>Current Stage</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Items Summary */}
                <div className='mt-16 pt-8 border-t border-[var(--theme-border)]'>
                    <h3 className='text-lg font-medium mb-4'>Order Items</h3>
                    <div className='grid grid-cols-1 gap-4'>
                        {orderData.items.map((item, index) => (
                            <div key={index} className='flex items-center gap-4 p-4 rounded-md border border-[var(--theme-border)] bg-white/50'>
                                <img className='w-12 h-16 object-cover rounded' src={item.image[0]} alt="" />
                                <div className='flex-1'>
                                    <p className='font-medium'>{item.name}</p>
                                    <p className='text-sm text-gray-500 font-medium'>Size: {item.size} | Qty: {item.quantity}</p>
                                </div>
                                <p className='font-bold'>{currency}{item.price}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TrackOrder
