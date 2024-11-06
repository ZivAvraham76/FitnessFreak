import React from 'react'
import './popup.css'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AiFillDelete, AiOutlineClose } from 'react-icons/ai'
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { toast, ToastContainer } from 'react-toastify';


interface CaloriIntakePopupProps {
  setShowCalorieIntakePopup: React.Dispatch<React.SetStateAction<boolean>>;
}
// Component to manage calorie intake input and display for a selected date
const CaloriesintakePopup: React.FC<CaloriIntakePopupProps> = ({ setShowCalorieIntakePopup }) => {
  // State for managing selected date, time, and calorie intake data
  const [date, setDate] = React.useState<any>(dayjs(new Date()))
  const [time, setTime] = React.useState<any>(dayjs(new Date()))
  const [Calorieintake, setCalorieIntake] = React.useState<any>({
    item: '',
    date: '',
    quantity: '',
    quantitytype: 'g',
  })

  // State to store all calorie intake records for the selected date
  const [items, setItems] = React.useState<any>([])

  // Function to save calorie intake to the backend
  const saveCalorieIntake = async () => {
    let tempdate = date.format('YYYY-MM-DD')
    let temptime = time.format('HH:mm:ss')
    let tempdatetime = tempdate + ' ' + temptime
    let finaldatetime = new Date(tempdatetime)

    // POST request to save calorie intake data
    fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/calorieintake/addcalorieintake', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        item: Calorieintake.item,
        date: finaldatetime,
        quantity: Calorieintake.quantity,
        quantitytype: Calorieintake.quantitytype

      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          toast.success('Calorie intake added successfuly')
          getCalorieIntake()  // Refresh the list of calorie intake items for the selected date
        } else {

          toast.error('Error in adding calorie intake')

        }
      })
      .catch(err => {
        toast.error('Error in adding calorie intake')
        console.log(err)
      })

  }

  // Function to get the calorie intake data for the selected date
  const getCalorieIntake = async () => {
    setItems([])
    // POST request to fetch calorie intake data
    fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/calorieintake/getcalorieintakebydate', {
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
        if (data.ok) {
          console.log(data.data, 'Calorie intake data for date')
          toast.success('Calorie intake data for date')
          setItems(data.data) // Update state with fetched items
        } else {
          toast.error('Error in getting calorie intake')
        }
      })
      .catch(err => {
        toast.error('Error in getting calorie intake')
        console.log(err)
      })
  }
  // Function to delete a specific calorie intake item
  const deleteCalorieIntake = async (item: any) => {
     // DELETE request to remove a calorie intake item
    fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/calorieintake/deletecalorieintake', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        item: item.item,
        date: item.date
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          toast.success('Calorie intake item deleted successfuly')
          getCalorieIntake() // Refresh the list of items
        } else {

          toast.error('Error in deleting calorie intake')
        }
      })
      .catch(err => {
        toast.error('Error in deleting calorie intake')
        console.log(err)
      })
  }

  // Effect hook to fetch calorie intake data whenever the date changes
  React.useEffect(() => {
    getCalorieIntake()
  }, [date])

  // Function to handle date selection change
  const selectedDay = (val: any) => {
    setDate(val)
  };

  // Rendering the Popup Component for Calorie Intake, including date picker, time picker, input fields, and existing calorie items.
  return (
    <div className='popupout'>
      <div className="popupbox">
        <button className='close'
          onClick={() => {
            setShowCalorieIntakePopup(false)
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

        <TextField id="outlined-basic" label="food item name" variant="outlined" color='warning'
          onChange={(e) => {
            setCalorieIntake({ ...Calorieintake, item: e.target.value })
          }} />
        <TextField id="outlined-basic" label="food item amount (in grams)" variant="outlined" color='warning'
          onChange={(e) => {
            setCalorieIntake({ ...Calorieintake, quantity: e.target.value })
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
            saveCalorieIntake
          }>
          Save
        </Button>
        <div className="hrline"></div>
        <div className="items">
          {
            items.map((item: any) => {
              return (
                <div className="item">
                  <h3>{item.item}</h3>
                  <h3>{item.quantity} {item.quantitype}</h3>
                  <button
                    onClick={() => {
                      deleteCalorieIntake(item)
                    }
                    }><AiFillDelete /></button>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

export default CaloriesintakePopup
