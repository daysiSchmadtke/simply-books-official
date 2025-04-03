'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';
import { useAuth } from '../../utils/context/authContext';
import { createAuthor, updateAuthor } from '../../api/authorData';

// Step one - set an initial state for the form.
const initialFormState = {
  first_name: '',
  last_name: '',
  email: '',
  favorite: false,
};

// Step two - Set initialFormState as the default parameter. Grab the useAuth hook. Set a useState inside AuthorForm. Initialize router object.
function AuthorForm({ obj = initialFormState }) {
  const [formInput, SetFormInput] = useState(obj);
  const router = useRouter();
  const { user } = useAuth();

  // Step three - useEffect
  useEffect(() => {
    if (obj.firebaseKey) SetFormInput(obj);
  }, [obj, user]);

  // Step four - handleChange. Will be used as a callback function.
  const handleChange = (e) => {
    const { name, value } = e.target;
    SetFormInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Step 4 - handleSubmit.
  const handleSubmit = (e) => {
    e.preventDefault();
    if (obj.firebaseKey) {
      //
      updateAuthor(formInput).then(() => router.push(`/authors/${obj.firebaseKey}`));
    } else {
      // New Payload? Push the payload to Firebase, update/patch payload with the Firebase key that FB would return.
      const payload = { ...formInput, uid: user.uid };
      // Monitor what happens when sending payloads as a PUT request in Postman.
      createAuthor(payload).then(({ name }) => {
        const patchPayload = { firebaseKey: name };
        updateAuthor(patchPayload).then(() => {
          router.push('/authors');
        });
      });
    }
  };

  return (
    <div className="container text-center">
      <div className="row">
        <h1>Author Form</h1>
      </div>

      <div className="row" style={{ width: '70%' }}>
        <Form onSubmit={handleSubmit} className="d-flex flex-column text-center">
          {/* TODO: Each Form.Control needs an onChange attribute. Pass in handleChange as a callback. */}
          <Form.Group className="mb-3" controlId="">
            <Form.Label>First name</Form.Label>
            <Form.Control type="textbox" placeholder="John" name="first_name" value={formInput.first_name || ''} onChange={handleChange} required />
            <Form.Text className="text-muted">required</Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="">
            <Form.Label>Last name</Form.Label>
            <Form.Control type="textbox" placeholder="Doe" name="last_name" value={formInput.last_name || ''} onChange={handleChange} required />
            <Form.Text className="text-muted">required</Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="johndoe@simplybooks.dev" name="email" value={formInput.email || ''} onChange={handleChange} required />
            <Form.Text className="text-muted">required</Form.Text>
          </Form.Group>

          <Form.Check
            className="text-white mb-3"
            type="switch"
            id="favorite"
            name="favorite"
            label="Favorite"
            checked={formInput.favorite || false}
            onChange={(e) => {
              SetFormInput((prevState) => ({
                ...prevState,
                favorite: e.target.checked,
              }));
            }}
          />

          <button className="btn btn-primary" type="submit">
            {obj.firebaseKey ? 'Update' : 'Create'} Author
          </button>
        </Form>
      </div>
    </div>
  );
}

AuthorForm.propTypes = {
  obj: PropTypes.shape({
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    email: PropTypes.string,
    favorite: PropTypes.bool,
    firebaseKey: PropTypes.string,
  }),
};

export default AuthorForm;
