import { useState } from "react"

const Checkbox = ({ isChecked, label, checkHandler, index }: any) => {
    // console.log({ isChecked })
    return (
      <div>
        <input
          type="checkbox"
          id={`checkbox-${index}`}
          checked={isChecked}
          onChange={checkHandler}
        />
        {/* <label htmlFor={`checkbox-${index}`}>{label}</label> */}
      </div>
    )
  }

export default Checkbox;