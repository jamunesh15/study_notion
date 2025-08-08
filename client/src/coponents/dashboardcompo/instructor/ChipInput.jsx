// Importing React hook for managing component state
import { useEffect, useState, useRef } from "react"
// Importing React icon component
import { MdClose, MdAdd } from "react-icons/md"
import { useSelector } from "react-redux"

// Defining a functional component ChipInput
export default function ChipInput({
  // Props to be passed to the component
  label,
  name,
  placeholder,
  register,
  errors,
  setValue,
  getValues,
}) {
  const { editCourse, course } = useSelector((state) => state.course)

  // Setting up state for managing chips array
  const [chips, setChips] = useState([])
  const [inputValue, setInputValue] = useState("")
  const inputRef = useRef(null)

  useEffect(() => {
    if (editCourse) {
      // console.log(course)
      setChips(course?.tag)
    }
    register(name, { required: true, validate: (value) => value.length > 0 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setValue(name, chips)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chips])

  // Function to add a chip
  const addChip = (value = inputValue) => {
    // Get the input value and remove any leading/trailing spaces
    const chipValue = value.trim()
    // Check if the input value exists and is not already in the chips array
    if (chipValue && !chips.includes(chipValue)) {
      // Add the chip to the array and clear the input
      const newChips = [...chips, chipValue]
      setChips(newChips)
      setInputValue("")
      if (inputRef.current) {
        inputRef.current.value = ""
      }
    }
  }

  // Function to handle user input when chips are added
  const handleKeyDown = (event) => {
    // Check if user presses "Enter" or ","
    if (event.key === "Enter" || event.key === ",") {
      // Prevent the default behavior of the event
      event.preventDefault()
      addChip(event.target.value)
    }
  }

  // Function to handle input change
  const handleInputChange = (event) => {
    setInputValue(event.target.value)
  }

  // Function to handle add button click
  const handleAddClick = () => {
    addChip()
  }

  // Function to handle deletion of a chip
  const handleDeleteChip = (chipIndex) => {
    // Filter the chips array to remove the chip with the given index
    const newChips = chips.filter((_, index) => index !== chipIndex)
    setChips(newChips)
  }

  // Render the component
  return (
    <div className="flex flex-col gap-2  ">
      {/* Render the label for the input */}
      <label className="text-sm text-richblack-5" htmlFor={name}>
        {label} <sup className="text-pink-200">*</sup>
      </label>
      
      {/* Render the chips */}
      <div className="flex w-full flex-wrap gap-2 mb-2">
        {/* Map over the chips array and render each chip */}
        {chips.map((chip, index) => (
          <div
            key={index}
            className="flex items-center rounded-full bg-yellow-400 px-3 py-1 text-sm text-richblack-900"
          >
            {/* Render the chip value */}
            <span>{chip}</span>
            {/* Render the button to delete the chip */}
            <button
              type="button"
              className="ml-2 focus:outline-none hover:bg-yellow-500 rounded-full p-1 transition-colors"
              onClick={() => handleDeleteChip(index)}
              aria-label={`Remove ${chip} tag`}
            >
              <MdClose className="text-sm" />
            </button>
          </div>
        ))}
      </div>

      {/* Input and Add Button Container */}
      <div className="flex gap-2 items-center">
        {/* Render the input for adding new chips */}
        <input
          ref={inputRef}
          id={name}
          name={name}
          type="text"
          value={inputValue}
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
          onChange={handleInputChange}
          className="flex-1 bg-richblack-700 outline-none p-3 rounded-lg text-richblack-5 border border-richblack-600 focus:border-yellow-50 focus:ring-1 focus:ring-yellow-50 transition-colors"
        />
        
        {/* Add Button for mobile users */}
        <button
          type="button"
          onClick={handleAddClick}
          disabled={!inputValue.trim()}
          className="bg-yellow-50 hover:bg-yellow-100 disabled:bg-richblack-600 disabled:text-richblack-400 text-richblack-900 font-medium px-4 py-3 rounded-lg transition-colors flex items-center gap-1 text-sm disabled:cursor-not-allowed"
          aria-label="Add tag"
        >
          <MdAdd className="text-lg w-[15px]  " />
          <span className="hidden sm:inline">Add</span>
        </button>
      </div>

      {/* Helper text */}
      <p className="text-xs text-richblack-300 mt-1">
        Type a tag and press Enter, comma, or click Add button
      </p>
      {/* Render an error message if the input is required and not filled */}
      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {label} is required
        </span>
      )}
    </div>
  )
}
