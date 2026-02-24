import React from 'react';

interface ReservationDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    item: {
        fullName: string;
        email: string;
        phone: string;
        quantity: number;
    };
}

export const ReservationDrawer = ({ open, onOpenChange, item }: ReservationDrawerProps) => {
    const [city, setCity] = React.useState('');
    const [orderId, setOrderId] = React.useState('');
    const [total, setTotal] = React.useState(0);
    const handleSubmit = async () => {
        // handle API call and payload structure
        const payload = { ...item, city, orderId, total };
        // Make API call here
    };

    return (
        <div>
            <h2>Reservation</h2>
            <form onSubmit={handleSubmit}>
                <input type='text' value={item.fullName} placeholder='Full Name' />
                <input type='email' value={item.email} placeholder='Email' />
                <input type='tel' value={item.phone} placeholder='Phone' />
                <input type='number' value={item.quantity} placeholder='Quantity' />
                {/* Other fields if needed */}
                <button type='submit'>Submit</button>
            </form>
            {/* Success state display based on city */}
            {orderId && <div>Your Order ID: {orderId} - Payment via {city === 'Toronto' ? 'Interac' : 'Cash App/Chime'}</div>}
        </div>
    );
};
