import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import {Link} from 'react-router-dom'

const ProductItem = ({id,image,name,price, averageRating = 0, reviewCount = 0}) => {
    
    const {currency} = useContext(ShopContext);

  // prepare stars for potential rendering
  const stars = [...Array(5)].map((_, i) => (
    <span key={i} className={`text-xs ${i < Math.floor(averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
  ));

  return (
    <Link onClick={()=>scrollTo(0,0)} className='text-gray-700 cursor-pointer' to={`/product/${id}`}>
      <div className=' overflow-hidden'>
        <img className='hover:scale-110 transition ease-in-out aspect-[3/4] object-cover' src={image[0]} alt="" />
      </div>
      <p className='pt-3 pb-1 text-sm'>{name}</p>

      {(averageRating > 0 || reviewCount > 0) && (
        <div className='flex items-center gap-1 mb-1'>
          {stars}
          <span className='text-xs text-gray-500'>
            {averageRating > 0 ? averageRating.toFixed(1) : 0}
            {reviewCount ? ` (${reviewCount})` : ''}
          </span>
        </div>
      )}

      <p className=' text-sm font-medium'>{currency}{price}</p>
    </Link>
  )
}

import PropTypes from 'prop-types'

ProductItem.propTypes = {
  id: PropTypes.string.isRequired,
  image: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  averageRating: PropTypes.number,
  reviewCount: PropTypes.number
}

export default ProductItem
