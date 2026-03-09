import { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const Feedback = ({ token }) => {
  const [feedbacks, setFeedbacks] = useState([])

  const fetchFeedback = async () => {
    if (!token) return
    try {
      const response = await axios.get(backendUrl + '/api/feedback/list', { headers: { token } })
      if (response.data.success) {
        setFeedbacks(response.data.feedback)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchFeedback()
  }, [token])

  return (
    <div>
      <h3 className='text-xl mb-4'>User Feedback</h3>
      <div className='flex flex-col gap-4'>
        {feedbacks.length > 0 ? (
          feedbacks.map((item, index) => (
            <div key={index} className='bg-white p-5 rounded-lg border border-gray-200 shadow-sm'>
              <div className='flex justify-between items-start mb-3'>
                <div className='flex flex-col'>
                  <p className='font-semibold text-lg text-gray-800'>{item.subject}</p>
                  <p className='text-sm text-gray-500'>From: {item.name} ({item.email})</p>
                  <div className='flex gap-1 mt-1'>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className={`text-lg ${item.rating >= star ? 'text-yellow-500' : 'text-gray-300'}`}>★</span>
                    ))}
                    {item.productId && <span className='text-xs text-blue-500 ml-2'>(Product: {item.productId})</span>}
                  </div>
                </div>
                <p className='text-xs text-gray-400'>{new Date(item.date).toLocaleDateString()} {new Date(item.date).toLocaleTimeString()}</p>
              </div>
              <p className='text-gray-700 bg-gray-50 p-4 rounded border italic'>"{item.message}"</p>
            </div>
          ))
        ) : (
          <p className='text-gray-500'>No feedback received yet.</p>
        )}
      </div>
    </div>
  )
}

export default Feedback
