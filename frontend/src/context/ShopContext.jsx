import { createContext, useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import PropTypes from 'prop-types'

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = '₹';
    const delivery_fee = 10;
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState('')
    const [userData, setUserData] = useState(null)
    const navigate = useNavigate();


    const addToCart = async (itemId, size) => {

        if (!size) {
            toast.error('Select Product Size');
            return;
        }

        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            }
            else {
                cartData[itemId][size] = 1;
            }
        }
        else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
        setCartItems(cartData);
        toast.success('Added To Cart')

        if (token) {
            try {

                await axios.post(backendUrl + '/api/cart/add', { itemId, size }, { headers: { token } })

            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }

    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item];
                    }
                } catch (error) {

                }
            }
        }
        return totalCount;
    }

    const updateQuantity = async (itemId, size, quantity) => {

        let cartData = structuredClone(cartItems);

        cartData[itemId][size] = quantity;

        setCartItems(cartData)

        if (token) {
            try {

                await axios.post(backendUrl + '/api/cart/update', { itemId, size, quantity }, { headers: { token } })

            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }

    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalAmount += itemInfo.price * cartItems[items][item];
                    }
                } catch (error) {

                }
            }
        }
        return totalAmount;
    }

    const addReview = async (productId, rating, comment) => {
        try {
            const response = await axios.post(backendUrl + '/api/product/add-review', { productId, rating, comment }, { headers: { token } })
            if (response.data.success) {
                toast.success('Review added successfully')
                // refresh the product list so ratings update in collections
                getProductsData();
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const checkUserOrderedProduct = async (productId) => {
        try {
            const response = await axios.post(backendUrl + '/api/order/check-ordered', { productId }, { headers: { token } })
            return response.data.hasOrdered
        } catch (error) {
            console.log(error)
            return false
        }
    }

    const getProductsData = useCallback(async () => {
        try {

            const response = await axios.get(backendUrl + '/api/product/list')
            if (response.data.success) {
                // ensure each product has computed rating and review count
                const productsWithRating = response.data.products.map((p) => {
                    const reviews = p.reviews || [];
                    const avg = reviews.length > 0
                        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                        : 0;
                    return {
                        ...p,
                        averageRating: parseFloat(avg.toFixed(1)),
                        reviewCount: reviews.length
                    };
                });
                setProducts(productsWithRating.reverse())
            } else {
                toast.error(response.data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }, [backendUrl])

    const getUserProfile = useCallback(async () => {
        try {
            const response = await axios.get(backendUrl + '/api/user/get-profile', { headers: { token } })
            if (response.data.success) {
                setUserData(response.data.userData)
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }, [backendUrl, token])

    const updateUserProfile = async (formData) => {
        try {
            const response = await axios.post(backendUrl + '/api/user/update-profile', formData, { headers: { token } })
            if (response.data.success) {
                toast.success(response.data.message)
                await getUserProfile()
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const getUserCart = useCallback(async ( token ) => {
        try {
            
            const response = await axios.post(backendUrl + '/api/cart/get',{},{headers:{token}})
            if (response.data.success) {
                setCartItems(response.data.cartData)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }, [backendUrl])

    useEffect(() => {
        getProductsData()
    }, [getProductsData])

    useEffect(() => {
        if (!token && localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'))
            getUserCart(localStorage.getItem('token'))
        }
        if (token) {
            getUserCart(token)
            getUserProfile()
        }
    }, [token, getUserCart, getUserProfile])

    const value = {
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart,setCartItems,
        getCartCount, updateQuantity,
        getCartAmount, navigate, backendUrl,
        setToken, token, addReview, checkUserOrderedProduct,
        userData, setUserData, getUserProfile, updateUserProfile
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )

}

ShopContextProvider.propTypes = {
  children: PropTypes.node.isRequired
}

export default ShopContextProvider;
