"use client"
import { duration } from '@mui/material'
import React from 'react'
import './workoutPage.css'
import { useSearchParams } from 'next/navigation'

const page = () => {
  // State variables to store the workout data and individual exercise data
  const [workout, setWorkout] = React.useState<any>(null)
  const [data, setData] = React.useState<any>(null)
  // Using the Next.js hook to get search parameters from the URL
  const searchParams = useSearchParams()
  const workoutid = searchParams.get('id')

  const getWorkout = async () => {
    // let data: any = {
    //   type: 'Chest',
    //   imageUrl:'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80', 
    //   durationMin: 30,
    //   exercises: [
    //       {
    //           exercise: 'Bench Press',
    //           videoUrl: 'https://gymvisual.com/img/p/5/0/2/2/5022.gif',
    //           sets: 3,
    //           reps: 10,
    //           description: 'The bench press targets your chest, shoulders, and triceps, promoting strength and stability. Focus on form and control—each rep is a step toward greater power and resilience!'


    //       },
    //       {
    //           exercise: 'Incline Bench Press',
    //           videoUrl: 'https://gymvisual.com/img/p/2/0/8/2/3/20823.gif',
    //           sets: 3,
    //           reps: 10,
    //           description: 'The incline bench press focuses on the upper chest and shoulders, helping to build a balanced physique and enhance your overall strength'

    //       },
    //       {
    //           exercise: 'Decline Bench Press',
    //           videoUrl: 'https://gymvisual.com/img/p/5/0/3/4/5034.gif',
    //           sets: 3,
    //           reps: 10,
    //           description: 'The decline bench press targets your lower chest, delivering a unique twist to your workout. Keep'
    //       }
    //   ]
    // }

    // setWorkout(data)
  }
  // Fetch workout details from the backend API
  fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/workoutplans/workouts' + workoutid, {
    method: 'GET',
    credentials: 'include',
  })
    .then(res => res.json())
    .then(data => {
      if (data.ok) {
        setData(data.data)
      }
      else {
        setData([])
      }
    })
    .catch(err => {
      console.log(err)
    })

  // Fetch workout data when the component mounts
  React.useEffect(() => {
    getWorkout()
  }, [])

  return (
    <div className='workout'>
      <h1 className='mainhead1'> {data?.name} Day</h1>
      <div className='workout_exercises'>
        {
          // Iterate over each exercise in the workout plan
          data?.exercises.map((item: any, index: number) => {
            return (
              <div className={index % 2 === 0 ? 'workout__exercise' : 'workout__exercise workout__exercise--reverse'
              }>
                <h3>{index + 1}</h3>
                <div className="workout__exercise__image">
                  <img src={item.imageURL} alt="" />
                </div>
                <div className="workout__exercise__content">
                  <h2>{item.name}</h2>
                  <span>{item.sets} sets X {item.reps} reps </span>
                  <p>{item.description}</p>
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default page
