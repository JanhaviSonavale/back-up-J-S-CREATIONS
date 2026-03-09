import Title from '../components/Title'
import { assets } from '../assets/assets'
import { useState, useContext } from 'react'
import axios from 'axios'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'

const Contact = () => {

  const { backendUrl, token, products } = useContext(ShopContext)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    rating: 5,
    productId: ''
  })

  const [loading, setLoading] = useState(false)

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await axios.post(backendUrl + '/api/feedback/submit', { ...formData }, { headers: { token } })
      if (response.data.success) {
        toast.success(response.data.message)
        setFormData({ name: '', email: '', subject: '', message: '', rating: 5, productId: '' })
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className='text-center text-2xl pt-10 border-t'>
        <Title text1={'CONTACT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
        <img className='w-full md:max-w-[480px]' src={assets.contact_img} alt="" />
        <div className='flex flex-col justify-center items-start gap-6'>
          <p className='font-semibold text-xl text-gray-600 font-outfit'>Our Store</p>
          <p className=' text-gray-500 font-outfit'>J&S CREATIONS <br /> Balaram niwas, yashodhan nagar<br />pada no.2, Thane (w)</p>
          <p className=' text-gray-500 font-outfit'>Tel: 9892127879<br /> Email: admin@JandSCreations.com</p>
        </div>
      </div>

      <div className='flex flex-col md:flex-row gap-10 mb-28 border-t pt-20'>
        <div className='flex-1'>
          <Title text1={'SEND US'} text2={'FEEDBACK'} />
          <p className='text-gray-500 mt-4 font-outfit'>We value your opinion! Tell us about your experience with our store or any suggestions you have.</p>
        </div>
        <form onSubmit={onSubmitHandler} className='flex-1 flex flex-col gap-4'>
          <input
            required
            type="text"
            className='w-full px-3 py-2 border border-gray-800 outline-none font-outfit'
            placeholder='Name'
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <input
            required
            type="email"
            className='w-full px-3 py-2 border border-gray-800 outline-none font-outfit'
            placeholder='Email'
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <input
            required
            type="text"
            className='w-full px-3 py-2 border border-gray-800 outline-none font-outfit'
            placeholder='Subject'
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          />
          <textarea
            required
            rows={4}
            className='w-full px-3 py-2 border border-gray-800 outline-none font-outfit'
            placeholder='Your Message'
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          />

          <div className='flex flex-col gap-2'>
            <p className='text-gray-600 font-outfit'>Rate your experience / product:</p>
            <div className='flex gap-2 mb-2'>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className={`text-3xl transition-colors ${formData.rating >= star ? 'text-yellow-500' : 'text-gray-300'}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className='flex flex-col gap-2 mb-4'>
            <p className='text-gray-600 font-outfit'>Product to review (Optional):</p>
            <select
              className='w-full px-3 py-2 border border-gray-800 outline-none font-outfit bg-white'
              value={formData.productId}
              onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
            >
              <option value="">General Feedback (No specific product)</option>
              {products.map((item) => (
                <option key={item._id} value={item._id}>{item.name}</option>
              ))}
            </select>
          </div>
          <button disabled={loading} className='theme-btn px-8 py-3 text-sm flex items-center justify-center gap-2'>
            {loading ? 'SENDING...' : 'SEND FEEDBACK'}
          </button>
        </form>
      </div>


    </div>
  )
}

export default Contact

