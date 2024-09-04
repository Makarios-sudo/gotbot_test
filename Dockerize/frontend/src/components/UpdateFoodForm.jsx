import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { foodService } from '../authComponents/foodServices';

const UpdateFoodForm = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchFoodDetails = async () => {
            try {
                const response = await foodService.getById(id);
                const { name, description, price, quantity } = response.data;

                setName(name);
                setDescription(description);
                setPrice(price);
                setQuantity(quantity);
            } catch (error) {
                setErrorMessage('Error fetching food details: ' + error.message);
            }
        };

        fetchFoodDetails();
    }, [id]);

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();

        const formattedPrice = parseFloat(price);
        const formattedQuantity = parseInt(quantity, 10);

        try {
            await foodService.update(id, {
                description,
                price: formattedPrice,
                quantity: formattedQuantity
            });

            setSuccessMessage('Food item updated successfully!');
            navigate('/dashboard');
        } catch (error) {
            setErrorMessage('Error updating food item: ' + error.message);
        }
    };

    return (
        <React.Fragment>
            <div className='new_food_container'>
                <h1>Update Food</h1>
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

                <form onSubmit={handleUpdateSubmit} className="new_food_form">

                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter Name"
                        className='form_value'
                    />
                    <textarea
                        value={description}
                        rows={4}
                        placeholder="Enter Description"
                        className='form_value'
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Enter Price"
                        className='form_value'
                    />
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="Enter Quantity"
                        className='form_value'
                    />

                    <div className='button_container'>
                        <button type="button" onClick={() => navigate("/dashboard")} className='CTA_button'>Go Back</button>
                        <button type='submit' className='CTA_button'>Update</button>
                    </div>
                </form>
            </div>
        </React.Fragment>
    )
}

export default UpdateFoodForm