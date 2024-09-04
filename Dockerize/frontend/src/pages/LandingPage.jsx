import React from 'react'
import { Link } from 'react-router-dom'
import "../assets/styles.css"

const LandingPage = () => {
    return (
        <React.Fragment>
            <div className='landingPage_container'>
                <div className='landingPage_header'>
                    <h1 className=''>
                        Welcome To Koto Shop
                    </h1>
                    <div className=' landingPage_CTA '>

                        <Link to={"/register"}>
                            <button className='CTA'>Register</button>
                        </Link>
                        <Link to={"/login"}>
                            <button className='CTA'>Login</button>
                        </Link>


                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default LandingPage