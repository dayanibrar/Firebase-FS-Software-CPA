import React from 'react'
import { homeClasses } from './homeClasses'
import Header from '../../components/Header/Header';

const Home = () => {
  const { container, cardContainer, title, description} = homeClasses;

  return (
  <>
  <Header />
  <div className={container}>
     <div className={cardContainer}>
      <h5 className={title}>Auth Systems</h5>
      <p className={description}>Authentication systems developed by Xidas Studios</p>
     </div>
    </div>
  </>
  )
}

export default Home
