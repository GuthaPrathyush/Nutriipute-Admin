import { Link } from "react-router-dom";
import Logo from "../assets/Logo.png";
import { useState } from "react";
import '../stylesheets/nav.css';

function NavBar() {
    const [searchText, setSearchText] = useState("");
    const handleSearchBar = (e) => {
        setSearchText(e.target.value);
    } 
    const searchItem = (e) => {
        if(e.keyCode === 13) {
            if(searchText.trim() !== '') {
                navigate(`/Search/${searchText.replace(/ /g, "_")}`);
            }
            setSearchText('');
        }
    }
    const searchItemBtn = () => {
        if(searchText.trim() !== '') {
            navigate(`/Search/${searchText.replace(/ /g, "_")}`);
        }
        setSearchText('');
    } 
    return (
        <nav>
            <Link className='Logo' to="/" onClick={() => window.scrollTo(0, 0)}>
                <img src={Logo} alt="Nutriipute" />
            </Link>
            <div className='Search'>
                <input type="text" value={searchText} onKeyDown={(e) => searchItem(e)} onChange={(e) => handleSearchBar(e)}/>
                <div onClick={searchItemBtn}>
                    <i className="fa-solid fa-magnifying-glass"></i>
                </div>
            </div>
            <Link className="products" to='/products'>
                <p>My</p>
                <p>Products</p>
            </Link>
            {!localStorage.getItem('auth-token')? <Link className="login" to='/login'>
                <i className="fa-solid fa-right-to-bracket"></i>
            </Link>: <Link className="login" onClick={() => {localStorage.removeItem('auth-token'); window.location.replace('/')}}>
                <i className="fa-solid fa-power-off"></i>
            </Link>}
        </nav>
    );
}

export default NavBar