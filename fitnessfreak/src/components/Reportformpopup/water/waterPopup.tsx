import React from 'react'
import './water.css'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AiFillDelete, AiOutlineClose } from 'react-icons/ai'
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { toast, ToastContainer } from 'react-toastify';

interface WaterPopupProps {
  setShowWaterPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

// Component to manage water input and display for a selected date
const WaterPopup: React.FC<WaterPopupProps> = ({ setShowWaterPopup }) => {
  // State for managing selected date, time, and water data
  const [date, setDate] = React.useState<any>(dayjs(new Date()))
  const [time, setTime] = React.useState<any>(dayjs(new Date()))
  const [Water, setWater] = React.useState<any>({
    date: '',
    amountInMilliliters: 0
  })

  // State to store all water records for the selected date
  const [items, setItems] = React.useState<any>([])

  // Function to save water to the backend
  const saveWater = async () => {
    let inputDate = date.format('YYYY-MM-DD')
  // POST request to save water data
    fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/watertrack/addwaterentry', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        date: inputDate,
        amountInMilliliters: Water.amountInMilliliters
      })
    })
  .then(res => res.json())
  .then(data => {
    if (data.ok) {
      toast.success('Water entry added successfuly')
      getWaterEntry() // Refresh the list of water items for the selected date
    } else {

      toast.error('Error in adding Water entry')

    }
  })
  .catch(err => {
    toast.error('Error in adding Water entry')
    console.log(err)
  })
  }

// Function to get the water data for the selected date
const getWaterEntry = async () => {
  setItems([])
  // POST request to fetch water data
  fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/watertrack/getwaterbydate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({
      date: date,
    })
  })
  .then(res => res.json())
  .then(data => {
    console.log('Data from API:', data);
    if (data.ok) {
      console.log(data.data, 'Water entry data for date')
      toast.success('water entry for date')
      setItems(data.data) // Update state with fetched items
    } else {

      toast.error('Error in getting water entry')
}
  })
  .catch(err => {
    toast.error('Error in getting water entry')
    console.log(err)
  })
}

// Function to delete a specific water item
const deleteWaterEntry = async (item: any) => {
  // DELETE request to remove a water item
  fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/watertrack/deletewaterentry', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({
      date: item.date,
      amountInMilliliters: item.amountInMilliliters


    })

  })
  .then(res => res.json())
  .then(data => {
    if (data.ok) {
      toast.success('Water entry item deleted successfuly')
      getWaterEntry() // Refresh the list of items
    } else {

      toast.error('Error in deleting water entry')
}
  })
  .catch(err => {
    toast.error('Error in deleting water entry')
    console.log(err)
  })
}

// Effect hook to fetch water data whenever the date changes
React.useEffect(() => {
  getWaterEntry()
}, [date])

// Function to handle date selection change
const selectedDay = (val: any) => {
  setDate(val)
};

// Rendering the Popup Component for water, including date picker, time picker, input fields, and existing calorie items.
return (
  <div className='popupout'>
    <div className="popupbox">
      <button className='close'
        onClick={() => {
          setShowWaterPopup(false)
        }}><AiOutlineClose />
      </button>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Select Date"
          value={date}
          onChange={(newValue: any) => {
            selectedDay(newValue);
          }}
        />
      </LocalizationProvider>

      <TextField id="outlined-basic" label="Amount of water in ml" variant="outlined" color='warning' type='number'
        onChange={(e) => {
                setWater({ ...Water, amountInMilliliters: e.target.value })
            
        }} />

<div className='timebox'>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker
            label="Time picker"
            value={time}
            onChange={(newValue) => setTime(newValue)}
          />
        </LocalizationProvider>
      </div>
      

      <Button variant='contained' color='warning'
        onClick={
          saveWater
        }>
        Save
      </Button>
      <div className="hrline"></div>
      <div className="items">
      {
        items.map((item:any) => {
          return (
            <div className="item">
              <h3>{date.format('YYYY-MM-DD')}</h3>
              <h3>{item.amountInMilliliters} ml</h3>
              <button
              onClick={() => {
                deleteWaterEntry(item)
              }
              }><AiFillDelete/></button>
            </div>
          )
        })
      }
    </div>
    </div>
    {/* <div className="popupbox">
      <button className='close'
      onClick={()=>{
        setShowCalorieIntakePopup(false)
      }}><AiOutlineClose/>
      </button>

      <DatePicker getSelectedDay={selectedDay}
          endDate={100}
          selectDate={new Date()}
          labelFormat={"MMMM"}
          color='#ffc20e'
        />

        <TextField id="outlined-basic" label="food item name" variant="outlined" color='warning'/>
        <TextField id="outlined-basic" label="food item amount" variant="outlined" color='warning'/>

        <div className='timebox'>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimeClock value={value} onChange={(newValue) => setValue(newValue)}
            />
          </LocalizationProvider>
        </div>

        <Button variant="contained" color='warning'>Save</Button>

        <div className='hrline'></div>
        <div className='items'>
          <div className='item'>
            <h3>Apple</h3>
            <h3>100 gms</h3>
            <button> <AiFillDelete /></button>
          </div>
          <div className='item'>
            <h3>Banana</h3>
            <h3>200 gms</h3>
            <button> <AiFillDelete /></button>

          </div>
          <div className='item'>
            <h3>Rice</h3>
            <h3>300 gms</h3>
            <button> <AiFillDelete /></button>

          </div>
        </div>

      </div> */}
  </div>
)
}

export default WaterPopup
