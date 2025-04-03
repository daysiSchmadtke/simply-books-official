'use client';

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAuthorDetails, deleteAuthorBooksRelationship } from '../../../api/mergedData';
import BookCard from '../../../components/BookCard';
// import { useAuth } from '../../../utils/context/authContext';

export default function ViewAuthor({ params }) {
  const { firebaseKey } = params;
  const router = useRouter();

  // const { user } = useAuth();

  // Since on first render, bookObject (an array) will be undefined. Pass in an empty array.
  const [authorDetails, SetAuthorDetails] = useState({ bookObject: [] });

  const getAuthorDetailsHandler = () => {
    getAuthorDetails(firebaseKey).then(SetAuthorDetails);
  };

  useEffect(() => {
    getAuthorDetailsHandler();
  }, [firebaseKey]);

  const deleteAuthorRelationshipFromView = () => {
    if (window.confirm(`Delete ${authorDetails.first_name} ${authorDetails.last_name}?`)) {
      deleteAuthorBooksRelationship(authorDetails.firebaseKey).then(() => {
        router.push('/authors');
        // console.log('DeleteAuthorFromView Event Triggered!');
      });
    }
  };

  return (
    // eslint-disable-next-line react/no-unescaped-entities
    <>
      <h1>Author</h1>
      <h4>
        {authorDetails.first_name} {authorDetails.last_name}
        {authorDetails.favorite === true ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-heart-fill" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314" />
          </svg>
        ) : (
          ''
        )}
      </h4>
      <p>{authorDetails.email}</p>
      <div>
        <Link href="/authors/edit" passHref>
          <button className="btn btn-primary" type="button">
            Edit
          </button>
        </Link>
        <button className="btn btn-secondary" type="button" onClick={deleteAuthorRelationshipFromView}>
          Delete
        </button>
      </div>

      <hr />

      <section id="render-books-here">
        {authorDetails.bookObject.map((obj) => (
          <BookCard key={obj.firebaseKey} bookObj={obj} onUpdate={getAuthorDetailsHandler} />
        ))}
        {/* {console.log(arrayOfBooks)} */}
      </section>
    </>
  );
}

ViewAuthor.propTypes = {
  params: PropTypes.objectOf({}).isRequired,
};
