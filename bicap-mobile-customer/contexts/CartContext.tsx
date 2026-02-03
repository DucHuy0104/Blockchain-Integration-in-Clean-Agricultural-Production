// contexts/CartContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CartItem {
    id: number;
    productId: number;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    unit: string;
    farmName: string;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (product: any, quantity: number) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    totalAmount: number;
    itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = async () => {
        try {
            const storedCart = await AsyncStorage.getItem('cartItems');
            if (storedCart) {
                setCartItems(JSON.parse(storedCart));
            }
        } catch (error) {
            console.error('Error loading cart:', error);
        }
    };

    const saveCart = async (items: CartItem[]) => {
        try {
            await AsyncStorage.setItem('cartItems', JSON.stringify(items));
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    };

    const addToCart = (product: any, quantity: number) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.productId === product.id);
            let newItems;
            if (existingItem) {
                newItems = prevItems.map(item =>
                    item.productId === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                newItems = [...prevItems, {
                    id: Date.now(), // Local ID for cart item
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: quantity,
                    image: product.image,
                    unit: product.unit || 'kg',
                    farmName: product.farm?.name || 'Vườn nhà'
                }];
            }
            saveCart(newItems);
            return newItems;
        });
    };

    const removeFromCart = (productId: number) => {
        setCartItems(prevItems => {
            const newItems = prevItems.filter(item => item.productId !== productId);
            saveCart(newItems);
            return newItems;
        });
    };

    const updateQuantity = (productId: number, quantity: number) => {
        if (quantity < 1) return;
        setCartItems(prevItems => {
            const newItems = prevItems.map(item =>
                item.productId === productId ? { ...item, quantity } : item
            );
            saveCart(newItems);
            return newItems;
        });
    };

    const clearCart = () => {
        setCartItems([]);
        saveCart([]);
    };

    const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            totalAmount,
            itemCount
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
