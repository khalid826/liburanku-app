import { useEffect } from 'react'; // Removed useState as it's not directly used here
import { Link as RouterLinkCart } from 'react-router-dom'; // Aliased
import { useCart as useCartPageHook } from '../../context/CartContext'; // Aliased
import Loader from '../../components/UI/Loader';
import ErrorMessage from '../../components/UI/ErrorMessage';
import { ShoppingBag, Trash2, ArrowLeft as ArrowLeftIconCart, PlusCircle, MinusCircle } from 'lucide-react'; // Aliased icon

const CartPage = () => {
  const { cartItems, loading, error, fetchCart, setError: setCartError } = useCartPageHook(); // Removed addItemToCart as it's not used here

  useEffect(() => {
    fetchCart(); // Fetch cart on component mount
  }, [fetchCart]);

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => {
        const price = item.activity?.price_discount < item.activity?.price ? item.activity?.price_discount : item.activity?.price;
        return total + (price || 0) * (item.quantity || 0);
    }, 0);
  };

  // Placeholder functions for update/delete - not implemented with API yet
  const handleUpdateQuantity = (cartId, newQuantity) => {
    console.log(`Update cart item ${cartId} to quantity ${newQuantity} - (API call not implemented)`);
    // Here you would call cartService.updateCartItem(cartId, newQuantity) and then fetchCart()
    alert("Updating quantity is not fully implemented in this version.");
  };

  const handleDeleteItem = (cartId) => {
    console.log(`Delete cart item ${cartId} - (API call not implemented)`);
    // Here you would call cartService.deleteCartItem(cartId) and then fetchCart()
    alert("Deleting item is not fully implemented in this version.");
  };


  if (loading) return <div className="flex justify-center items-center min-h-[calc(100vh-15rem)]"><Loader /></div>;
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col lg:flex-row justify-between items-center mb-8 pb-4 border-b">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 flex items-center">
          <ShoppingBag size={32} className="mr-3 text-indigo-600" /> Your Shopping Cart
        </h1>
        <RouterLinkCart to="/" className="text-blue-600 hover:underline inline-flex items-center mt-4 lg:mt-0">
            <ArrowLeftIconCart size={18} className="mr-2" /> Continue Shopping
        </RouterLinkCart>
      </div>

      {error && <ErrorMessage message={error} onClose={() => setCartError(null)} />}

      {cartItems && cartItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => {
              const activity = item.activity;
              if (!activity) { // Handle case where activity details might be missing in cart item
                return (
                    <div key={item.id || item.activityId} className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between border border-red-200">
                        <p className="text-red-600"> <AlertTriangleIcon className="inline mr-2"/> Invalid cart item data. Activity details missing.</p>
                        <button onClick={() => handleDeleteItem(item.id)} className="text-red-500 hover:text-red-700">
                            <Trash2 size={20} />
                        </button>
                    </div>
                );
              }
              const displayPrice = activity.price_discount < activity.price ? activity.price_discount : activity.price;
              return (
                <div key={item.id} className="bg-white p-4 rounded-lg shadow-md flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <img 
                    src={activity.imageUrls && activity.imageUrls.length > 0 ? activity.imageUrls[0] : 'https://placehold.co/100x100/EBF4FF/76A9FA?text=No+Image'} 
                    alt={activity.title} 
                    className="w-full sm:w-24 h-24 object-cover rounded-md flex-shrink-0"
                    onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/100x100/EBF4FF/76A9FA?text=No+Image'; }}
                  />
                  <div className="flex-grow">
                    <RouterLinkCart to={`/activity/${activity.id}`} className="text-lg font-semibold text-gray-800 hover:text-blue-600">
                      {activity.title}
                    </RouterLinkCart>
                    <p className="text-sm text-gray-500">{activity.category?.name || 'Uncategorized'}</p>
                  </div>
                  <div className="flex items-center space-x-3 flex-shrink-0">
                    {/* Quantity Control (Placeholder) */}
                    <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1} className="p-1 rounded-full hover:bg-gray-200 disabled:opacity-50">
                        <MinusCircle size={20} className="text-gray-600"/>
                    </button>
                    <span className="text-md font-medium w-8 text-center">{item.quantity}</span>
                     <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} className="p-1 rounded-full hover:bg-gray-200">
                        <PlusCircle size={20} className="text-gray-600"/>
                    </button>
                  </div>
                  <p className="text-md font-semibold text-gray-700 w-24 text-right flex-shrink-0">
                    ${(displayPrice * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <button onClick={() => handleDeleteItem(item.id)} className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 flex-shrink-0">
                    <Trash2 size={20} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-24"> {/* Sticky for larger screens */}
              <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-3">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${calculateTotalPrice().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-500">FREE</span>
                </div>
                {/* Add promo code input here later if needed */}
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-800 border-t pt-4">
                <span>Total</span>
                <span>${calculateTotalPrice().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <button 
                className="mt-8 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow-md transition-colors duration-300"
                onClick={() => alert("Proceed to Checkout - Not implemented yet!")}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      ) : (
        !loading && !error && (
          <div className="text-center py-10">
            <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
            <p className="text-xl text-gray-600 mb-2">Your cart is empty.</p>
            <p className="text-gray-500 mb-6">Looks like you haven't added any items to your cart yet.</p>
            <RouterLinkCart to="/" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors">
              Start Shopping
            </RouterLinkCart>
          </div>
        )
      )}
    </div>
  );
};

CartPage.defaultProps = {
  cartItems: [],
  loading: false,
  error: null,
};

export default CartPage;