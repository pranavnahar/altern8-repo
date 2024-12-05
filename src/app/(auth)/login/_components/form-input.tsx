import React from 'react'

interface Props {
  name: string
  placeholder: string
  type: string
  required?: boolean
  label: string
}

const FormInput = ({ name, placeholder, type, required = false, label }: Props) => {
  return (
    <div className="w-full mx-2 flex-1">
      <div className="font-bold h-6 mt-3 text-gray-300 text-xs leading-8 uppercase">
        {label}
      </div>
      <input
        name={name}
        className="py-1 w-full text-gray-100 border-b-2 bg-transparent outline-none focus:border-purple-600 transition-colors"
        type={type}
        required={required}
      />
    </div>
  )
}

export default FormInput
