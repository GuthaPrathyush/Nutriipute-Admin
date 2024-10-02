import { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminContext } from "../Contexts/AdminContext";
import Error from './Error.jsx';
import '../stylesheets/viewProduct.css';
import {toast} from 'react-hot-toast';

function ViewProduct() {
    if(!localStorage.getItem('auth-token')) {
        window.location.replace('/');
    }
    const {products, deleteProduct, setProductToModify} = useContext(AdminContext);
    const {product_id} = useParams();
    const index = product_id.indexOf('-');
    const navigate = useNavigate();
    async function deleteProductHelper(product) {
        let res;
        await deleteProduct(product).then(response => res = response);
        if(res.success) {
            toast.success(res.notes);
        }
        else {
            toast.error(res.errors);
        }
    } 
    if(index === -1) {
        return (<Error/>);
    }
    const domain = String(product_id.substring(0, index)).replace(/_/g, ' ').toLowerCase();
    const toFindDomain = products.find((item) => item[0].Section.toLowerCase() === domain);
    if(!toFindDomain) {
        return (<Error/>);
    }
    const toFindProduct = toFindDomain.find((item) => item.product_id.toLowerCase() === product_id.toLowerCase());
    if(!toFindProduct) {
        return (<Error/>);
    }
    return (
        <div className="viewProduct">
            <div className="container">
                <div className="productImage">
                    <img src={toFindProduct.Image} alt={toFindProduct.Name} />
                </div>
                <div className="productDetails">
                    <h1>{toFindProduct.Name}</h1>
                    <p>{toFindProduct.Description}</p>
                    <div className="Macro">
                        <h3>Nutritional Information</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Nutrients</th>
                                    <th>per 100gms</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(toFindProduct.Macro).map(([key, value]) => 
                                    <tr key={key}>
                                        <td>{key}</td>
                                        <td>
                                            {value} {key === "Energy"? "kcal": "g"}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="editingAndDeleting">
                        <button className="editProductBtn" onClick={() => {setProductToModify(toFindProduct); window.scroll(0, 0); navigate('/editProduct')}}>Edit</button>
                        <button className="deleteProduct" onClick={() => {deleteProductHelper(toFindProduct)}}>Delete</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewProduct;