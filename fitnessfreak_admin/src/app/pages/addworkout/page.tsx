"use client"
import React from 'react'
import './addworkout.css'
import { toast, ToastContainer } from 'react-toastify';

// Defining interfaces for the structure of the workout and exercises
interface Workout {
    name: string;
    description: string;
    durationInMinutes: number;
    exercises: Exercise[];
    imageURL: string;
    imageFile: File |null;
}


interface Exercise {
    name: string;
    description: string;
    sets: number;
    reps: number;
    imageURL: string;
    imageFile: File |null;
}

const page = () => {
    // State hooks for workout and exercise details
    const [workout, setWorkout] = React.useState<Workout>({
    name: '',
    description: '',
    durationInMinutes: 0,
    exercises: [],
    imageURL: '',
    imageFile: null
});

const [exercise, setExercise] = React.useState<Exercise>({
    name: '',
    description: '',
    sets: 0,
    reps: 0,
    imageURL: '',
    imageFile: null
});

// Handler to manage workout input changes
const handleWorkoutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWorkout({
        ...workout,
        [e.target.name]: e.target.value
    })
}

// Handler to manage exercise input changes
const handleExerciseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExercise({
        ...exercise,
        [e.target.name]: e.target.value
    })
}

// Function to add exercise to the workout
const addExerciseToWorkout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // Check if all exercise fields are filled
    if (exercise.name === '' || exercise.description === '' || exercise.sets === 0 || exercise.reps === 0 || exercise.imageFile === null) {
        toast.error('Please fill all the fields', {});
        return;
    }

    // Upload the exercise image and get the URL
    const imgURL = await uploadImage(exercise.imageFile);
    if (imgURL) {
        const newExercise = {
            ...exercise,
            imageURL: imgURL, // Add the URL here
        };

        // Add the new exercise to the workout's exercise list
        setWorkout({
            ...workout,
            exercises: [...workout.exercises, newExercise],
        });
        console.log('Added exercise:', newExercise);
    } else {
        toast.error('Failed to upload exercise image.', {});
    }
};

// Function to remove an exercise from the workout
const deleteExerciseToWorkout = (index:number) => {
    setWorkout({
        ...workout,
        exercises: workout.exercises.filter((exercise,i) => i != index)
    })
}

