import React, { useState } from 'react';

const ReservationDrawer = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [orderId, setOrderId] = useState(null);
    const [total, setTotal] = useState(0);
    const [city, setCity] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/reserve', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fullName, email, phone, quantity, city, orderId, total }),
            });
            const data = await response.json();
            if (response.ok) {
                setOrderId(data.orderId);
                setTotal(data.total);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Something went wrong, please try again.');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type='text' placeholder='Full Name' value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                <input type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type='tel' placeholder='Phone' value={phone} onChange={(e) => setPhone(e.target.value)} required />
                <input type='number' min='1' value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
                <input type='text' placeholder='City' value={city} onChange={(e) => setCity(e.target.value)} required />
                <button type='submit'>Reserve</button>
            </form>
            {error && <p>{error}</p>}
            {orderId && (<div>
                <h2>Success!</h2>
                <p>Order ID: {orderId}</p>
                <p>Payment Info: {city === 'Toronto' ? 'Interac' : 'Cash App/Chime'}</p>
            </div>)}
        </div>
    );
};

export default ReservationDrawer;