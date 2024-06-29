import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AdminContext = createContext(null);

function AdminContextProvider(props) {
    const [products, setProducts] = useState([]);
    const [section, setSection] = useState([]);
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        async function fetchProducts() {
            let responseData = null;
            await axios.post('http://localhost:3000/getAllProducts', {token: "Your auth-token"}, 
                {
                    Accept: 'application/form-data',
                    'Content-Type': 'application/json' 
                }
            ).then((response) => responseData = response.data.Products).catch((error) => responseData = []);
            responseData.forEach((s) => {
                setSection((sectionCopy) => [...sectionCopy, s[0].Section]);
                s.forEach((ps) => {
                    ps.Domain = ps.Section.replace(/ /g, '_') + '/' + ps.Name.replace(/ /g, '_');
                });
            });
            setProducts(responseData);
            setLoaded(true);
        }
        fetchProducts();
    }, []);
    const contextValue = {products, section, loaded, setProducts, setSection};
    return(
        <AdminContext.Provider value={contextValue}>
            {props.children}
        </AdminContext.Provider>
    );
}

export default AdminContextProvider;