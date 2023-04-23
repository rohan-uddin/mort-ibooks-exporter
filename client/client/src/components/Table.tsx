import React from 'react';
import tw from 'tailwind-styled-components';
import Checkbox from './Checkbox';

// const allBooks = [
//     {
//       title: 'Metamagical Themas',
//       author: 'Douglas R. Hofstadter',
//       checked: false,
//     },
//     {
//         title: 'Book 2',
//         author: 'Jane Cooper',
//         checked: false,
//     },
//     {
//         title: 'Book 3',
//         author: 'John Cooper',
//         checked: false,
//     },
//     // More people...
// ];

const ButtonSelect = tw.button`
  text-white 
  bg-blue-600 
  hover:bg-blue-800 
  font-medium
  uppercase
  tracking-wider
  rounded-lg 
  text-xs 
  mx-2
  px-4 
  py-2.5 
  text-center 
  inline-flex 
  items-center 
`;

const ButtonSubmit = tw.button`
  text-white 
  bg-green-400 
  hover:bg-green-600 
  font-medium
  uppercase
  tracking-wider
  rounded-lg 
  text-xs 
  mx-2
  px-4 
  py-2.5 
  text-center 
  inline-flex 
  items-center 
`;

const Table = () => {
    
    const [bookData, setData] = React.useState<any[]>([]);

    React.useEffect(() => {
        fetch("http://localhost:3001/api/titles")
        .then((res) => res.json())
  
        .then((data) => {
            // To test smaller datasets, just use data.book_titles.slice(92,120)
            setData((bookData) => data.book_titles);
        });
        console.log("BookData in Table.tsx", bookData)
    }, []);
    
    
    const updateCheckStatus = (index: any) => {
        setData(
            bookData.map((book, currentIndex) =>
                currentIndex === index 
                ? {...book, checked: !book.checked} 
                : book
            )
        )
        console.log("Checkbox was checked! for book: ", bookData[index].title)
    }

    const selectAll = () => {
        setData(bookData.map(book => ({ ...book, checked: true })))
    }
    const unSelectAll = () => {
        setData(bookData.map(book => ({ ...book, checked: false })))
    }

    const getChecked = () => {
        // const dialog = document.querySelector("dialog")
        // dialog?.showModal()
        
        const checkedBooks = bookData.filter(book => book.checked)
        console.log("Checked books: ", checkedBooks)

        // send a POST request to the server with the checked books
        fetch("http://localhost:3001/api/receiver", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(checkedBooks),
        })
        .then((response) => response.json())
        .then((data) => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });

        return checkedBooks
    }

    return (
        <div className="flex flex-col max-width-md">
          <div className="flex flex-row justify-center">
            <ButtonSelect onClick={selectAll}>Select All</ButtonSelect>
            <ButtonSelect onClick={unSelectAll}>Unselect All</ButtonSelect> 
            <ButtonSubmit onClick={getChecked}>Submit</ButtonSubmit> 
            {/* <dialog>
                "You have selected: !"
            </dialog> */}
          </div>
          <div className="mt-2 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-auto relative border-b border-gray-200 sm:rounded-lg">
                <table className="table-fixed divide-y divide-gray-200">

                  <thead className="bg-gray-50 w-full">
                    <tr>
                      <th
                        scope="col"
                        className="w-52 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Title
                      </th>
                      <th
                        scope="col"
                        className="w-52 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Author
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-gray-200">
                    {/* MAP OVER THE Books list */}
                    {bookData.map((book, index) => (
                      <tr key={book.bookID}>
                        <td className="px-6 py-4 whitespace-normal">
                          <div className="flex items-center">
                            
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{book.title}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{book.author}</div>
                        </td>
                        
                        {/* Checkboxes */}
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Checkbox 
                            key={book.bookID}
                            isChecked={book.checked}
                            checkHandler={() => updateCheckStatus(index)}
                            label={book.title}
                            index={index}/>
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            </div>
          </div>
          
          {/* <pre>{JSON.stringify(bookData, null, 2)}</pre> */}
        </div>
        
      );
  };

export default Table;

// Checkbox logic from https://dev.to/collegewap/how-to-work-with-checkboxes-in-react-44bc