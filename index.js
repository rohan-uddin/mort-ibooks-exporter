const ibooks = require('./src/ibooks');
const fs = require("fs");
const bodyParser = require('body-parser');
const currentDate = new Date();
// let bookTitle
// let bookAuthor

// Setting up a node server
const express = require("express");
const cors = require("cors");

const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Settin up a GET endpoint
app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

// Setting up a POST endpoint
app.post('/api/receiver', (req, res) => {
  const jsonData = req.body;
  console.log(jsonData)
  // Handle the JSON data as needed
  jsonData.forEach(element => {
    // console.log(element)
    sendAnnotations(element.bookID, element.title, element.author)
  });

  // Send the response back to the client
  res.status(200).json(jsonData);
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});


// FUNCTIONS BELOW

// ibooks.getBooks().then((value)=>{
//     // console.log(value)
//     // To get book title based on book Id (TODO: we actually want bookId based on booktitle)

//     // Creating a list of Book Titles from the value object
//     // const bookTitles = []

//     // for (const bookId in value) {
//     //   bookTitles.push(value[bookId].title)
//     // }
//     // console.log(bookTitles.slice(0, 10))


//     const bookSearchID = "273FDADA70F0AFFD23AFE36B75967D7B"
//     if (bookSearchID in value) {
//         // console.log("Title:", value[bookSearchID].title);
//         bookTitle = value[bookSearchID].title
//         bookAuthor = value[bookSearchID].author
//       } else {
//         console.log("Book not found");
//       }
// })

function formatBookJSON(rawTableData) {
  return {
    bookID: rawTableData.bookID,
    title: rawTableData.title,
    author: rawTableData.author,
    checked: false,
  };
}

async function getBookTitles() {
  try {
    const value = await ibooks.getBooks();
    const bookData = [];

    for (const row in value) {
      bookData.push(formatBookJSON(value[row]));
    }
    console.log(bookData[90])
    return bookData;

  } catch (error) {
    console.error(error);
  }
}


getBookTitles().then((bookTitles) => {
  // console.log("Book Titles:", bookTitles);
  // console.log("");
  // filter those names that have a bookID of length 32
  const filteredBookTitles = bookTitles.filter((book) => book.bookID.length === 32);
  app.get("/api/titles", (req, res) => {
    res.json({ book_titles: filteredBookTitles});
  });
});

function sendAnnotations(bookID, bookTitle, bookAuthor) {
  ibooks.getAnnotations().then((value) => {
    // console.log(value[0]);
    // result gives you a filtered object with annotations specific to the book!
    const result = value.filter(annot => annot.bookId == bookID)
    // console.log(result)

    // Writing to a markdown file
    let markdownOut = ""
    markdownOut += `title::  ${bookTitle} (highlights)\n`
    markdownOut += `author:: [[${bookAuthor}]]\n`
    markdownOut += `full-title:: ${bookTitle}\n`
    markdownOut += `category:: #books #Inbox \n`
    markdownOut += `url:: \n`
    markdownOut += `tags:: \n\n`
    markdownOut += `- Highlights synced manually [[${formatDate(currentDate)}]]\n`
    

    result.forEach(element => {
        markdownOut += `\t- ${element.selectedText}\n`
        if (element.note) {markdownOut += `\t\t- ${element.note}\n`}
    });

    path = 'exports'
    if (fs.existsSync(path)) {
      console.log('Folder exists!');
      fs.writeFile(`exports/${bookTitle} (highlights).md`, markdownOut, err => {
        if (err) throw err;
        console.log("Data written to file");
      });
    } else {
      console.log('Folder does not exist, making now...');
      fs.mkdir('exports', (err) => {
        if (err) {
          console.error(err);
        } else {
          fs.writeFile(`exports/${bookTitle} (highlights).md`, markdownOut, err => {
            if (err) throw err;
            console.log("Data written to file");
          });
        }
      });
    }

    // fs.writeFile(`exports/${bookTitle} (highlights).md`, markdownOut, err => {
    //     if (err) throw err;
    //     console.log("Data written to file");
    // });

    // fs.close();
  });
  return true
}

