import PropTypes from 'prop-types'

const Title = ({text1,text2}) => {
  return (
    <div className='inline-flex gap-2 items-center mb-3'>
      <p className='text-gray-500'>{text1} <span className='text-[var(--theme-primary-dark)] font-medium'>{text2}</span></p>
      <p className='w-8 sm:w-12 h-[1px] sm:h-[2px] bg-[var(--theme-primary)]'></p>
    </div>
  )
}

Title.propTypes = {
  text1: PropTypes.string.isRequired,
  text2: PropTypes.string.isRequired
}

export default Title
