import { getSingleBook, deleteBook } from './bookData';
import { getAuthorBooks, getSingleAuthor, deleteSingleAuthor } from './authorData';

// Get data for viewBook
const getBookDetails = (firebaseKey) =>
  new Promise((resolve, reject) => {
    // GET SINGLE BOOK
    getSingleBook(firebaseKey)
      .then((bookObject) => {
        // return single book object, make an API call using this object.
        getSingleAuthor(bookObject.author_id) // we nest this promise so that we can use the book object from above.
          .then((authorObject) => resolve({ ...bookObject, authorObject }));
      })
      .catch(reject);
    // GET AUTHOR
    // Create an object that has book data and an object named authorObject
  });

const getAuthorDetails = (firebaseKey) =>
  new Promise((resolve, reject) => {
    // GET SINGLE AUTHOR
    getSingleAuthor(firebaseKey)
      .then((authorObject) => {
        // return single author object, make an API call using this object.
        getAuthorBooks(authorObject.firebaseKey) // we nest this promise so that we can use the author object from above.
          .then((bookObject) => {
            const test = { ...authorObject, bookObject };
            console.warn(test);
            resolve(test);
          });
      })
      .catch(reject);
  });

// Promise.all ensures that the api calls we're making (to delete the author's books) is completed before making another API call to delete the single author.
const deleteAuthorBooksRelationship = (firebaseKey) =>
  new Promise((resolve, reject) => {
    getAuthorBooks(firebaseKey)
      .then((authorBooksArray) => {
        const deleteBookPromises = authorBooksArray.map((book) => deleteBook(book.firebaseKey));

        Promise.all(deleteBookPromises).then(() => {
          deleteSingleAuthor(firebaseKey).then(resolve);
        });
      })
      .catch(reject);
  });

export { getBookDetails, getAuthorDetails, deleteAuthorBooksRelationship };
