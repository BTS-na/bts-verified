import React from 'react';

// Define the payment methods logic
const getPaymentMethods = (location: string) => {
  if (location === 'Toronto') {
    return ['Interac'];
  } else {
    return ['Cash App', 'Chime'];
  }
};

interface ReservationDrawerProps {
  location: string;
}

export const ReservationDrawer: React.FC<ReservationDrawerProps> = ({ location }) => {
  const paymentMethods = getPaymentMethods(location);

  return (
    <div>
      <h1>Reservation Drawer</h1>
      <h2>Available Payment Methods:</h2>
      <ul>
        {paymentMethods.map(method => (
          <li key={method}>{method}</li>
        ))}
      </ul>
    </div>
  );
};