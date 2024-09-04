import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { foodService } from '../authComponents/foodServices';

const FoodForm = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formattedPrice = parseFloat(price);  
        const formattedQuantity = parseInt(quantity, 10);  

        try {
            // eslint-disable-next-line no-unused-vars
            const response = await foodService.create({
                name,
                description,
                price: formattedPrice,
                quantity: formattedQuantity
            });

            setSuccessMessage('Food item created successfully!');
            setName('');
            setDescription('');
            setPrice('');
            setQuantity('');
            navigate('/dashboard');
        } catch (error) {
            console.error('Error creating food item:', error);
            setErrorMessage('Error creating food item: ' + error.message);
        }
    };


    return (
        <React.Fragment>
            <div className='new_food_container'>
                <h1>Add Food</h1>
                {errorMessage && (
                    <div className="error_message" style={{ color: 'red', marginBottom: '10px' }}>
                        {errorMessage}
                    </div>
                )}
                {successMessage && (
                    <div className="success_message" style={{ color: 'green', marginBottom: '10px' }}>
                        {successMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="new_food_form">

                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter Name"
                        required
                        className='form_value'
                    />
                    <textarea
                        value={description}
                        rows={4}
                        placeholder="Enter Description"
                        required
                        className='form_value'
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Enter Price"
                        required
                        className='form_value'
                    />
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="Enter Quantity"
                        required
                        className='form_value'
                    />

                    <div className='button_container'>
                        <Link to={"/dashboard"}>
                            <button className='CTA_button'>Go Back</button>
                        </Link>
                        <button type='submit' className='CTA_button'>Create New</button>
                    </div>
                </form>
            </div>
        </React.Fragment>
    )
}

export default FoodForm