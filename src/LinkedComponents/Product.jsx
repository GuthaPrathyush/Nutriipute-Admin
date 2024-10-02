import {Link, useNavigate} from 'react-router-dom';
import '../stylesheets/product.css';
import { useContext } from 'react';
import { AdminContext } from '../Contexts/AdminContext';
import {toast} from 'react-hot-toast';

function Product(props) {
    const product = props.product;
    const {deleteProduct, setProductToModify} = useContext(AdminContext);
    const navigate = useNavigate();
    async function deleteProductHelper() {
        let res;
        await deleteProduct(product).then(response => res = response);
        if(res.success) {
            toast.success(res.notes);
        }
        else {
            toast.error(res.errors);
        }
    }       
    return (
        <div className="Product">
            <Link className='productImage' to={`/${product.product_id}`} onClick={() => window.scroll(0, 0)}>
                <img src={product.Image} alt={product.Name} />
            </Link>
            <h3>{product.Name}</h3>
            <Link className='changeButton' to='/editProduct' onClick={() => {setProductToModify(product); window.scroll(0, 0)}}>Edit</Link>
            <button className='changeButton' onClick={deleteProductHelper}>Delete</button>
        </div>
    );
}

export default Product;