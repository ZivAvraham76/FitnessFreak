import React from 'react'
import './steps.css'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AiFillDelete, AiOutlineClose } from 'react-icons/ai'
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { toast, ToastContainer } from 'react-toastify';

interface StepsPopupProps {
  setShowStepsPopup: React.Dispatch<React.SetStateAction<boolean>>;
}
// Component to manage steps input and display for a selected date
const StepsPopup: React.FC<StepsPopupProps> = ({ setShowStepsPopup }) => {
  // State for managing selected date, time, and steps data
  const [date, setDate] = React.useState<any>(dayjs(new Date()))
  const [time, setTime] = React.useState<any>(dayjs(new Date()))
  const [Steps, setSteps] = React.useState<any>({
    date: '',
    steps: 0
  })

  // State to store all steps records for the selected date
  const [items, setItems] = React.useState<any>([])
  // Function to save steps entry to the backend
  const saveSteps = async () => {
    let inputDate = date.format('YYYY-MM-DD')
    // POST request to save steps data
    fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/steptrack/addstepentry', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        date: inputDate,
        steps: Steps.steps
      })
    })
  .then(res => res.json())
  .then(data => {
    if (data.ok) {
      toast.success('Steps entry added successfuly')
      getStepsEntry() // Refresh the list of steps items for the selected date
    } else {
      toast.error('Error in adding Steps entry')

    }
  })
  .catch(err => {
    toast.error('Error in adding Steps entry')
    console.log(err)
  })
console.log(inputDate);
console.log(Steps.steps)
  }

// Function to get the steps data for the selected date
const getStepsEntry = async () => {
  setItems([])
  // POST request to fetch steps data
  fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/steptrack/getstepsbydate', {
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
      console.log(data.data, 'Steps entry data for date')
      toast.success('steps entry for date')
          setItems(data.data) // Update state with fetched items
    } else {

      toast.error('Error in getting steps entry')
}
  })
  .catch(err => {
    toast.error('Error in getting steps entry')
    console.log(err)
  })
}

// Function to delete a specific steps item
const deleteStepsEntry = async (item: any) => {
  // DELETE request to remove a steps item
  fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/steptrack/deletestepsntry', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({
      date: item.date,
      steps: item.steps

    })

  })
  .then(res => res.json())
  .then(data => {
    if (data.ok) {
      toast.success('Steps entry item deleted successfuly')
      getStepsEntry(); // Refresh the list of items
    } else {

      toast.error('Error in deleting steps entry')
}
  })
  .catch(err => {
    toast.error('Error in deleting steps entry')
    console.log(err)
  })
}

// Effect hook to fetch steps data whenever the date changes
React.useEffect(() => {
  getStepsEntry()
}, [date])

// Function to handle date selection change
const selectedDay = (val: any) => {
  setDate(val)
};

// Rendering the Popup Component for steps, including date picker, time picker, input fields, and existing calorie items.
return (
  <div className='popupout'>
    <div className="popupbox">
      <button className='close'
        onClick={() => {
          setShowStepsPopup(false)
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

      <TextField id="outlined-basic" label="Number of steps" variant="outlined" color='warning' type='number'
        onChange={(e) => {
            setSteps({ ...Steps, steps: e.target.value })
            
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
          saveSteps
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
              <h3>{item.steps} Steps</h3>
              <button
              onClick={() => {
                deleteStepsEntry(item)
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

export default StepsPopup
