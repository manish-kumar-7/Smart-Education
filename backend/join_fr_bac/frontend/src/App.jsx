import { useState,useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios';
function App() {
  const [jokes,setjokes]=useState([]);
  useEffect(()=>{
    axios.get('/api/jokes')
    .then((response)=>{
      setjokes(response.data)
    })
    .catch((error)=>{
      console.log(error)
    })
  })

  return (
    <>
     <h1>hello manish</h1>
     <p>jokes:{jokes.length}</p>
     {
      jokes.map((data,index)=>{
        return (
        <div key={data.id}>
          <h3>{data.title}</h3>
          <p>{data.description}</p>
        </div>
        )
      })
     }
    </>
  )
}

export default App
