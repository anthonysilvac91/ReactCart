import { useEffect, useState, useMemo } from 'react'
import { db } from '../Data/db'

export const useCart = () => {

    const initialCart = () =>{
        const localStorageCart = localStorage.getItem('cart')

        return localStorageCart ? JSON.parse(localStorageCart) : []
    }
    
    const [data] = useState (db)
    const [cart, setCart] = useState (initialCart)

    const MAX_ITEM = 5 // prueba para limitar segun stock

    useEffect ( () =>{
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart])

    const addToCart = (item) =>{

        const itemExists = cart.findIndex (guitar => guitar.id === item.id)
        if (itemExists >= 0){// existe en el carrito
            if(cart[itemExists].quantity >= MAX_ITEM) return
            const updateCart = [...cart] // crea una copia para no mutar el state 
            updateCart[itemExists].quantity++
            setCart(updateCart)
        }else{
            item.quantity = 1
            setCart ([...cart, item])
        }

        
    }

    const removeFromCart = (id) =>{
        setCart(prevCart => prevCart.filter(guitar => guitar.id !== id))

    }

    const increaseQuantity = (id) =>{
        const updateCart = cart.map( item =>{
            if(item.id === id && item.quantity < MAX_ITEM){
                return{
                    ...item,
                    quantity: item.quantity +1
                }
            }
            return item
        })

        setCart(updateCart)

    }

    const decreaseQuantity = (id) =>{
        const updateCart = cart.map(item => {
            if(item.id === id && item.quantity > 1) {
                return {
                    ...item,
                    quantity: item.quantity -1
                }
            }
            return item
        })
        setCart(updateCart)

    }

    const clearCart = () =>{
        setCart([])
    }

    const isEmpty = useMemo( () => cart.length === 0, [cart] ) 
    const cartTotal = useMemo( () => cart.reduce( (total, item) => total + (item.quantity * item.price), 0), [cart])

    return {
        data,
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        isEmpty,
        cartTotal
    }

}


