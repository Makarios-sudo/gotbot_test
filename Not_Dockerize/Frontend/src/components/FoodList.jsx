import React,{ useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { foodService } from '../authComponents/foodServices';
import "../assets/styles.css"

const FoodList = () => {
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [selectedFood, setSelectedFood] = useState(null);

    useEffect(() => {
        const fetchFoods = async () => {
            try {
                const response = await foodService.getAll();
                if (typeof response.data === 'string') {
                    setMessage(response.data);
                    setFoods([]);
                } else if (Array.isArray(response.data)) {
                    setFoods(response.data);
                    setMessage(null);
                } else {

                    setError('Unexpected response structure.');
                }
            } catch (error) {
                console.error('Error fetching food items:', error);
                setError('Error fetching food items.');
            } finally {
                setLoading(false);
            }
        };

        fetchFoods();
    }, []);

    const handleFoodDetails = async (foodId) => {
        try {
            const response = await foodService.getById(foodId);
            setSelectedFood(response.data);
        } catch (error) {
            console.error('Error fetching food details:', error);
            setError('Error fetching food details.');
        }
    };

    const handleDelete = async () => {
        if (!selectedFood) return;
        try {
            await foodService.delete(selectedFood.ID);
            setFoods(foods.filter(food => food.ID !== selectedFood.ID));
            setSelectedFood(null);
        } catch (error) {
            console.error('Error deleting food item:', error);
            setError('Error deleting food item.');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Date';
        return date.toLocaleString();
    };

    if (loading) return <p>Loading...</p>;


    return (
        <React.Fragment>
            <div className="food-list-container">
                {error && <p className="error-message">{error}</p>}
                {message && <p className="no-food-message">{message}</p>}
                {foods.length > 0 && (
                    <table className="food-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Price</th>
                                <th>Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {foods.map(food => (
                                <tr key={food.ID} onClick={() => handleFoodDetails(food.ID)}>
                                    <td>{food.Name}</td>
                                    <td>{food.Description}</td>
                                    <td>{food.Price}</td>
                                    <td>{food.Quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {selectedFood && (
                    <div className="food_details_modal">
                        <h2>Food Details</h2>
                        <span><strong>Name:</strong> {selectedFood.Name}</span>
                        <span><strong>Description:</strong> {selectedFood.Description}</span>
                        <span><strong>Price:</strong> ${selectedFood.Price}</span>
                        <span><strong>Quantity:</strong> {selectedFood.Quantity}</span>
                        <span><strong>CreatedAt:</strong> {selectedFood.CreatedAt ? formatDate(selectedFood.CreatedAt) : 'N/A'}</span>
                        <div className="modal_buttons">
                            <button onClick={() => setSelectedFood(null)}>Close</button>
                            <Link to={`/update_food/${selectedFood.ID}`}>
                                <button>Update</button>
                            </Link>
                            <button onClick={handleDelete}>Delete</button>

                        </div>
                    </div>
                )}
            </div>
        </React.Fragment>
    )
}

export default FoodList