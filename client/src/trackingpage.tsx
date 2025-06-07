import './tracking.css';
import { getOrders,patchOrder,sendReview } from './api/orders';
import { useAuth } from './context/useauth';
import { useMutation, useQueryClient,useQuery } from '@tanstack/react-query';
import Navbar from './Navbar';
import { Tracking,Order,Role } from './data';
import { useState,useEffect } from 'react';

enum status{
  pending='pending',
  delivered='delivered',
  all='all'
}
function TrackingPage(){
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewOrder, setReviewOrderId] = useState<Order>();
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [statusfilter, setStatus]=useState<status>(status.pending)
  const {userRole}=useAuth()
  const isfarmer=userRole==Role.farmer
  const queryClient = useQueryClient();

const { mutate: updateOrderStatus } = useMutation({
  mutationFn: ({ orderId, newStatus }: { orderId: string;  newStatus: Tracking}) =>
    patchOrder(orderId, newStatus),

  // Optimistically update the cache
  onMutate: async ({ orderId, newStatus }) => {
    await queryClient.cancelQueries({ queryKey: ['orders'] });

    const previousOrders = queryClient.getQueryData<Order[]>(['orders']);
    // Optimistic update
    queryClient.setQueryData<Order[]>(['orders'], (oldOrders) =>
      oldOrders?.map((order) =>
        order.id === orderId ? { ...order, tracking: newStatus } : order
      ) || []
    );

    return { previousOrders };
  },

  // Rollback on error
  onError: (err, variables, context) => {
    if (context?.previousOrders) {
      queryClient.setQueryData(['orders'], context.previousOrders);
    }
  },
  onSuccess: (_, ) => {
  queryClient.invalidateQueries({ queryKey: ['orders'] });

},


});


  const {
        data: orders,
        isLoading,
        error,
      } = useQuery({
        queryKey: ['orders'],
        queryFn: () => getOrders(),
        staleTime: 1000 * 10 ,
      });
    
    if (isLoading) return <p>Loading...</p>;
    if (error instanceof Error) return <p>{error.message}</p>;
    if (!orders) return <p>No orders to display</p>;

    const statuses: Tracking[] = [
      Tracking.PACKING,
      Tracking.PACKED,
      Tracking.ENROUTE,
      Tracking.DELIVERED,
    ];
    const [myorders, missingReviewIds] = Array.isArray(orders) && orders.length === 2
  ? orders
  : [[], []];

  let values:Order[];
  const getStatusIndex = (status:Tracking) => statuses.indexOf(status);
  const pendingorders = myorders.filter((order) => order.tracking !== Tracking.DELIVERED);
  const delivered = myorders.filter((order) => order.tracking === Tracking.DELIVERED);
  if(statusfilter=='pending'){values=pendingorders}
  else if (statusfilter=='delivered'){values=delivered}
  else {values=myorders}
 
useEffect(() => {
  if (!isfarmer && delivered.length > 0 && !showReviewModal && missingReviewIds.length > 0) {
    const orderToReview = delivered.find(order => missingReviewIds.includes(order.id));
    if (orderToReview) {
      setReviewOrderId(orderToReview);
      setShowReviewModal(true);
    }
  }
}, [isfarmer, delivered, showReviewModal, missingReviewIds]);


  function handlefilter(status:status){
    setStatus(status)
  }
function handleStatusChange(orderId: string, newStatus: Tracking) {
  updateOrderStatus({ orderId, newStatus });
}
async function handleSubmitReview() {
  if (!reviewOrder || rating === 0) return;

  try {
    await sendReview({
      orderId: reviewOrder.id,
      rating,
      comment,
    });

    setShowReviewModal(false);
    setRating(0);
    setComment('');
    alert('success! review submitted successfully')
    queryClient.invalidateQueries({ queryKey: ['orders'] });
  } catch (err) {
    console.error('Failed to submit review:', err);
  }
}

  return (
    <div className='full-container'><Navbar/>
    <div className='button-group'>
    <button className='filter-button' onClick={()=>handlefilter(status.delivered)}>Past orders</button>
    <button className='filter-button' onClick={()=>handlefilter(status.pending)}>Pending orders</button>
    <button className='filter-button' onClick={()=>handlefilter(status.all)}>All orders</button></div>
    <div className="tracking-page">
      <h2>Order Tracking:{statusfilter} orders</h2>
    {values.length==0 && <p>This list is empty</p>}
      
      {values.map((order) => {
        const currentStep = getStatusIndex(order.tracking);
        return (
          <div key={order.id} className="order-tracking">
            <p><strong>Product:</strong> {order.product.name}</p>
            <p><strong>Customer Type:</strong> {order.customertype}</p>
            <p><strong>Buyer:</strong> {order.user.firstname || 'N/A'}</p>
            <p><strong>Farmer:</strong> {order.farmer.firstname}</p>
            <p><strong>Delivery Option:</strong> {order.deliveryoption}</p>
            <p><strong>Quantity: </strong>{order.totalcost/order.product.priceperunit} {order.product.unit}</p>
            <p><strong>Total Cost:</strong> KES {order.totalcost}</p>
            <p><strong>Delivery:</strong> {order.deliveryoption}</p>
            <p><strong>Order Date: </strong>{new Date(order.createdAt).toDateString()}</p>
            

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
            {isfarmer&&(<>Please select your current status
            <div className="progress-button-container">
              {statuses.map((status, idx) => {
                const isCompleted = idx < currentStep;
                const isCurrent = idx === currentStep;

                return (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(order.id, status)}
                    className={`
                      progress-button 
                      ${isCompleted ? 'completed' : ''}
                      ${isCurrent ? 'current' : ''}
                    `}
                  >
                    {status}
                  </button>
                );
              })}
            </div></>)}
          </div>
        );
      })}
    </div>
    {!isfarmer && showReviewModal&&reviewOrder	 && (
  <div className="modal-backdrop">
    <div className="modal">
      <h3>Please take some time to review the product</h3>
      <p>Product: {reviewOrder.product.name}</p>
      <p>Quantity: {reviewOrder.totalcost/reviewOrder.product.priceperunit} {reviewOrder.product.unit}</p>
      <p>Ordered on: {new Date(reviewOrder.createdAt).toDateString()}</p>
      <p>order id: {reviewOrder.id}</p>

      <div className="stars">
        Rate out of 5{[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            onClick={() => setRating(n)}
            className={n <= rating ? 'star active' : 'star'}
          >
            ★
          </span>
        ))}
      </div>

      <textarea
        placeholder="Leave a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <div className="modal-buttons">
        <button className="submit-button" onClick={handleSubmitReview}>Submit</button>
        <button className="cancel-button" onClick={() => setShowReviewModal(false)}>Review Later</button>
      </div>
    </div>
  </div>
)}
</div>
  );
};

export default TrackingPage;
