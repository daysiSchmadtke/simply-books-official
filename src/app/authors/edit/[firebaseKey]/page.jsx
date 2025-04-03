'use client';

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import AuthorForm from '../../../../components/forms/AuthorForm';
import { getSingleAuthor } from '../../../../api/authorData';

export default function EditAuthor({ params }) {
  // Step 0 - set a useState for the form.
  const [editItem, SetEditItem] = useState({});

  // Step one - get the firebase key
  const { firebaseKey } = params;

  // Step two - Make an API call to Firebase to get the author data.
  useEffect(() => {
    getSingleAuthor(firebaseKey).then(SetEditItem);
  }, [firebaseKey]);

  // Step three - Pass in the object, editItem, as a prop on AuthorForm.
  return <AuthorForm obj={editItem} />;
}

EditAuthor.propTypes = {
  params: PropTypes.objectOf({}).isRequired,
};
