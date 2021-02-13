import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyCW-kxLm3uqI1A7arJ3lGDOxRgHm7rgKDE",
  authDomain: "ismailschatapp.firebaseapp.com",
  projectId: "ismailschatapp",
  storageBucket: "ismailschatapp.appspot.com",
  messagingSenderId: "1027678875014",
  appId: "1:1027678875014:web:1e1e7010727f7c4d379007"
})

const auth = firebase.auth();
const firestore = firebase.firestore();
const analytics = firebase.analytics();


function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>🔥💬 Chat</h1>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>

    </div>
  );
}

function SignIn() {

  const signInWithFacebook = () => {
    const provider = new firebase.auth.FacebookAuthProvider();
    auth.signInWithPopup(provider);
  }

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return (
    <>
    <h1 id="logga_in">Logga in</h1>
      <button className="sign-in" onClick={signInWithFacebook}><img src="https://facebookbrand.com/wp-content/uploads/2019/04/f_logo_RGB-Hex-Blue_512.png?w=512&h=512"></img></button>
      <br></br>
      <button className="sign-in" onClick={signInWithGoogle}><img src="https://kgo.googleusercontent.com/profile_vrt_raw_bytes_1587515358_10512.png"></img></button>
    </>
  )

}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Logga ut</button>
  )
}


function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL,displayName } = auth.currentUser;
    var user_uid = auth.currentUser["providerData"];
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      displayName,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (<>
    <main>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>

    </main>

    <form onSubmit={sendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Meddelande..." />

      <button type="submit" disabled={!formValue}>Skicka</button>

    </form>
  </>)
}


function ChatMessage(props) {
  const { text, uid, photoURL, displayName } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
  <div className={`${messageClass}_message_owner_name`}>{displayName}</div>
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://graph.facebook.com/1315614605479081/picture'} />
      <p>{text}</p>
    </div>
  </>)
}


export default App;
