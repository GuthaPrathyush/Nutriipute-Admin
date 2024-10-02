import { useState, useContext, useEffect, useRef } from "react";
import { AdminContext } from "../Contexts/AdminContext";
import '../stylesheets/editProduct.css';
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import uploadImgSvg from '../assets/uploadImg.png';
import axios from "axios";
import {toast} from 'react-hot-toast';

function EditProduct() {
    const {loaded, products, setProducts, productToModify, setProductToModify} = useContext(AdminContext);
    const [offerPrice, setOfferPrice] = useState(productToModify?(productToModify.Offer? true: false): false);
    const [chosenImage, setChosenImage] = useState(null);
    const [textAreaValue, setTextAreaValue] = useState(productToModify?productToModify.Description: "");
    const navigate = useNavigate();
    const productOfferInput = useRef();

    useEffect(() => {
        if(productToModify == null) {
            navigate('/products');
        }
        return () => {
            setProductToModify(null);
        }
    }, []);

    const [product, setProduct] = useState(productToModify?{
        Name: productToModify.Name,
        Image: productToModify.Image,
        product_id: productToModify.product_id,
        Price: productToModify.Price,
        Offer: productToModify.Offer,
        Description: productToModify.Description,
        InStock: productToModify.InStock,
        Veg: productToModify.Veg,
        Section: productToModify.Section,
        Domain: productToModify.Domain,
        Macro: productToModify.Macro
    }: null);

    function handleInputChange(e) {
        setProduct({...product, [e.target.getAttribute('name')]: String(e.target.value)});
    }
    function handleVeg(e) {
        if(e.target.getAttribute('name') === 'Veg') {
            setProduct({ ...product, [e.target.name]: e.target.value === "true" });
        }
    }
    function handleStock(e) {
        if(e.target.getAttribute('name') === 'InStock') {
            setProduct({ ...product, [e.target.name]: e.target.value === "true" });
        }
    }
    function handleMacroChange(e) {
        const Macro = {...product.Macro, [e.target.getAttribute('name')]: String(e.target.value)};
        setProduct({...product, ['Macro']: Macro});
    }
    async function validateForm() {
        product.Description = textAreaValue.trim().replace(/\s+/g, ' ');
        if(product.Price === "" || product.Description === "") {
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
        else {
            let deleteError = null;
            let uploaded = null;
            if(chosenImage) {
                await axios.post('http://localhost:3000/deleteImg', JSON.stringify({imageURL: product.Image}), {
                    headers: {
                        Accept: 'application/form-data',
                        'Content-Type': 'application/json',
                        'auth-token': localStorage.getItem('auth-token')
                    }
                }).then(response => deleteError = response.data).catch((error) => deleteError = error.response.data);
                if(deleteError.success) {
                    const imageForm = new FormData()
                    imageForm.append("product", chosenImage);
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
                    );
                }
                else {
                    uploaded = false;
                }
            }
            if(!deleteError || deleteError.success && uploaded) {
                const productEdit = axios.post('http://localhost:3000/editProduct', JSON.stringify({product}), {
                    headers: {
                        Accept: 'application/form-data',
                        'Content-Type': 'application/json',
                        'auth-token': localStorage.getItem('auth-token')
                    }
                });
                toast.promise(
                    productEdit,
                    {
                        loading: "Editing Product...",
                        success: response => {
                            setProducts(prevProductsArray => {
                                const updatedArray = prevProductsArray.map(subarray => {
                                    if (subarray.length > 0 && subarray[0].Section === product.Section) {
                                        const productIndex = subarray.findIndex((item) => item.product_id === product.product_id);
                                        subarray[productIndex] = product;
                                        return subarray;
                                    }
                                    return subarray;
                                });
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
            <div className="editProduct">
                <div className="container">
                    <ClipLoader />
                </div>
            </div>
        );
    }
    if(!localStorage.getItem('auth-token')) {
        window.location.replace('/login');
    }
    if(product) {
        return (
            <div className="editProduct">
                <div className="container">
                    <div className="productForm">
                        <div className='formInput'>
                            <label htmlFor="Name">Product Name</label>
                            <h3 id="Name">{product.Name}</h3>
                        </div>
                        <div className='formInputTwo'>
                            <div className='formInput'>
                                <label htmlFor="Price">Product Price</label>
                                <input value={product.Price} placeholder='Enter a price in ₹' type="number" id="Price" name="Price" onChange={handleInputChange}/>
                            </div>
                            <div className='formInput'>
                                <div className="offerPriceContainer">
                                    <label htmlFor="offerPriceCheck">Offer Price</label>
                                    <input type="checkbox" id="offerPriceCheck" checked={offerPrice} onChange={(e) => {setOfferPrice(e.target.checked); e.target.checked? product.Offer = productOfferInput.current.value: product.Offer = false}}/>
                                </div>
                                <input ref={productOfferInput} defaultValue={productToModify?(productToModify.Offer? productToModify.Offer: ""): ""} placeholder='Enter a price in ₹' type="number" id="Offer" name="Offer" disabled={!offerPrice} onChange={handleInputChange}/>
                            </div>
                        </div>
                        <div className='formInput'>
                            <label htmlFor="Description">Product Description</label>
                            <textarea name="Description" id="Description" value={textAreaValue} onChange={(e) => {setTextAreaValue(e.target.value)}}></textarea>
                        </div>
                        <div className="formInput">
                            <label htmlFor="Section">Product Section</label>
                            <h3 id="Section">{product.Section}</h3>
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
                            <label htmlFor="protiens">Macro Information</label>
                            <div className='macroInput'>
                                <div className="formInput">
                                    <label htmlFor="energy">Energy</label>
                                    <input defaultValue={productToModify?productToModify.Macro.Energy: ""} type="number" id="energy" placeholder='Energy in kcal' name="Energy" onChange={handleMacroChange} />
                                </div>
                                <div className="formInput">
                                    <label htmlFor="proteins">Proteins</label>
                                    <input defaultValue={productToModify?productToModify.Macro.Proteins: ""} type="number" id="proteins" placeholder='Proteins in gms' name="Proteins" onChange={handleMacroChange}/>
                                </div>
                                <div className="formInput">
                                    <label htmlFor="carbs">Carbs</label>
                                    <input defaultValue={productToModify?productToModify.Macro.Carbs: ""} type="number" id="carbs" placeholder='Carbs in gms' name="Carbs" onChange={handleMacroChange}/>
                                </div>
                                <div className="formInput">
                                    <label htmlFor="fats">Fats</label>
                                    <input defaultValue={productToModify?productToModify.Macro.Fats: ""} type="number" id="fats" placeholder='Fats in gms' name="Fats" onChange={handleMacroChange} />
                                </div>
                            </div>
                        </div>
                        <div className="formInput">
                            <label htmlFor="imageUpload">Product image
                            <img src={chosenImage? URL.createObjectURL(chosenImage): productToModify?productToModify.Image: uploadImgSvg} alt="Product image" />
                            </label>
                            <input type="file" accept='.png, .jpg, .webp' id="imageUpload" hidden onChange={(e) => setChosenImage(e.target.files[0])}/>
                        </div>
                        <button onClick={validateForm} className="submitProduct">
                            Edit Product
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default EditProduct;