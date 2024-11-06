import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import './HomeBanner2.css'
import { Pagination } from 'swiper/modules';

const HomeBanner2 = () => {
   // State variables to store the workouts data and fetched API data
  const [workouts, setWorkouts] = React.useState<any[] | null>(null)
  const [data, setData] = React.useState<any[] | null>(null)

  // Function to fetch workout data from the backend
  const getData = async () => {
    fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/workoutplans/workouts', {
      method: 'GET',
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        console.log(data)
        if (data.ok) {
          setData(data.data)
        }
        else {
          setData([])
        }
      })
      .catch(err => {
        console.log(err)
        setData([])
      })

  }
  // useEffect hook to fetch the data when the component mounts
  React.useEffect(() => {
    getData()
  }, [])

  return (
    <>
    {
      data &&
      <div>
      <h1 className='mainhead1'>Workouts</h1>
      <Swiper
        slidesPerView={1}
        spaceBetween={10}
        pagination={{
          clickable: true,
        }}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 4,
            spaceBetween: 40,
          },
          1024: {
            slidesPerView: 5,
            spaceBetween: 50,
          },
        }}
        modules={[Pagination]}
        className="mySwiper"
      >
        {
          data && data.map((item:any, index:number) =>{
            return(
              <SwiperSlide key={index}>
                <div className='swiper-slide' 
                style={{
                  backgroundImage: `url(${item.imageURL})`,
                }}
                onClick={() => {
                  window.location.href = `/workout?id=/${item._id}`
                }}
                >
                  <div className='swiper-slide-content'>
                    <h2>{item.name}</h2>
                    <p>{item.durationInMinutes} min</p>
                  </div>
                </div>
              </SwiperSlide>
            )
          })
        }
      </Swiper>
    </div>
    }
    </>
  )
}

export default HomeBanner2
