import Title from '../components/Title'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div>

      <div className='text-2xl text-center pt-8 border-t'>
          <Title text1={'ABOUT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
          <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="" />
          <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
              <p>J&S Creations was born out of a passion for fashion and a desire to enhance the beauty of every saree with perfectly designed readymade blouses. Our journey began with a simple idea: to provide stylish, high-quality blouses that combine tradition, comfort, and modern elegance — all in one place.

Since our inception, we have worked with dedication to create a diverse collection of beautifully crafted blouses that suit every occasion and preference. From traditional silk and cotton designs to trendy party wear and bridal collections, our pieces are thoughtfully designed to meet the needs of today’s confident and graceful women.

We focus on quality fabrics, elegant stitching, and flattering fits to ensure that every blouse not only looks beautiful but also feels comfortable.</p>
             
              <b className='text-gray-800'>Our Mission</b>
              <p>Our mission at J&S Creations is to empower women with confidence, style, and convenience through ready-to-wear blouses that celebrate Indian tradition while embracing modern fashion. We are committed to delivering quality, affordability, and customer satisfaction in every piece we create.</p>
          </div>
      </div>

      <div className=' text-xl py-4'>
          <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20'>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Quality Assurance:</b>
            <p className=' text-gray-600'>We meticulously select and vet each product to ensure it meets our stringent quality standards.</p>
          </div>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Convenience:</b>
            <p className=' text-gray-600'>With our user-friendly interface and hassle-free ordering process, shopping has never been easier.</p>
          </div>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Exceptional Customer Service:</b>
            <p className=' text-gray-600'>Our team of dedicated professionals is here to assist you the way, ensuring your satisfaction is our top priority.</p>
          </div>
      </div>


    </div>
  )
}

export default About
