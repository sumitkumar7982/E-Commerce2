import React from 'react'
import "./NewCollections.css"
// import new_collection from "../assets/new_collections"
import Item from "../Items/Item"
import { useState } from 'react'
import { useEffect } from 'react'

const NewCollections = () => {
  const [new_collection,setNew_Collection]= useState([]);

  useEffect(()=>{
    fetch("http://localhost:4000/newcollection").then((response)=>response.json()).then((data)=>setNew_Collection(data));
  },[])
  return (
    <div className='new-collections'>
      <h1>NEW COLLECTIONS</h1>
      <hr />
      <div className="collections">
        {new_collection.map((item,i)=>{
            return <Item key={i} id={item.id} name={item.name} image={item.image} old_price={item.old_price} new_price={item.new_price}/> 
        })}
      </div>
    </div>
  )
}

export default NewCollections
