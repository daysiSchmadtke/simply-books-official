'use client';

import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Link from 'next/link';
import { deleteSingleAuthor } from '../api/authorData';
import { deleteAuthorBooksRelationship } from '../api/mergedData';

function AuthorCard({ AuthorObj, onUpdate }) {
  // FOR DELETE, WE NEED TO REMOVE THE Author AND HAVE THE VIEW RERENDER,
  // SO WE PASS THE FUNCTION FROM THE PARENT THAT GETS THE AuthorS
  const deleteThisAuthor = () => {
    if (window.confirm(`Delete ${AuthorObj.first_name} ${AuthorObj.last_name}?`)) {
      deleteSingleAuthor(AuthorObj.firebaseKey)
        .then(deleteAuthorBooksRelationship(AuthorObj.firebaseKey))
        .then(() => onUpdate());
    }
  };

  return (
    <Card style={{ width: '20rem', margin: '10px' }}>
      <Card.Body>
        <Card.Title>
          {AuthorObj.first_name} {AuthorObj.last_name}
        </Card.Title>
        <p className="card-text bold">
          {AuthorObj.favorite && (
            <span>
              💜 <br />
            </span>
          )}{' '}
          {AuthorObj.email}
        </p>
        {/* DYNAMIC LINK TO VIEW THE Author DETAILS  */}
        <Link href={`/authors/${AuthorObj.firebaseKey}`} passHref>
          <Button variant="primary" className="m-2">
            VIEW
          </Button>
        </Link>
        {/* DYNAMIC LINK TO EDIT THE Author DETAILS  */}
        <Link href={`/authors/edit/${AuthorObj.firebaseKey}`} passHref>
          <Button variant="info">EDIT</Button>
        </Link>
        <Button variant="danger" onClick={deleteThisAuthor} className="m-2">
          DELETE
        </Button>
      </Card.Body>
    </Card>
  );
}

AuthorCard.propTypes = {
  AuthorObj: PropTypes.shape({
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    favorite: PropTypes.bool,
    email: PropTypes.string,
    firebaseKey: PropTypes.string,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default AuthorCard;
