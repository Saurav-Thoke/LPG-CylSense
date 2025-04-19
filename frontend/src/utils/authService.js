import firebase from 'firebase/app';
import 'firebase/auth';

// Example for Firebase login (email and password)
firebase.auth().signInWithEmailAndPassword(email, password)
  .then((userCredential) => {
    // Get Firebase ID token
    userCredential.user.getIdToken()
      .then((idToken) => {
        // Send token to your backend for verification
        fetch('http://localhost:4000/api/auth/profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
          },
          body: JSON.stringify({ username: 'User123', email: 'user@example.com' }),
        })
          .then((response) => response.json())
          .then((data) => console.log(data))
          .catch((error) => console.error('Error:', error));
      });
  })
  .catch((error) => console.error('Error signing in:', error));
