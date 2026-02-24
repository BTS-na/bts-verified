import React, { useState } from 'react';

const ReservationDrawer = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        quantity: '',
        city: '',
        orderId: '',
        total: ''
    });
    const [successState, setSuccessState] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/reserve', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (response.ok) {
                setSuccessState({
                    orderId: data.orderId,
                    paymentInfo: data.paymentInfo, // assuming payment info is included in response
                });
            } else {
                // Handle error response
                console.error(data);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
                <input type="number" name="quantity" placeholder="Quantity" value={formData.quantity} onChange={handleChange} required />
                <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} required />
                <button type="submit">Reserve</button>
            </form>
            {successState && (
                <div>
                    <h2>Reservation Successful!</h2>
                    <p>Order ID: {successState.orderId}</p>
                    <p>Payment Info: {successState.paymentInfo}</p>
                </div>
            )}
        </div>
    );
};

export default ReservationDrawer;
