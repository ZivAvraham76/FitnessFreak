import React from 'react'
import './workout.css'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AiFillDelete, AiOutlineClose } from 'react-icons/ai'
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { toast, ToastContainer } from 'react-toastify';



interface WorkoutPopupProps {
  setShowWorkoutPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

// Component to manage workout input and display for a selected date
const WorkoutPopup: React.FC<WorkoutPopupProps> = ({ setShowWorkoutPopup }) => {
  // State for managing selected date, time, and workout data
  const [date, setDate] = React.useState<any>(dayjs(new Date()))
  const [time, setTime] = React.useState<any>(dayjs(new Date()))
  const [Workout, setWorkout] = React.useState<any>({
    date: '',
    exercise: '',
    durationInMinutes: 0
  })

  // State to store all workout records for the selected date
  const [items, setItems] = React.useState<any>([])

  // Function to save workout to the backend
  const saveWorkout = async () => {
    let inputDate = date.format('YYYY-MM-DD')
    // POST request to save workout data
    fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/workouttrack/addworkoutentry', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        date: inputDate,
        exercise: Workout.exercise,
        durationInMinutes: Workout.durationInMinutes
      })
    })
  .then(res => res.json())
  .then(data => {
    if (data.ok) {
      toast.success('Workout entry added successfuly')
      getWorkoutEntry() // Refresh the list of workout items for the selected date
    } else {

      toast.error('Error in adding Workout entry')

    }
  })
  .catch(err => {
    toast.error('Error in adding Workout entry')
    console.log(err)
  })
  }

// Function to get the workout data for the selected date
const getWorkoutEntry = async () => {
  setItems([])
  // POST request to fetch workout data
  fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/workouttrack/getworkoutsbydate', {
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
      console.log(data.data, 'Workout entry data for date')
      toast.success('workout entry for date')
      setItems(data.data) // Update state with fetched items
    } else {

      toast.error('Error in getting workout entry')
}
  })
  .catch(err => {
    toast.error('Error in getting workout entry')
    console.log(err)
  })
}

// Function to delete a specific workout item
const deleteWorkoutEntry = async (item: any) => {
  // DELETE request to remove a workout item
  fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/workouttrack/deleteworkoutentry', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({
      date: item.date,
      exercise: item.exercise,
      durationInMinutes: item.durationInMinutes
    })

  })
  .then(res => res.json())
  .then(data => {
    if (data.ok) {
      toast.success('Workout entry item deleted successfuly')
      getWorkoutEntry() // Refresh the list of items
    } else {
      toast.error('Error in deleting workout entry')
}
  })
  .catch(err => {
    toast.error('Error in deleting workout entry')
    console.log(err)
  })
}

// Effect hook to fetch workout data whenever the date changes
React.useEffect(() => {
  getWorkoutEntry()
}, [date])

// Function to handle date selection change
const selectedDay = (val: any) => {
  setDate(val)
};

// Rendering the Popup Component for workout, including date picker, time picker, input fields, and existing calorie items.
return (
  <div className='popupout'>
    <div className="popupbox">
      <button className='close'
        onClick={() => {
          setShowWorkoutPopup(false)
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

      <TextField id="outlined-basic" label="exercise" variant="outlined" color='warning'
        onChange={(e) => {
                setWorkout({ ...Workout, exercise: e.target.value })
            
        }} />
        <TextField id="outlined-basic" label="duration in minutes" variant="outlined" color='warning' type='number'
        onChange={(e) => {
                setWorkout({ ...Workout, durationInMinutes: e.target.value })
            
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
          saveWorkout
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
              <h3>{item.exercise}</h3>
              <h3>{item.durationInMinutes} minutes</h3>
              <button
              onClick={() => {
                deleteWorkoutEntry(item)
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

export default WorkoutPopup
