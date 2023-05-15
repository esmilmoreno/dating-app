import { createContext, useContext, useReducer, useEffect, useState } from "react";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { addDoc, arrayRemove, arrayUnion, collection, doc, getDocs, limit, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { auth, db, storage } from "./firebase";
import Loading from "./screens/loading";
import { deleteObject, ref } from "firebase/storage";
import { Modal } from "react-native";

const authContext = createContext()

export const useAuth = () => {
  return useContext(authContext)
}

export const AuthProvider = ({ children }) => {
  const [processing, setProcessing] = useState(false)

  const initialState = {
    loading: true,
    myUser: null,
    myProfile: null
  }

  const authReducer = (prevState, action) => {
    switch (action.type) {
      case "AUTH_STATE_CHANGE":
        return {
          ...prevState,
          loading: false,
          myUser: action.user,
          myProfile: action.profile
        }
      case "PROFILE_UPDATED":
        return {
          ...prevState,
          myProfile: action.profile
        }
      default:
        return prevState
    }
  }

  const [authState, dispath] = useReducer(authReducer, initialState)

  function signUp(email, password) {
    return createUserWithEmailAndPassword(auth, email, password)
  }

  function signIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
  }

  function updateProfile(data) {
    return new Promise(async (resolve, reject) => {
      setProcessing(true)

      try {
        const docRef = doc(db, "profiles", authState.myProfile.id)
        await updateDoc(docRef, data)
        resolve()
      } catch (err) {
        reject(err)
      }

      setProcessing(false)
    })
  }

  function updateProfileAsync(data) {
    return new Promise(async (resolve, reject) => {
      try {
        const docRef = doc(db, "profiles", authState.myProfile.id)
        await updateDoc(docRef, data)
        resolve()
      } catch (err) {
        reject(err);
      }
    })
  }

  function addPhoto(photo) {
    return new Promise(async (resolve, reject) => {
      try {
        await updateProfile({ photos: arrayUnion(photo) })
        resolve()
      } catch (error) {
        reject(err)
      }
    })
  }

  function removePhoto(photo) {
    return new Promise(async (resolve, reject) => {
      try {
        const fileRef = ref(storage, photo.fileName)
        await deleteObject(fileRef)

        await updateProfile({ photos: arrayRemove(photo) })
        resolve()
      } catch (err) {
        reject(err)
      }
    })
  }

  function likeProfile(uid) {
    return new Promise(async (resolve, reject) => {
      try {
        await updateProfileAsync({ likes: arrayUnion(uid) })
        await updateProfileAsync({ dislikes: arrayRemove(uid) })
        resolve()
      } catch (err) {
        reject(err)
      }
    })
  }

  function dislikeProfile(uid) {
    return new Promise(async (resolve, reject) => {
      try {
        await updateProfileAsync({ dislikes: arrayUnion(uid) })
        await updateProfileAsync({ likes: arrayRemove(uid) })
        resolve()
      } catch (err) {
        reject(err)
      }
    })
  }

  const contextValue = {
    ...authState,
    signUp,
    signIn,
    signOut: () => signOut(auth),
    updateProfile,
    updateProfileAsync,
    addPhoto,
    removePhoto,
    likeProfile,
    dislikeProfile
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      let profile = null

      if (user) {
        try {
          const q = query(collection(db, "profiles"), where("uid", "==", user.uid), limit(1))
          const result = await getDocs(q)

          if (result.docs[0]) {
            profile = { id: result.docs[0].id, ...result.docs[0].data() }
          } else {
            const newProfile = new Profile(user.uid)
            const createdProfile = await addDoc(collection(db, "profiles"), newProfile)

            profile = {
              ...newProfile,
              id: createdProfile.id
            }
          }
        } catch (err) {
          console.log(err);
        }
      }

      dispath({ type: "AUTH_STATE_CHANGE", user, profile })
    })

    return unsubscribe
  }, [])

  useEffect(() => {
    if(!authState.myProfile) return

    const unsubscribe = onSnapshot(doc(db, "profiles", authState.myProfile.id), result => {
      const profile = { id: result.id, ...result.data() }

      dispath({ type: "PROFILE_UPDATED", profile })
    })

    return unsubscribe

  }, [authState.myUser])

  // useEffect(() => {
  //   const showActive = async () => {
  //     try {
  //       await updateProfileAsync({lastSeen: new Date()})
  //       console.log("Status updated");
  //     } catch (err) {
  //       console.log(err.message);
  //     }
  //   }

  //   showActive()

  //   const interval = window.setInterval(() => {
  //     showActive()
  //   }, 45000)

  //   return () => window.clearInterval(interval)
  // }, [authState])

  if (contextValue.loading) return <Loading />

  return (
    <authContext.Provider value={contextValue}>
      {children}
      <Modal
        visible={processing}
        transparent={true}
        statusBarTranslucent={true}
        children={<Loading opacity={0.325} />}
      />
    </authContext.Provider>
  )
}

class Profile {
  constructor(uid) {
    return {
      fName: "",
      about: "",
      birthDate: new Date(),
      uid: uid,
      profilePhoto: "https://www.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png",
      photos: [],
      likes: [],
      dislikes: []
    }
  }
}