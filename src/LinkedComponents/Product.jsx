import {Link} from 'react-router-dom';
import '../stylesheets/product.css';

function Product(props) {
    const product = props.product;
    return (
        <div className="Product">
            <Link className='productImage' to={`/${product.Domain}`}>
                <img src={product.Image} alt={product.Name} />
            </Link>
            <h3>{product.Name}</h3>
            <Link className='changeButton'>Edit</Link>
            <button className='changeButton'>Delete</button>
        </div>
    );
}

export default Product;