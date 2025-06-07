import { createContext,useContext,useEffect, useState } from 'react';
import { useAuth } from './context/useauth';


type CartProduct = {
  productid: string;
  quantity: number;
};

type CartItem = {
  userid: string;
  items: CartProduct[];
};
interface CartContextType{
    cart: CartProduct[],
    total:number,
    addToCart:(productid: string, quantity: number)=>void,
    removeFromCart:(productid: string)=>void,

}
export const CartContext = createContext<CartContextType | undefined>(undefined);
export function useCart(userId: string) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [total,setTotal]=useState<number>(0)

  // Load cart from localStorage on first mount
  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) {
      try {
        
        setCart(JSON.parse(stored));
      } catch (err) {
        console.error('Failed to parse cart from localStorage:', err);
        setCart([]);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    const myuserCartItems = cart.find((c) => c.userid === userId)?.items || [];
    const totalquantity = myuserCartItems.reduce((total, item) => total + item.quantity, 0);
    setTotal(totalquantity)
    localStorage.setItem('cart', JSON.stringify(cart));

  }, [cart,userId]);

    // Add or update product in cart
  const addToCart = (productid: string, quantity: number) => {
     setCart((prevCart) => { 
      const userExists = prevCart.some((c) => c.userid === userId);
       if (!userExists) {
         return [... prevCart, { userid: userId, items: [{ productid, quantity }], }];
        } 
      return prevCart.map((userCart) => { 
        if (userCart.userid !== userId) 
          return userCart; 
        
        const itemExists = userCart.items.some((item) => item.productid === productid); 
        const updatedItems = itemExists ? userCart.items.map((item) => item.productid === productid ? { 
          
          ... item,  quantity: Math.max(0, item.quantity + quantity) } : item ) : [... userCart.items, { productid, quantity }]; 
          return { ... userCart, items: updatedItems }; }); }); };

  // Remove product from cart
  const removeFromCart = (productid: string) => {
    setCart((prevCart) => {
      const newCart = prevCart.map((userCart) => {
        if (userCart.userid === userId) {
          return {
            ...userCart,
            items: userCart.items.filter((item) => item.productid !== productid),
          };
        }
        return userCart;
      });

      return newCart;
    });
  };

  // Get just the items for this user
  const userCartItems = cart.find((c) => c.userid === userId)?.items || [];
  
  return {
    cart: userCartItems,
    total:total,
    addToCart,
    removeFromCart,
  };
}
createContext<ReturnType<typeof useCart> | null>(null);
export const CartProvider = ({ children }: { children: React.ReactNode }) => { 
  let { userid } = useAuth();
  const cart = useCart(userid);
   return <CartContext.Provider value={cart}>{children}</CartContext.Provider>; }; 
export const useCartContext = () => { const context = useContext(CartContext); 
  if (!context) throw new Error('useCartContext must be used within a CartProvider'); 
  return context; };

  // const addToCart0 = (productid: string, quantity: number) => {
  //   console.log("aadded");
  //   setCart((prevCart) => {
  //     return prevCart.map((userCart) =>
  //       userCart.userid === userId
  //         ? {
  //             ...userCart,
  //             items: userCart.items.map((item) =>
  //               item.productid === productid
  //                 ? { ...item, quantity: item.quantity + quantity }
  //                 : item
  //             ),
  //           }
  //         : userCart
  //     );
  //   });
  // };
  // const addToCart1 = (productid: string, quantity: number) => {
  //   console.log('aadded')
  //   setCart((prevCart) => {
  //     const newCart = [...prevCart];
  //     let userCart = newCart.find((c) => c.userid === userId);

  //     if (!userCart) {
  //       userCart = { userid: userId, items: [] };
  //       newCart.push(userCart);
  //     }
  //     const product = userCart.items.find((item) => item.productid === productid);
  //     if (product) {
  //       product.quantity += quantity;
  //     } else {
  //       userCart.items.push({ productid, quantity });
  //     }

  //     return newCart;
  //   });
  // };