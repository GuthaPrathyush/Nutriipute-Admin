import { HashRouter, Link } from 'react-router-dom';
import '../stylesheets/products.css';
import { useContext } from 'react';
import { AdminContext } from '../Contexts/AdminContext';
import Section from './Section';

function Products() {
    if(!localStorage.getItem('auth-token')) {
        window.location.replace('/login');
    }
    const { products } = useContext(AdminContext);
    if(products.length === 0) {
        return (
            <div className="Products">
                <div className="addProductsBigOuter">
                    <Link className='addProductsBig' to='/addProduct' onClick={() => window.scroll(0, 0)}>
                        <h1>Add Products</h1>
                        <p>add your Products here</p>
                    </Link>
                </div>
            </div>
        );
    }
    return(
        <div className="Products">
            <Link className="addProducts" to='/addProduct' onClick={() => window.scroll(0, 0)}>
                Add Product
            </Link>
            <div className="container">
                {products.map((element, index) => {
                    return (
                        <Section key={index} products={{element, index, length: products.length}}></Section>
                    );
                })}
            </div>
        </div>
    );
}

export default Products;