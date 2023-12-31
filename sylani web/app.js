const actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be in the authorized domains list in the Firebase Console.
    url: 'https://www.example.com/finishSignUp?cartId=1234',
    // This must be true.
    handleCodeInApp: true,
    iOS: {
      bundleId: 'com.example.ios'
    },
    android: {
      packageName: 'com.example.android',
      installApp: true,
      minimumVersion: '12'
    },
    dynamicLinkDomain: 'example.page.link'
  };



  const app = firebase.initializeApp(firebaseConfig);
console.log(app)

const signup = () => {
    let username = document.getElementById('username').value;
    let contact = document.getElementById('contact').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let role = 'User'

    console.log(email, password)
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            let user = userCredential.user;
            firebase.database().ref('users/' + user.uid).set({
                uid: user.uid,
                username: username,
                role: role,
                contact: contact,
                email: email,
                password: password
            })
                .then(() => {
                    const user = { email: email };
                    localStorage.setItem('user', JSON.stringify(user));
                    console.log('User created successfully.')
                    window.location.href = './singup/singin.html'
                })
                .catch((error) => {
                    console.log(error);
                })
        })
        .catch((error) => {
            let errorCode = error.code;
            let errorMessage = error.message;
            console.log(errorCode + ': ' + errorMessage)
        });
}

const signin = () => {
    let email = document.getElementById('email').value
    let password = document.getElementById('password').value
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            let user = userCredential.user;
            console.log(user)
            const dbRef = firebase.database().ref();
            dbRef.child("users").child(user.uid).get().then((snapshot) => {
                if (snapshot.exists()) {
                    const userData = snapshot.val()
                    if (userData.role === 'Admin') {
                        const user = { email: email };
                        localStorage.setItem('user', JSON.stringify(user));
                        console.log('User created successfully.')
                        window.location.href = '../Admin/items/items.html'
                    }
                    else {
                        const user = { email: email };
                        localStorage.setItem('user', JSON.stringify(user));
                        window.location.href = '.singup/food/new item/categoris.html'
                    }
                } else {
                    console.log("No data available");
                }
            }).catch((error) => {
                console.error(error);
            });
        })
        .catch((error) => {
            let errorCode = error.code;
            let errorMessage = error.message;
            console.log(errorCode + ': ' + errorMessage)
        });

}
