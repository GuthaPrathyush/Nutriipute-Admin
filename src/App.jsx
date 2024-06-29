import { BrowserRouter, Routes, Route } from "react-router-dom";
import {Toaster} from 'react-hot-toast';
import Orders from './LinkedComponents/Orders.jsx';
import NavBar from "./LinkedComponents/NavBar.jsx";
import Products from './LinkedComponents/Products.jsx';
import Login from "./LinkedComponents/Login.jsx";
import AddProduct from "./LinkedComponents/AddProduct.jsx";
import ViewProduct from './LinkedComponents/ViewProduct.jsx';
import Error from './LinkedComponents/Error.jsx';

function App() {

    return (
        <>
            <Toaster position="bottom-center"/>
            <BrowserRouter>
                <NavBar/>
                <Routes>
                    <Route path="/" element={<Orders/>}></Route>
                    <Route path="/products" element={<Products/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/addProduct" element={<AddProduct/>}/>
                    <Route path="/:domain/:productName" element={<ViewProduct/>}/>
                    <Route path='/*' element={Error}></Route>
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App
