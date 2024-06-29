import Product from "./Product";
import '../stylesheets/section.css';

function Section(props) {
    const products = props.products.element;
    const index = props.products.index;
    const length = props.products['length'];
    return (
        <div className="Section">
            <h1 className="heading">{products[0].Section}</h1>
            {products.map((element, index) => 
                <Product key={index} product={element}></Product>
            )}
            {index != length-1? <hr/>: null}
        </div>
    );
}

export default Section;