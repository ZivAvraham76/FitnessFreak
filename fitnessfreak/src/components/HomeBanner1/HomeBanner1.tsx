import React from 'react'
import CircularProgress from '@mui/joy/CircularProgress';
import { AiOutlineEye } from 'react-icons/ai'
import './HomeBanner1.css'

const HomeBanner1 = () => {

  // State to store fetched data
  const [data, setData] = React.useState<any>(null)
  // Function to fetch data from backend
  const getData = async () => {
    fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/report/getreport', {

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

  // useEffect hook to fetch data when component mounts
  React.useEffect(() => {
    getData()
  }, [])

  return (
    <div className='meters'>
      {
        // Check if data is available and map over the array to display cards
        data?.length > 0 && data.map((item: any, index: number) => {
          return (<div className='card' key={index}>
             {/* Card header displaying the name and value */}
            <div className='card-header'>
              <div className='card-header-box'>
                <div className='card-header-box-name'>{item.name}</div>
                <div className='card-header-box-value'>{parseInt(item.value)} {item.unit}</div>
              </div>
              <div className='card-header-box'>
                <div className='card-header-box-name'>Target</div>
                <div className='card-header-box-value'>{parseInt(item.goal)} {item.goalUnit}</div>
              </div>

            </div>
            {/* Circular progress indicator to show progress towards the goal */}
            <CircularProgress
              color='neutral'
              determinate
              variant='solid'
              size='lg'
              value={(item.value / item.goal) * 100

              }
            >
              {/* Display the value and goal inside the circle */}
              <div className='textincircle'>
                <span>
                  {
                    parseInt(item.value)
                  }
                </span>
                <span className='hrline'></span>
                <span>
                  {
                    parseInt(item.goal)
                  }
                </span>


              </div>

            </CircularProgress>
            {/* Button to navigate to the specific report page for the current item */}
            <button
              onClick={() => {
                window.location.href = `/report/${item.name}`
              }}
            >Show Report <AiOutlineEye /></button>

          </div>)


        })

      }
    </div>
  )
}

export default HomeBanner1
