import React from 'react'
import { useSelector } from 'react-redux'
import { selectDoctors } from '../../redux/doctorSlice'
import { Link } from 'react-router-dom';

const RelatedDoctors = ({docId,speciality}) => {

    const doctors = useSelector(selectDoctors);

    const relatedDoctors = doctors.filter((item)=>item.speciality==speciality && item._id !=docId )

  return (
    <div className='grid grid-cols-4 my-10 gap-10'>
      {relatedDoctors.map((item,index)=>(
        <Link onClick={()=>scrollTo(0,0)} to={`/appointment/${item._id}`}><div
              key={index}
              className="p-4 bg-white shadow-md rounded-lg hover:-translate-y-3 transition-all ease-linear transition-300"
              onClick={()=>navigate(`/appointment/${item._id}`)}
            >
              <div className="">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className=" flex items-center gap-1 mt-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-500">Available</span>
                </div>
              <h3 className="text-xl font-bold mt-1">{item.name}</h3>
              <p className="text-gray-500 text-sm">{item.speciality}</p>
            </div>
            </Link>      ))}
    </div>
  )
}

export default RelatedDoctors
