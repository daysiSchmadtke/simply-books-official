'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from 'react-bootstrap';
import { getAuthors } from '../../api/authorData';
import { useAuth } from '../../utils/context/authContext';
import AuthorCard from '../../components/AuthorCard';

function AuthorsPage() {
  //  Set a state for Authors
  const [Authors, setAuthors] = useState([]);

  // Get user ID using useAuth Hook
  const { user } = useAuth();

  // create a function that makes the API call to get all the Authors
  const getAllTheAuthors = () => {
    getAuthors(user.uid).then(setAuthors);
  };

  // make the call to the API to get all the Authors on component render
  useEffect(() => {
    getAllTheAuthors();
  }, []);

  return (
    <div className="text-center my-4">
      <Link href="/author/new" passHref>
        <Button>Add An Author</Button>
      </Link>
      <div className="d-flex flex-wrap">
        {/* map over Authors here using BookCard component */}
        {Authors.map((Author) => (
          <AuthorCard key={Author.firebaseKey} AuthorObj={Author} onUpdate={getAllTheAuthors} />
        ))}
      </div>
    </div>
  );
}

export default AuthorsPage;
