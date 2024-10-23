import React from 'react'
import "./Popular.css"
// import data_product from "../assets/data";
import Item from '../Items/Item';
import { useState } from 'react';
import { useEffect } from 'react';

const Popular = () => {
  const [popular,setPopular]= useState([]);

  useEffect(()=>{
    fetch("http://localhost:4000/popularinwomen").then((response)=>response.json()).then((data)=>setPopular(data));
  },[])
  return (
    <div className='popular'>
      <h1>POPULAR IN WOMEN</h1>
      <hr />
      <div className="popular-item">
        {popular.map((item,i)=>{
            return <Item key={i} id={item.id} name={item.name} image={item.image} old_price={item.old_price} new_price={item.new_price}/>
        })}
      </div>
    </div>
  )
}

export default Popular
