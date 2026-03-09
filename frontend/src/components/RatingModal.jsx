import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const RatingModal = ({ orderId, onClose }) => {
    const { backendUrl, token, addReview } = useContext(ShopContext)
    const [order, setOrder] = useState(null)
    const [ratings, setRatings] = useState({})
    const [comments, setComments] = useState({})

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await axios.post(backendUrl + '/api/order/userorders', {}, { headers: { token } })
                if (response.data.success) {
                    const userOrder = response.data.orders.find(o => o._id === orderId)
                    setOrder(userOrder)
                }
            } catch (error) {
                console.log(error)
            }
        }
        if (orderId) fetchOrder()
    }, [orderId, backendUrl, token])

    const handleRating = (productId, rating) => {
        setRatings(prev => ({ ...prev, [productId]: rating }))
    }

    const handleComment = (productId, comment) => {
        setComments(prev => ({ ...prev, [productId]: comment }))
    }

    const submitReviews = async () => {
        for (const item of order.items) {
            const rating = ratings[item._id]
            const comment = comments[item._id]
            if (rating && comment) {
                await addReview(item._id, rating, comment)
            }
        }
        toast.success('Reviews submitted!')
        onClose()
    }

    if (!order) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Rate Your Purchase</h2>
                {order.items.map((item, index) => (
                    <div key={index} className="mb-4 border-b pb-4">
                        <p className="font-semibold">{item.name}</p>
                        <div className="flex gap-1 mt-2">
                            {[1,2,3,4,5].map(star => (
                                <button
                                    key={star}
                                    onClick={() => handleRating(item._id, star)}
                                    className={`text-2xl ${ratings[item._id] >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                        <textarea
                            placeholder="Leave a comment..."
                            value={comments[item._id] || ''}
                            onChange={(e) => handleComment(item._id, e.target.value)}
                            className="w-full border p-2 mt-2"
                            rows={2}
                        />
                    </div>
                ))}
                <div className="flex gap-2 mt-4">
                    <button onClick={submitReviews} className="bg-blue-500 text-white px-4 py-2 rounded">Submit Reviews</button>
                    <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">Skip</button>
                </div>
            </div>
        </div>
    )
}

export default RatingModal