// ibooks.getAnnotations().then((value) => {
//     // console.log(value[0]);
//     // result gives you a filtered object with annotations specific to the book!
//     const result = value.filter(annot => annot.bookId == "273FDADA70F0AFFD23AFE36B75967D7B")
//     console.log(result)

//     // Writing to a markdown file
//     let markdownOut = ""
//     markdownOut += `title::  ${bookTitle} (highlights)\n`
//     markdownOut += `author:: [[${bookAuthor}]]\n`
//     markdownOut += `full-title:: ${bookTitle}\n`
//     markdownOut += `category:: #books #Inbox \n`
//     markdownOut += `url:: \n`
//     markdownOut += `tags:: \n\n`
//     markdownOut += `- Highlights synced manually [[${formatDate(currentDate)}]]\n`
    

//     result.forEach(element => {
//         markdownOut += `\t- ${element.selectedText}\n`
//         if (element.note) {markdownOut += `\t\t- ${element.note}\n`}
//     });

//     fs.writeFile(`${bookTitle} (highlights).md`, markdownOut, err => {
//         if (err) throw err;
//         console.log("Data written to file");
//     });
// })

function formatDate(dateObj) {
    const options = { year: "numeric", month: "long", day: "numeric" };

    const formatter = new Intl.DateTimeFormat("en-US", options);
    const formattedDate = formatter.format(dateObj).replace(/\b\d{1,2}\b/, match => match + getDaySuffix(match));

    // console.log(formattedDate); // Output: June 22nd, 2022
    return formattedDate

    function getDaySuffix(day) {
        const suffixes = ["th", "st", "nd", "rd"];
        const relevantDigits = (day < 30) ? day % 20 : day % 30;
        const suffix = (relevantDigits <= 3) ? suffixes[relevantDigits] : suffixes[0];
        return suffix;
    }
}

// module.exports = booksList
// console.log(booksList)
// console.log("The COPIED booksList is a", typeof booksList)

// createJSON()



/*
Example format from getAnnotations()
{
    representativeText: 'Scott Eastman told me that he “never completely fit in one world.” He grew up in Oregon and competed in math and science contests, but in college he studied English literature and fine arts. He has been a bicycle mechanic, a housepainter, founder of a housepainting company, manager of a multimillion-dollar trust, a photographer, a photography teacher, a lecturer at a Romanian university—in subjects ranging from cultural anthropology to civil rights—and, most unusually, chief adviser to the mayor of Avrig, a small town in the middle of Romania. In that role, he did everything from helping integrate new technologies into the local economy to dealing with the press and participating in negotiations with Chinese business leaders.\n' +
      '\t\t\t',
    selectedText: 'Scott Eastman told me that he “never completely fit in one world.” He grew up in Oregon and competed in math and science contests, but in college he studied English literature and fine arts. He has been a bicycle mechanic, a housepainter, founder of a housepainting company, manager of a multimillion-dollar trust, a photographer, a photography teacher, a lecturer at a Romanian university—in subjects ranging from cultural anthropology to civil rights—and, most unusually, chief adviser to the mayor of Avrig, a small town in the middle of Romania. In that role, he did everything from helping integrate new technologies into the local economy to dealing with the press and participating in negotiations with Chinese business leaders',
    createdOn: '2023-03-23 22:42:06',
    updatedOn: '2023-03-23 22:42:16',
    note: '#Consilience',
    chapter: null,
    bookId: 'DAF1E501EE7D6AAF3F0C2FB8CB1B3AC5',
    deleted: false,
    book: {
      title: 'Range',
      author: 'David Epstein',
      filePath: '/Users/rohanuddin/Library/Mobile Documents/iCloud~com~apple~iBooks/Documents/Range.epub'
    }
  }
*/