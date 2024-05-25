import { useEffect, useState } from 'react'
import Header from './Components/Header'
import Guitar from './Components/Guitar'
import { db } from './Data/db'


function App() {

    const initialCart = () =>{
        const localStorageCart = localStorage.getItem('cart')

        return localStorageCart ? JSON.parse(localStorageCart) : []
    }
    
    const [data, setData] = useState (db)
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

   

  return (
    <>
    <Header
        cart = {cart}
        removeFromCart = {removeFromCart}
        increaseQuantity = {increaseQuantity}
        decreaseQuantity = {decreaseQuantity}
        clearCart = {clearCart}
    />
    
    <main className="container-xl mt-5">
        <h2 className="text-center">Nuestra Colección</h2>
        <div className="row mt-5">
            {data.map((guitar,id)=>{
                return(
                    <Guitar
                    key={id}
                    guitar = {guitar}
                    addToCart = {addToCart}
                    />
                )
            })}
            
        </div>
    </main>


    <footer className="bg-dark mt-5 py-5">
        <div className="container-xl">
            <p className="text-white text-center fs-4 mt-4 m-md-0">GuitarLA - Todos los derechos Reservados</p>
        </div>
    </footer>
    </>
  )
}

export default App
