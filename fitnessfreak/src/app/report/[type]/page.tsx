"use client"
import React from 'react'
import { LineChart } from '@mui/x-charts/LineChart';
import './report.css'
import { AiFillEdit } from 'react-icons/ai'
import CaloriIntakePopup from '@/components/Reportformpopup/Caloriesintake/CalorieIntakePopup';
import SleepPopup from '@/components/Reportformpopup/sleep/sleepPopup';
import StepsPopup from '@/components/Reportformpopup/Steps/stepsPopup';
import WaterPopup from '@/components/Reportformpopup/water/waterPopup';
import WorkoutPopup from '@/components/Reportformpopup/workout/workoutPopup';
import WeightPopup from '@/components/Reportformpopup/weight/weightPopup';

import { usePathname } from 'next/navigation'
import { setFips } from 'crypto';
import { unix } from 'dayjs';

const page = () => {
  // Get the current URL path
  const pathname = usePathname()
  console.log(pathname)

  // State to store data for the chart
  const [dataS1, setDataS1] = React.useState<any>(null)

  // Function to fetch data based on the current report type
  const getDataForS1 = async () => {
    // Fetching data for caloirie intake
    if (pathname == '/report/Calorie%20Intake') {
      fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/calorieintake/getcalorieintakebylimit', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ limit: 10 })
      })
        .then(res => res.json())
        .then(data => {
          if (data.ok) {
            let temp = data.data.map((item: any) => {
              return {
                date: item.date,
                value: item.calorieIntake,
                unit: 'kcal'
              }
            })
            console.log(temp)
            let dataForLineChart = temp.map((item: any) => {
              let val = JSON.stringify(item.value)
              return val
            })

            // Preparing data for the chart
            let dataForXAxis = temp.map((item: any) => {
              let val = new Date(item.date)
              return val
            })
            // Updating state with data for the line chart
            setDataS1({
              data: dataForLineChart,
              title: 'Calorie Intake',
              color: '#ffc20e',
              xAxis: {
                data: dataForXAxis,
                label: 'Last 10 dayes',
                scaleType: 'time'
              }
            })

          }
          else {
            setDataS1([])
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
    // Fetching data for sleep 
    else if (pathname == '/report/Sleep') {
      fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/sleeptrack/getsleepbylimit', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ limit: 10 })
      })
        .then(res => res.json())
        .then(data => {
          if (data.ok) {
            let temp = data.data.map((item: any) => {
              return {
                date: item.date,
                value: item.durationInHrs,
                unit: 'Hours'
              }
            })
            console.log(temp)
            let dataForLineChart = temp.map((item: any) => {
              let val = JSON.stringify(item.value)
              return val
            })

            // Preparing data for the chart
            let dataForXAxis = temp.map((item: any) => {
              let val = new Date(item.date)
              return val
            })
            // Updating state with data for the line chart
            setDataS1({
              data: dataForLineChart,
              title: 'Sleep',
              color: '#ffc20e',
              xAxis: {
                data: dataForXAxis,
                label: 'Last 10 dayes',
                scaleType: 'time'
              }
            })

          }
          else {
            setDataS1([])
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
    // Fetching data for steps
    else if (pathname == '/report/Steps') {
      fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/steptrack/getstepsbylimit', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ limit: 10 })
      })
        .then(res => res.json())
        .then(data => {
          if (data.ok) {
            let temp = data.data.map((item: any) => {
              return {
                date: item.date,
                value: item.steps,
                unit: 'Steps'
              }
            })
            console.log(temp)
            let dataForLineChart = temp.map((item: any) => {
              let val = JSON.stringify(item.value)
              return val
            })
            // Preparing data for the chart
            let dataForXAxis = temp.map((item: any) => {
              let val = new Date(item.date)
              return val
            })
            // Updating state with data for the line chart
            setDataS1({
              data: dataForLineChart,
              title: 'Steps',
              color: '#ffc20e',
              xAxis: {
                data: dataForXAxis,
                label: 'Last 10 dayes',
                scaleType: 'time'
              }
            })

          }
          else {
            setDataS1([])
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
    // Fetching data for water
    else if (pathname == '/report/Water') {
      fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/watertrack/getwaterbylimit', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ limit: 10 })
      })
        .then(res => res.json())
        .then(data => {
          if (data.ok) {
            let temp = data.data.map((item: any) => {
              return {
                date: item.date,
                value: item.amountInMilliliters,
                unit: 'ml'
              }
            })
            console.log(temp)
            let dataForLineChart = temp.map((item: any) => {
              let val = JSON.stringify(item.value)
              return val
            })
            // Preparing data for the chart
            let dataForXAxis = temp.map((item: any) => {
              let val = new Date(item.date)
              return val
            })
            // Updating state with data for the line chart
            setDataS1({
              data: dataForLineChart,
              title: 'Water',
              color: '#ffc20e',
              xAxis: {
                data: dataForXAxis,
                label: 'Last 10 dayes',
                scaleType: 'time'
              }
            })

          }
          else {
            setDataS1([])
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
    // Fetching data for workout
    else if (pathname == '/report/Workout') {
      fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/workouttrack/getworkoutsbylimit', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ limit: 10 })
      })
        .then(res => res.json())
        .then(data => {
          if (data.ok) {
            let temp = data.data.map((item: any) => {
              return {
                date: item.date,
                value: item.durationInMinutes,
                unit: 'minutes'
              }
            })
            console.log(temp)
            let dataForLineChart = temp.map((item: any) => {
              let val = JSON.stringify(item.value)
              return val
            })
            // Preparing data for the chart
            let dataForXAxis = temp.map((item: any) => {
              let val = new Date(item.date)
              return val
            })
            // Updating state with data for the line chart
            setDataS1({
              data: dataForLineChart,
              title: 'Workout',
              color: '#ffc20e',
              xAxis: {
                data: dataForXAxis,
                label: 'Last 10 dayes',
                scaleType: 'time'
              }
            })

          }
          else {
            setDataS1([])
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
    // Fetching data for weight
    else if (pathname == '/report/Weight') {
      fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/weighttrack/getweightbylimit', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ limit: 10 })
      })
        .then(res => res.json())
        .then(data => {
          if (data.ok) {
            let temp = data.data.map((item: any) => {
              return {
                date: item.date,
                value: item.weight,
                unit: 'kg'
              }
            })
            console.log(temp)
            let dataForLineChart = temp.map((item: any) => {
              let val = JSON.stringify(item.value)
              return val
            })
            // Preparing data for the chart
            let dataForXAxis = temp.map((item: any) => {
              let val = new Date(item.date)
              return val
            })
            // Updating state with data for the line chart
            setDataS1({
              data: dataForLineChart,
              title: 'Weight',
              color: '#ffc20e',
              xAxis: {
                data: dataForXAxis,
                label: 'Last 10 dayes',
                scaleType: 'time'
              }
            })

          }
          else {
            setDataS1([])
          }
        })
        .catch(err => {
          console.log(err)
        })
    }

    else {
      // Show popup for other reports
      alert('get data popup for other reports')
    }

  }

  // useEffect hook to trigger data fetching when the component is mounted
  React.useEffect(() => {
    getDataForS1()
  }, [])

  // State hooks to manage the visibility of different popups for each report
  const [showCalorieIntakePopup, setShowCalorieIntakePopup] = React.useState<boolean>(false)
  const [showSleepPopup, setShowSleeepPopup] = React.useState<boolean>(false)
  const [showStepsPopup, setShowStepsPopup] = React.useState<boolean>(false)
  const [showWaterPopup, setShowWaterPopup] = React.useState<boolean>(false)
  const [showWorkoutPopup, setShowWorkoutPopup] = React.useState<boolean>(false)
  const [showWeightPopup, setShowWeightPopup] = React.useState<boolean>(false)

  return (
    <div className='reportpage'>
      <div className='s1'>
        {
          dataS1 && dataS1.xAxis && dataS1.xAxis.data && <LineChart
            xAxis={[{
              id: 'Day',
              data: dataS1.xAxis.data,
              scaleType: dataS1.xAxis.scaleType,
              label: dataS1.xAxis.label,
              valueFormatter: (date: any) => {
                return date.toLocaleDateString();
              }
            }]}
            series={[
              {
                data: dataS1.data,
                label: dataS1.title,
                color: dataS1.color
              },
            ]}
            height={300}
          />
        }
      </div>
      {/* Edit button that triggers the respective popup based on the report type */}
      <button className='editbutton'
        onClick={() => {
          if (pathname == '/report/Calorie%20Intake') {
            setShowCalorieIntakePopup(true)
          }
          else if (pathname == '/report/Sleep') {
            setShowSleeepPopup(true)
          }
          else if (pathname == '/report/Steps') {
            setShowStepsPopup(true)

          }
          else if (pathname == '/report/Water') {
            setShowWaterPopup(true)

          }
          else if (pathname == '/report/Workout') {
            setShowWorkoutPopup(true)

          }
          else if (pathname == '/report/Weight') {
            setShowWeightPopup(true)

          }
          else {
            // Show popup for other reports
            alert('show popup for other reports')
          }
        }}
      >
        <AiFillEdit />
      </button>
      {/* Render corresponding popup based on which state is true */}
      {
        showCalorieIntakePopup &&

        <CaloriIntakePopup setShowCalorieIntakePopup={setShowCalorieIntakePopup} />

      }

      {
        showSleepPopup &&

        <SleepPopup setShowSleeepPopup={setShowSleeepPopup} />

      }

      {
        showStepsPopup &&

        <StepsPopup setShowStepsPopup={setShowStepsPopup} />

      }

      {
        showWaterPopup &&
        <WaterPopup setShowWaterPopup={setShowWaterPopup} />

      }
      {
        showWorkoutPopup &&
        <WorkoutPopup setShowWorkoutPopup={setShowWorkoutPopup} />

      }

      {
        showWeightPopup &&
        <WeightPopup setShowWeightPopup={setShowWeightPopup} />

      }




    </div>
  )
}

export default page
