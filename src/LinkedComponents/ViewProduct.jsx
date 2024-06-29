import { useContext } from "react";
import { useParams } from "react-router-dom";
import { AdminContext } from "../Contexts/AdminContext";
import Error from './Error.jsx';
import '../stylesheets/viewProduct.css';
import {toast} from 'react-hot-toast';

function ViewProduct() {
    const {products} = useContext(AdminContext);
    let {domain, productName} = useParams();
    domain = String(domain).replace(/_/g, ' ').toLowerCase();
    productName = String(productName).replace(/_/g, ' ').toLowerCase();
    const toFindDomain = products.find((item) => item[0].Section.toLowerCase() === domain);
    if(!toFindDomain) {
        return (<Error/>);
    }
    const toFindProduct = toFindDomain.find((item) => item.Name.toLowerCase() === productName);
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
                        <table className="styled-table">
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
                        <button className="AddToCart" onClick={() => {toast.success("Added to Cart!", {position: "top-right", style: {position: "relative", top: "70px", right: "5px"}})}}>Edit</button>
                        <button className="Buy">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewProduct;