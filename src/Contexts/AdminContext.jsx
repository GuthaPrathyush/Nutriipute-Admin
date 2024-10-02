import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AdminContext = createContext(null);
// axios.defaults.withCredentials = true;

function AdminContextProvider(props) {
    const [products, setProducts] = useState([]);
    const [section, setSection] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [productToModify, setProductToModify] = useState(null);
    useEffect(() => {
        async function fetchProducts() {
            if(!localStorage.getItem('auth-token')) {
                setProducts([]);
                setLoaded(true);
            }
            let responseData = null;
            await axios.post('http://localhost:3000/getAllProducts', null, {
                    headers: {
                        Accept: 'application/form-data',
                        'auth-token': localStorage.getItem('auth-token')
                    }
                }
            ).then((response) => responseData = response.data.Products).catch((error) => {
                responseData = []; 
                if(error.response.data.errors === "Invalid Admin") {
                    localStorage.removeItem('auth-token'); 
                    window.location.replace('/')
                }
            });
            responseData.forEach((s) => {
                setSection((sectionCopy) => [...sectionCopy, s[0].Section]);
            });
            setProducts(responseData);
            setLoaded(true);
        }
        fetchProducts();
    }, []);
    async function deleteProduct(product) {
        let deleteError;
        await axios.post('http://localhost:3000/deleteImg', JSON.stringify({imageURL: product.Image}), {
            headers: {
                Accept: 'application/form-data',
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('auth-token')
            }
        }).then(response => deleteError = response.data).catch((error) => {
            deleteError = error.response.data;
            if(deleteError.errors === "Invalid Admin") {
                localStorage.removeItem('auth-token'); 
                window.location.replace('/')
            }
        });
        // console.log(deleteError.success);
        if(!deleteError.success) {
            return deleteError;
        }
        else {
            await axios.post('http://localhost:3000/deleteProduct', JSON.stringify({product_id: product.product_id, Domain: product.Section}), {
                headers: {
                    Accept: 'application/form-data',
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('auth-token')
                }
            }).then(response => deleteError = response.data).catch(error => {
                deleteError = error.response.data;
                if(deleteError.errors === "Invalid Admin") {
                    localStorage.removeItem('auth-token'); 
                    window.location.replace('/')
                }
            });
            if(deleteError.success) {
                setProducts(prevProductsArray => {
                    const updatedArray = prevProductsArray.map(subarray => {
                        if (subarray.length > 0 && subarray[0].Section === product.Section) {
                        const updatedSubarray = subarray.filter(item => item.product_id !== product.product_id);
                        return updatedSubarray.length > 0 ? updatedSubarray : null;
                        }
                        return subarray;
                    }).filter(subarray => subarray !== null && subarray.length > 0);
                    return updatedArray;
                });
                setSection(prevSection => prevSection.filter(item => item != product.Section));
            }
            return deleteError;
        }
    }
    const contextValue = {products, section, loaded, setProducts, setSection, deleteProduct, productToModify, setProductToModify};
    return(
        <AdminContext.Provider value={contextValue}>
            {props.children}
        </AdminContext.Provider>
    );
}

export default AdminContextProvider;