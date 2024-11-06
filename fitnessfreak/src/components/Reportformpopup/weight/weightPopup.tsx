import React from 'react'
import './weight.css'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AiFillDelete, AiOutlineClose } from 'react-icons/ai'
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { toast, ToastContainer } from 'react-toastify';

interface WeightPopupProps {
  setShowWeightPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

// Component to manage weight input and display for a selected date
const WeightPopup: React.FC<WeightPopupProps> = ({ setShowWeightPopup }) => {
  // State for managing selected date, time, and weight data
  const [date, setDate] = React.useState<any>(dayjs(new Date()))
  const [time, setTime] = React.useState<any>(dayjs(new Date()))
  const [Weight, setWeight] = React.useState<any>({
    date: '',
    weight: 0
  })
  
  // State to store all weight records for the selected date
  const [items, setItems] = React.useState<any>([])

  // Function to save weight to the backend
  const saveWeight = async () => {
    let inputDate = date.format('YYYY-MM-DD')
    // POST request to save weight data
    fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/weighttrack/addweightentry', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        date: inputDate,
        weight: Weight.weight
      })
    })
  .then(res => res.json())
  .then(data => {
    if (data.ok) {
      toast.success('Weight entry added successfuly')
      getWeightEntry() // Refresh the list of weight items for the selected date
    } else {

      toast.error('Error in adding Weight entry')

    }
  })
  .catch(err => {
    toast.error('Error in adding Weight entry')
    console.log(err)
  })
  }

// Function to get the weight data for the selected date
const getWeightEntry = async () => {
  setItems([])
  // POST request to fetch weight data
  fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/weighttrack/getweightbydate', {
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
      console.log(data.data, 'Weight entry data for date')
      toast.success('weight entry for date')
      setItems(data.data) // Update state with fetched items
    } else {

      toast.error('Error in getting weight entry')
}
  })
  .catch(err => {
    toast.error('Error in getting weight entry')
    console.log(err)
  })
}

// Function to delete a specific weight item
const deleteWeightEntry = async (item: any) => {
  // DELETE request to remove a weight item
  fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/weighttrack/deleteweightentry', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({
      date: item.date,
      weight: item.weight

    })

  })
  .then(res => res.json())
  .then(data => {
    if (data.ok) {
      toast.success('Weight entry item deleted successfuly')
      getWeightEntry() // Refresh the list of items
    } else {

      toast.error('Error in deleting weight entry')
}
  })
  .catch(err => {
    toast.error('Error in deleting weight entry')
    console.log(err)
  })
}

// Effect hook to fetch weight data whenever the date changes
React.useEffect(() => {
  getWeightEntry()
}, [date])

// Function to handle date selection change
const selectedDay = (val: any) => {
  setDate(val)
};

// Rendering the Popup Component for weight, including date picker, input fields, and existing calorie items.
return (
  <div className='popupout'>
    <div className="popupbox">
      <button className='close'
        onClick={() => {
          setShowWeightPopup(false)
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

      <TextField id="outlined-basic" label="Weight in KG" variant="outlined" color='warning' type='number'
        onChange={(e) => {
                setWeight({ ...Weight, weight: e.target.value })
            
        }} />
      

      <Button variant='contained' color='warning'
        onClick={
          saveWeight
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
              <h3>{item.weight} KG</h3>
              <button
              onClick={() => {
                deleteWeightEntry(item)
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

export default WeightPopup