// Function to upload an image (workout or exercise)
const uploadImage = async(image: File) => {
    const formData = new FormData();
    formData.append('myimage', image);
    // Send the image to the backend for upload
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/image-upload/uploadimage`,{
        method: 'POST',
        body: formData,
    })

    if(response.ok){
        const data = await response.json();
        console.log('Image uploaded successfuly:', data);
        return data.imageUrl;
    }
    else{
        console.error('Failed to upload the image.');
        return null;
    }
}

// Function to check if the admin is logged in
const checkLogin = async() => {
    const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/admin/checklogin', {
        
        method: 'GET',
        headers:{
            'Content-Type': 'application/json'
        },
        credentials: 'include'
        });

        if(response.ok){
            console.log('Admin is authenticated');
        }
        else{
            console.log('Admin is not authenticated');
            window.location.href = '/adminauth/login'
        }
    }

    // Function to save the workout to the backend
    const saveWorkout = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        await checkLogin();
        
        console.log(workout);

        // Validate that all fields are filled out
        if (
            workout.name === '' || 
            workout.description === '' || 
            workout.durationInMinutes === 0 || 
            workout.imageFile === null || 
            workout.exercises.length === 0
        ) {
            toast.error('Please fill all the fields', {});
            return;
        }
    
        // Upload the workout image if provided
        if (workout.imageFile) {
            const imageURL = await uploadImage(workout.imageFile);
            if (imageURL) {
                workout.imageURL = imageURL; 
            } else {
                toast.error('Failed to upload workout image', {});
                return;
            }
        }
    
        // Upload images for each exercise and create the final workout object
        const updatedExercises = await Promise.all(workout.exercises.map(async (exercise) => {
            if (exercise.imageFile) {
                const imgURL = await uploadImage(exercise.imageFile);
                if (imgURL) {
                    return { ...exercise, imageURL: imgURL };
                } else {
                    toast.error(`Failed to upload image for exercise: ${exercise.name}`, {});
                    return null; 
                }
            }
            return exercise; 
        }));
    
        // Filter out any exercises that failed to upload an image
        const filteredExercises = updatedExercises.filter(exercise => exercise !== null);
        // Create the final workout object
        const finalWorkout = {
            ...workout,
            exercises: filteredExercises, 
        };
    
        console.log(finalWorkout);
        // Send the workout data to the backend for saving
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/workoutplans/workouts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(finalWorkout),
            credentials: 'include',
        });
    
        if (response.ok) {
            const data = await response.json();
            console.log('Workout created successfully', data);
            toast.success('Workout created successfully', {});
        } else {
            console.error('Workout creation failed', response.statusText);
            toast.error('Workout creation failed', {});
        }
    };
    
  return (
    <div className='formpage'>
        <h1 className='tilte'>Add Workout</h1>
        <input
                                    type = 'text'
                                    placeholder="Workout Name"
                                    name='name'
                                    value = {workout.name}
                                    onChange={handleWorkoutChange}/>

                                    <textarea
                                    placeholder="Workout Description"
                                    name='description'
                                    value = {workout.description}
                                    onChange={(e) => {
                                        setWorkout({
                                            ...workout,
                                            description: e.target.value
                                        })
                                    }}

                                    rows={5}
                                    cols={50}
                                    />
                                    <input
                                    type = 'number'
                                    placeholder="Workout Duration"
                                    name='durationInMinutes'
                                    value = {workout.durationInMinutes}
                                    onChange={handleWorkoutChange}/>

<input
                                    type='file'
                                    placeholder="Workout Image"
                                    name='workout image'
                                    onChange={(e) => {
                                        setWorkout({
                                            ...workout,
                                            imageFile: e.target.files![0]
                                        })
                                    }}
                                    />
                                    <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center',

                                    }}>
                                        <h1 className="title">
                                            Add Exercise to Workout
                                        </h1>
                                        <input
                                    placeholder="Exercise Name"
                                    name='name'
                                    value = {exercise.name}
                                    onChange={handleExerciseChange}
                                    />
                                                                        <textarea
                                    placeholder="Exerercise Description"
                                    name='description'
                                    value = {exercise.description}
                                    onChange={(e) => {
                                        setExercise({
                                            ...exercise,
                                            description: e.target.value
                                        })
                                    }}

                                    rows={5}
                                    cols={50}
                                    />

                                    <label htmlFor="sets"></label>
                                    <input 
                                    type="number"
                                    placeholder='Sets'
                                    name='sets'
                                    value={exercise.sets}
                                    onChange={handleExerciseChange}

                                     />

<label htmlFor="reps"></label>
                                    <input 
                                    type="number"
                                    placeholder='Reps'
                                    name='reps'
                                    value={exercise.reps}
                                    onChange={handleExerciseChange}

                                     />

<input
                                    type = 'file'
                                    placeholder="Exercise Image"
                                    name='exerciseImage'
                                    onChange={(e) =>{ 
                                        setExercise({
                                            ...exercise,
                                            imageFile: e.target.files![0]
                                        })
                                    }}
                                    />
                                    <button onClick={(e) => {
                                        addExerciseToWorkout(e)
                                    }}>Add Exercise</button>

                                    </div>

<div className="exercises">{
    workout.exercises.map((exercise, index) =>(
        <div className="exercise" key={index}>
            <h2>{exercise.name}</h2>
            <p>{exercise.description}</p>
            <p>{exercise.sets}</p>
            <p>{exercise.reps}</p>

            <img src={
                exercise.imageFile ?
                URL.createObjectURL(exercise.imageFile) :
                exercise.imageURL
            } alt="" />

<button onClick={() => 
                                        deleteExerciseToWorkout(index)
                                    }>Delete</button>

        </div>
    ) 
    )
}
</div>

                                    <button onClick={(e) => {
                                        saveWorkout(e)
                                    }}>Save Workout</button>

                                    
                                
    </div>
  )
}

export default page
