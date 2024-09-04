import React from 'react'
import NavBar from '../components/NavBar'
import { Link } from 'react-router-dom';
import FoodList from '../components/FoodList';

const Dashboard = () => {
    return (
        <React.Fragment>
            <NavBar />
            <div className='dashboard'>
                <h1>Dashboard</h1>
                <Link to={"/add_new"}>
                    <button className='CTA_button'> Add New Food </button>
                </Link>
                <hr />

                <div className='dashboard_food_list'>
                    <FoodList />
                </div>
            </div>
        </React.Fragment>
    )
}

export default Dashboard