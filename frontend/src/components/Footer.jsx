/**
 * Footer component
 */
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-10 text-sm bg-[var(--theme-soft)] border border-[var(--theme-border)] rounded-2xl p-8'>

        <div>
            <img src={assets.logo} className='mb-5 w-32' alt="" />
            <p className='w-full md:w-2/3 text-gray-600'>
            J&S Creations offers stylish ready-made blouses crafted for elegance, comfort, and the perfect fit. Our collection blends traditional charm with modern designs, making every saree look effortlessly beautiful.

            </p>
        </div>

        <div>
            <p className='text-xl font-medium mb-5 text-[var(--theme-primary-dark)]'>COMPANY</p>
            <ul className='flex flex-col gap-1 text-gray-600'>
                <li>Home</li>
                <li>About us</li>
                <li>Delivery</li>
                <li>Privacy policy</li>
            </ul>
        </div>

        <div>
            <p className='text-xl font-medium mb-5 text-[var(--theme-primary-dark)]'>GET IN TOUCH</p>
            <ul className='flex flex-col gap-1 text-gray-600'>
                <li>9892127879</li>
                <li>contact@J&SCreations.com</li>
                <li><a href="https://www.instagram.com/js_creations_2024?igsh=ODhtZjR6MzZjMnh5" target="_blank" rel="noopener noreferrer" className='hover:text-[var(--theme-primary)]'>Instagram: JS_Creations_2024</a></li>
            </ul>
        </div>

      </div>

        <div>
            <hr className='border-[var(--theme-border)]' />
            <p className='py-5 text-sm text-center'>Copyright 2026@ J&S CREATIONS.com - All Right Reserved.</p>
        </div>

    </div>
  )
}

export default Footer
