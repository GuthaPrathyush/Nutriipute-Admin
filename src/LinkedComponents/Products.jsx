import { HashRouter, Link } from 'react-router-dom';
import '../stylesheets/products.css';
import { useContext } from 'react';
import { AdminContext } from '../Contexts/AdminContext';
import Section from './Section';

function Products() {
    const { products } = useContext(AdminContext);

    return(
        <div className="Products">
            <Link className="addProducts" to='/addProduct'>
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