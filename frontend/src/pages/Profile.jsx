import { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'

const Profile = () => {

    const { userData, updateUserProfile } = useContext(ShopContext)
    const [isEdit, setIsEdit] = useState(false)
    const [formData, setFormData] = useState({
        name: userData?.name || '',
        phone: userData?.phone || '',
        address: userData?.address || { line1: '', line2: '' },
        gender: userData?.gender || 'Not Selected',
        dob: userData?.dob || ''
    })

    const handleUpdate = async () => {
        const data = new FormData()
        data.append('name', formData.name)
        data.append('phone', formData.phone)
        data.append('address', JSON.stringify(formData.address))
        data.append('gender', formData.gender)
        data.append('dob', formData.dob)

        // Using simple object instead of FormData as we don't have images here for now
        const updateData = {
            name: formData.name,
            phone: formData.phone,
            address: JSON.stringify(formData.address),
            gender: formData.gender,
            dob: formData.dob
        }

        await updateUserProfile(updateData)
        setIsEdit(false)
    }

    if (!userData) {
        return <div className='p-10 text-center'>Loading profile...</div>
    }

    return (
        <div className='max-w-[700px] m-auto flex flex-col gap-4 text-sm mt-10'>
            <div className='flex flex-col gap-2'>
                <p className='text-3xl font-medium text-gray-700'>My Profile</p>
                <hr className='bg-gray-400 h-[1px] border-none' />
            </div>

            <div className='flex flex-col gap-6 mt-4'>
                <div className='flex flex-col gap-2'>
                    <p className='text-gray-500 underline'>Personal Information</p>
                    <div className='grid grid-cols-[1fr_3fr] gap-y-3 mt-3 text-gray-700 font-medium'>
                        <p>Name:</p>
                        {isEdit ? (
                            <input
                                className='bg-gray-50 border p-2'
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            />
                        ) : (
                            <p className='text-blue-500 font-bold'>{userData.name}</p>
                        )}

                        <p>Email:</p>
                        <p className='text-blue-500'>{userData.email}</p>

                        <p>Phone:</p>
                        {isEdit ? (
                            <input
                                className='bg-gray-50 border p-2'
                                type="text"
                                value={formData.phone}
                                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                            />
                        ) : (
                            <p className='text-blue-500'>{userData.phone || "Not Added"}</p>
                        )}
                    </div>
                </div>

                <div className='flex flex-col gap-2'>
                    <p className='text-gray-500 underline'>Basic Information</p>
                    <div className='grid grid-cols-[1fr_3fr] gap-y-3 mt-3 text-gray-700'>
                        <p>Gender:</p>
                        {isEdit ? (
                            <select
                                className='max-w-20 bg-gray-50 border p-2'
                                value={formData.gender}
                                onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                            >
                                <option value="Not Selected">Select</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        ) : (
                            <p className='text-gray-500'>{userData.gender}</p>
                        )}

                        <p>Birthday:</p>
                        {isEdit ? (
                            <input
                                className='max-w-28 bg-gray-50 border p-2'
                                type="date"
                                value={formData.dob}
                                onChange={(e) => setFormData(prev => ({ ...prev, dob: e.target.value }))}
                            />
                        ) : (
                            <p className='text-gray-500'>{userData.dob || "Not Added"}</p>
                        )}
                    </div>
                </div>

                <div className='flex flex-col gap-2'>
                    <p className='text-gray-500 underline'>Address Information</p>
                    <div className='flex flex-col gap-2 mt-3'>
                        {isEdit ? (
                            <div className='flex flex-col gap-2'>
                                <input
                                    className='bg-gray-50 border p-2 w-full'
                                    placeholder='Address Line 1'
                                    type="text"
                                    value={formData.address.line1}
                                    onChange={(e) => setFormData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))}
                                />
                                <input
                                    className='bg-gray-50 border p-2 w-full'
                                    placeholder='Address Line 2'
                                    type="text"
                                    value={formData.address.line2}
                                    onChange={(e) => setFormData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))}
                                />
                            </div>
                        ) : (
                            <div className='text-gray-500'>
                                <p>{userData.address.line1 || "No Address Added"}</p>
                                <p>{userData.address.line2}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className='mt-10'>
                {isEdit ? (
                    <button
                        className='bg-[var(--theme-primary)] text-white px-8 py-2 rounded-full hover:bg-[var(--theme-primary-dark)] transition-all'
                        onClick={handleUpdate}
                    >
                        Save Information
                    </button>
                ) : (
                    <button
                        className='border border-[var(--theme-primary)] px-8 py-2 rounded-full hover:bg-[var(--theme-soft)] transition-all'
                        onClick={() => {
                            setFormData({
                                name: userData.name,
                                phone: userData.phone,
                                address: { ...userData.address },
                                gender: userData.gender,
                                dob: userData.dob
                            })
                            setIsEdit(true)
                        }}
                    >
                        Edit
                    </button>
                )}
            </div>
        </div>
    )
}

export default Profile
