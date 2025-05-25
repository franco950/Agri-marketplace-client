import './tracking.css';
import { getOrders } from './api/orders';
import { useQuery } from '@tanstack/react-query';
import Navbar from './Navbar';
function TrackingPage(){
  const {
        data: orders,
        isLoading,
        error,
      } = useQuery({
        queryKey: ['orders'],
        queryFn: () => getOrders(),
        staleTime: 1000 * 60 * 5,
      });
    
    if (isLoading) return <p>Loading...</p>;
    if (error instanceof Error) return <p>{error.message}</p>;
    if (!orders||orders.length===0) return <p>No orders to display</p>;

    
  
const statuses = ['PACKING', 'PACKED','ENROUTE','DELIVERED']

const getStatusIndex = (status: string) => statuses.indexOf(status);

  return (
    <><Navbar/>
    <div className="tracking-page">
      <h2>Order Tracking</h2>
      {orders.map((order) => {
        const currentStep = getStatusIndex(order.tracking);

        return (
          <div key={order.id} className="order-tracking">
            <p><strong>Product:</strong> {order.product.name}</p>
            <p><strong>Customer Type:</strong> {order.customertype}</p>
            <p><strong>Buyer:</strong> {order.user.firstname || 'N/A'}</p>
            <p><strong>Farmer:</strong> {order.farmer.firstname}</p>
            <p><strong>Delivery Option:</strong> {order.deliveryoption}</p>
            <p><strong>Total Cost:</strong> KES {order.totalcost}</p>

            <div className="progress-labels-container">
              {statuses.map((status, idx) => (
                <div
                  key={status}
                  className={`progress-label ${idx === currentStep ? 'current-status' : ''}`}
                >
                  {status}
                </div>
              ))}
            </div>

            <div className="progress-bar-container">
              <div
                className="progress-bar"
                style={{ width: `${((currentStep + 1) / statuses.length) * 100}%` }}
              ></div>
             
            </div>
          </div>
        );
      })}
    </div></>
  );
};

export default TrackingPage;
