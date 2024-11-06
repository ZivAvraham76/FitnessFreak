import React from 'react'
import './sleep.css'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AiFillDelete, AiOutlineClose } from 'react-icons/ai'
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { toast, ToastContainer } from 'react-toastify';



interface SleepPopupProps {
  setShowSleeepPopup: React.Dispatch<React.SetStateAction<boolean>>;
}
// Component to manage sleep input and display for a selected date
const SleepPopup: React.FC<SleepPopupProps> = ({ setShowSleeepPopup }) => {
  // State for managing selected date, time, and sleep data
  const [date, setDate] = React.useState<any>(dayjs(new Date()))
  const [time, setTime] = React.useState<any>(dayjs(new Date()))
  const [Sleep, setSleep] = React.useState<any>({
    date: '',
    durationInHrs: 0
  })

  // State to store all sleep records for the selected date
  const [items, setItems] = React.useState<any>([])

  // Function to sleep entry to the backend
  const saveSleep = async () => {
    let inputDate = date.format('YYYY-MM-DD')
    // POST request to save sleep entry data
    fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/sleeptrack/addsleepentry', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        date: inputDate,
        durationInHrs: Sleep.durationInHrs
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          toast.success('Sleep entry added successfuly')
          getSleepEntry() // Refresh the list of sleep items for the selected date
        } else {

          toast.error('Error in adding sleep entry')

        }
      })
      .catch(err => {
        toast.error('Error in adding sleep entry')
        console.log(err)
      })
    console.log(inputDate);
    console.log(Sleep.durationInHrs)
  }

  // Function to get the sleep data for the selected date
  const getSleepEntry = async () => {
    setItems([])
    // POST request to fetch sleep data
    fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/sleeptrack/getsleepbydate', {
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
          console.log(data.data, 'Sleep entry data for date')
          toast.success('sleep entry for date')
          setItems(data.data) // Update state with fetched items
        } else {

          toast.error('Error in getting sleep entry')
        }
      })
      .catch(err => {
        toast.error('Error in getting sleep entry')
        console.log(err)
      })
  }
  // Function to delete a specific sleep item
  const deleteSleepEntry = async (item: any) => {
    // DELETE request to remove a sleep item
    fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/sleeptrack/deletesleepentry', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        date: item.date,
        durationInHrs: item.durationInHrs

      })

    })
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          toast.success('Sleep entry item deleted successfuly')
          getSleepEntry(); // Refresh the list of items
        } else {

          toast.error('Error in deleting sleep entry')
        }
      })
      .catch(err => {
        toast.error('Error in deleting sleep entry')
        console.log(err)
      })
  }

  // Effect hook to fetch sleep data whenever the date changes
  React.useEffect(() => {
    getSleepEntry()
  }, [date])

  // Function to handle date selection change
  const selectedDay = (val: any) => {
    setDate(val)
  };

  // Rendering the Popup Component for Sleep, including date picker, input fields, and existing sleep items.
  return (
    <div className='popupout'>
      <div className="popupbox">
        <button className='close'
          onClick={() => {
            setShowSleeepPopup(false)
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

        <TextField id="outlined-basic" label="time in hours" variant="outlined" color='warning' type='number'
          onChange={(e) => {
            setSleep({ ...Sleep, durationInHrs: e.target.value })
          }} />


        <Button variant='contained' color='warning'
          onClick={
            saveSleep
          }>
          Save
        </Button>
        <div className="hrline"></div>
        <div className="items">
          {
            items.map((item: any) => {
              return (
                <div className="item">
                  <h3>{date.format('YYYY-MM-DD')}</h3>
                  <h3>{item.durationInHrs} Hours</h3>
                  <button
                    onClick={() => {
                      deleteSleepEntry(item)
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

export default SleepPopup
