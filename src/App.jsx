import { BrowserRouter, Routes, Route } from "react-router-dom";
import {Toaster} from 'react-hot-toast';
import Orders from './LinkedComponents/Orders.jsx';
import NavBar from "./LinkedComponents/NavBar.jsx";
import Products from './LinkedComponents/Products.jsx';
import Login from "./LinkedComponents/Login.jsx";
import AddProduct from "./LinkedComponents/AddProduct.jsx";
import ViewProduct from './LinkedComponents/ViewProduct.jsx';
import Error from './LinkedComponents/Error.jsx';
import EditProduct from "./LinkedComponents/EditProduct.jsx";
import { useContext } from "react";
import { AdminContext } from "./Contexts/AdminContext.jsx";
import { ClipLoader } from "react-spinners";

function App() {

    const {loaded} = useContext(AdminContext);
    if(!loaded) {
        return(
            <div className="Products">
                <div className="container" style={{flexDirection: "row", justifyContent: "center", alignItems: "center", height: "100vh"}}>
                    <ClipLoader/>
                </div>
            </div>
        );
    }
    return (
        <>
            <Toaster position="bottom-center"/>
            <BrowserRouter>
                <NavBar/>
                <Routes>
                    <Route path="/" element={window.localStorage.getItem('auth-token')?<Orders/>: <Login/>}></Route>
                    <Route path="/products" element={<Products/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/addProduct" element={<AddProduct/>}/>
                    <Route path="/editProduct" element={<EditProduct/>}/>
                    <Route path="/:product_id" element={<ViewProduct/>}/>
                    <Route path='/*' element={<Error/>}></Route>
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App
