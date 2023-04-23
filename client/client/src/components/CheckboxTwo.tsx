import { useState } from "react"

const allToppings = [
  { name: "Golden Corn", checked: false },
  { name: "Paneer", checked: false },
  { name: "Tomato", checked: false },
  { name: "Mushroom", checked: false },
  { name: "Onion", checked: false },
  { name: "Black Olives", checked: false },
]

export const Checkbox = ({ isChecked, label, checkHandler, index }: any) => {
  console.log({ isChecked })
  return (
    <div>
      <input
        type="checkbox"
        id={`checkbox-${index}`}
        checked={isChecked}
        onChange={checkHandler}
      />
      <label htmlFor={`checkbox-${index}`}>{label}</label>
    </div>
  )
}

function CheckboxTwo() {
  const [toppings, setToppings] = useState(allToppings)

  const updateCheckStatus = (index: any) => {
    setToppings(
      toppings.map((topping, currentIndex) =>
        currentIndex === index
          ? { ...topping, checked: !topping.checked }
          : topping
      )
    )

    // or
    // setToppings([
    //   ...toppings.slice(0, index),
    //   { ...toppings[index], checked: !toppings[index].checked },
    //   ...toppings.slice(index + 1),
    // ]);
  }

  const selectAll = () => {
    setToppings(toppings.map(topping => ({ ...topping, checked: true })))
  }
  const unSelectAll = () => {
    setToppings(toppings.map(topping => ({ ...topping, checked: false })))
  }

  return (
    <div className="App">
      <p>
        <button onClick={selectAll}>Select All</button>
        <button onClick={unSelectAll}>Unselect All</button>
      </p>

      {toppings.map((topping, index) => (
        <Checkbox
          key={topping.name}
          isChecked={topping.checked}
          checkHandler={() => updateCheckStatus(index)}
          label={topping.name}
          index={index}
        />
      ))}
      <p>
        <pre>{JSON.stringify(toppings, null, 2)}</pre>
      </p>
    </div>
  )
}

export default CheckboxTwo;
