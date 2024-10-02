import { AdminContext } from '../Contexts/AdminContext';
import '../stylesheets/addProduct.css';
import { useState, useRef, useContext, useEffect } from 'react';
import {ClipLoader} from 'react-spinners';
import uploadImgSvg from '../assets/uploadImg.png';
import {toast} from 'react-hot-toast';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

function AddProduct() {
    const {section, loaded, products, setProducts, setSection} = useContext(AdminContext);
    const [selectedSection, setSelectedSection] = useState("New Section");
    const navigate = useNavigate();
    const productOfferInput = useRef();
    useEffect(() => {
        setSelectedSection(loaded?(section.length>0? section[0]: "New Section"): "New Section")
    }, [loaded])
    const [offerPrice, setOfferPrice] = useState(false);
    const [chosenImage, setChosenImage] = useState(null);
    const [textAreaValue, setTextAreaValue] = useState("");
    const [product, setProduct] = useState({
        product_id: "",
        Name: "", // done
        Price: "", // done
        Offer: false, // done
        Image: "", // done
        Description: "", //done
        InStock: true, //done
        Veg: true, // done
        Section: "", // done
        Domain: "", 
        Macro: {} // done
    });
    const handleVeg = (e) => {
        if(e.target.getAttribute('name') === 'Veg') {
            setProduct({ ...product, [e.target.name]: e.target.value === "true" });
        }
    }
    const handleStock = (e) => {
        if(e.target.getAttribute('name') === 'InStock') {
            setProduct({ ...product, [e.target.name]: e.target.value === "true" });
        }
    }
    const handleMacroChange = (e) => {
        const Macro = {...product.Macro, [e.target.getAttribute('name')]: String(e.target.value)};
        setProduct({...product, ['Macro']: Macro});
    }
    function handleInputChange(e) {
        setProduct({...product, [e.target.getAttribute('name')]: String(e.target.value)});
    }
    async function validateForm() {
        product.Description = textAreaValue.trim().replace(/\s+/g, ' ');
        product.Name = product.Name.trim();
        if(selectedSection == "New Section" && product.Section.trim() == "") {
            toast.error("Please fill the Product Section or choose an existing one");
            return ;
        }
        else if(selectedSection == "New Section") {
            product.Domain = product.Section.trim().replace(/ /g, '_') + '/' + product.Name.replace(/ /g, '_');
        }
        else if(selectedSection != "New Section") {
            product.Section = selectedSection;
            product.Domain = product.Section.trim().replace(/ /g, '_') + '/' + product.Name.replace(/ /g, '_');
        }
        if(product.Name.trim() === "" || product.Price === "" || product.Description === "") {
            toast.error("Please fill empty fields");
        }
        else if(offerPrice && product.Offer === "") {
            toast.error("Please fill the Offer price or disable the Offer");
        }
        else if(offerPrice && (Number(product.Offer) >= Number(product.Price) || Number(product.Offer) < 0)) {
            toast.error("Please make sure that the offered price is less than the original price");
        }
        else if(!product.Macro.Proteins || !product.Macro.Energy || !product.Macro.Fats || !product.Macro.Carbs || product.Macro.Proteins === "" || product.Macro.Fats === "" || product.Macro.Carbs === "" || product.Macro.Energy === "") {
            toast.error("Please fill Macros");
        }
        else if(!chosenImage) {
            toast.error("Please upload an image");
        }
        else {
            const imageForm = new FormData()
            imageForm.append("product", chosenImage);
            let uploaded = null;
            const imageUpload = axios.post('http://localhost:3000/uploadImg', imageForm, {
                headers: {
                    Accept: 'application/form-data',
                    'auth-token': localStorage.getItem('auth-token')
                }
            });
            await toast.promise(
                imageUpload,
                {
                    loading: "uploading Image",
                    success: response => {
                        product.Image = response.data.imageURL;
                        uploaded = true;
                        return (<span>Image Uploaded successfully!</span>);
                    },
                    error: error => {
                        uploaded = false;
                        return (<span>failed to Upload Image, Please try again!</span>)
                    }
                }
            )
            if(uploaded) {
                const productUpload = axios.post('http://localhost:3000/uploadProduct', JSON.stringify(product), {
                    headers: {
                        Accept: 'application/form-data',
                        'Content-Type': 'application/json',
                        'auth-token': localStorage.getItem('auth-token')
                    }
                });
                toast.promise(
                    productUpload,
                    {
                        loading: "Adding Product...",
                        success: response => {
                            product.product_id = response.data.product_id;
                            setProducts(prevProductsArray => {
                                // Find the subarray that matches the product's section
                                let sectionFound = false;
                                const updatedArray = prevProductsArray.map(subarray => {
                                    if (subarray.length > 0 && subarray[0].Section === product.Section) {
                                        sectionFound = true;
                                        return [...subarray, product];
                                    }
                                    return subarray;
                                });
                    
                                // If no matching section is found, create a new subarray for the section
                                if (!sectionFound) {
                                    setSection([...section, product.Section]);
                                    return [...updatedArray, [product]];
                                }
                    
                                return updatedArray;
                            });
                            navigate('/products');
                            return (<span>{response.data.notes}</span>);
                        },
                        error: error => (<span>{error.response.data.notes}</span>)
                    }
                );
            }
        }
    }
    if(!loaded) {
        return (
            <div className="addProduct">
                <div className="container">
                    <ClipLoader />
                </div>
            </div>
        );
    }
    if(!localStorage.getItem('auth-token')) {
        window.location.replace('/login');
    }
    return (
        <div className="addProduct">
            <div className="container">
                <div className="productForm">
                    <div className='formInput'>
                        <label htmlFor="Name">Product Name</label>
                        <input type="text" id="Name" name="Name" onChange={handleInputChange}/>
                    </div>
                    <div className='formInputTwo'>
                        <div className='formInput'>
                            <label htmlFor="Price">Product Price</label>
                            <input placeholder='Enter a price in ₹' type="number" id="Price" name="Price" onChange={handleInputChange}/>
                        </div>
                        <div className='formInput'>
                            <div className="offerPriceContainer">
                                <label htmlFor="offerPriceCheck">Offer Price</label>
                                <input type="checkbox" id="offerPriceCheck" checked={offerPrice} onChange={(e) => {setOfferPrice(e.target.checked); e.target.checked? product.Offer = productOfferInput.current.value: product.Offer = false}}/>
                            </div>
                            <input ref={productOfferInput} placeholder='Enter a price in ₹' type="number" id="Offer" name="Offer" disabled={!offerPrice} onChange={handleInputChange}/>
                        </div>
                    </div>
                    <div className='formInput'>
                        <label htmlFor="Description">Product Description</label>
                        <textarea name="Description" id="Description" value={textAreaValue} onChange={(e) => {setTextAreaValue(e.target.value)}}></textarea>
                    </div>
                    <div className='formInput'>
                        <label htmlFor="Section">Product Section</label>
                        <div className='sectionSelection'>
                            <select value={selectedSection} name="Section" id="Section" onChange={(e) => setSelectedSection(e.target.value)}>
                                {section.map((element, index) => {
                                    return <option key={index} value={element}>{element}</option>
                                })}
                                <option value="New Section">New Section</option>
                            </select>
                            <input type="text" disabled={selectedSection !== "New Section"} name="Section" onChange={handleInputChange}/>
                        </div>
                    </div>
                    <div className="formInputTwo">
                        <div className="formInput">
                            <label htmlFor="yesVeg">Vegetarian</label>
                            <div className="radioGroup" onChange={handleVeg}>
                                <div className="radioButton">
                                    <input value={true} defaultChecked={product.Veg} type="radio" id="yesVeg" name="Veg"/>
                                    <label htmlFor="yesVeg">Yes</label>
                                </div>
                                <div className="radioButton">
                                    <input value={false} defaultChecked={product.Veg == false} type="radio" id="noVeg" name="Veg"/>
                                    <label htmlFor="noVeg">No</label>
                                </div>
                            </div>
                        </div>
                        <div className="formInput">
                            <label htmlFor="yesStock">In Stock</label>
                            <div className="radioGroup" onClick={handleStock}>
                                <div className="radioButton">
                                    <input value={true} defaultChecked={product.InStock} type="radio" id="yesStock" name="InStock"/>
                                    <label htmlFor="yesStock">Yes</label>
                                </div>
                                <div className="radioButton">
                                    <input value={false} defaultChecked={!product.InStock} type="radio" id="noStock" name="InStock"/>
                                    <label htmlFor="noStock">No</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='formInput'>
                        <label htmlFor="energy">Macro Information</label>
                        <div className='macroInput'>
                            <div className="formInput">
                                <label htmlFor="energy">Energy</label>
                                <input type="number" id="energy" placeholder='Energy in kcal' name="Energy" onChange={handleMacroChange} />
                            </div>
                            <div className="formInput">
                                <label htmlFor="proteins">Proteins</label>
                                <input type="number" id="proteins" placeholder='Proteins in gms' name="Proteins" onChange={handleMacroChange}/>
                            </div>
                            <div className="formInput">
                                <label htmlFor="carbs">Carbs</label>
                                <input type="number" id="carbs" placeholder='Carbs in gms' name="Carbs" onChange={handleMacroChange}/>
                            </div>
                            <div className="formInput">
                                <label htmlFor="fats">Fats</label>
                                <input type="number" id="fats" placeholder='Fats in gms' name="Fats" onChange={handleMacroChange} />
                            </div>
                        </div>
                    </div>
                    <div className="formInput">
                        <label htmlFor="imageUpload">Product image
                        <img src={chosenImage? URL.createObjectURL(chosenImage): uploadImgSvg} alt="Product image" />
                        </label>
                        <input type="file" accept='.png, .jpg, .webp' id="imageUpload" hidden onChange={(e) => setChosenImage(e.target.files[0])}/>
                    </div>
                    <button onClick={validateForm} className="submitProduct">
                        Add Product
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddProduct;