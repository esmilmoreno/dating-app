import { useState } from "react";
import { View, Text } from "react-native";
import BaseInput from "../components/base-input";
import Button from "../components/button"
import { useAuth } from "../auth-context";

export default function Profile({ navigation }) {
  const { myProfile, updateProfile } = useAuth()
  const [fName, setFName] = useState(myProfile ? myProfile.fName : "")
  const [birthDate, setBirthDate] = useState(() => {
    const date = myProfile ? {
      day: myProfile.birthDate.toDate().getDate(),
      month: myProfile.birthDate.toDate().getMonth() + 1,
      year: myProfile.birthDate.toDate().getFullYear(),
    } : null
    
    return date || {day: "13", month: "06", year: "2004"}
  })
  const [about, setAbout] = useState(myProfile ? myProfile.about : "")

  const handleDateChange = (name, value) => {
    setBirthDate(prev => {
      return {...prev, [name]: value}
    })
  }

  const submit = async () => {
    try {
      const date = new Date(birthDate.month + "/" + birthDate.day + "/" + birthDate.year)
      
      await updateProfile({fName, lName, birthDate: date, about})
      navigation.goBack()
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <View style={{flex: 1, padding: 16}}>
      <BaseInput
        placeholder="First name"
        value={fName}
        onTextChange={setFName}
        style={{marginBottom: 16}}
      />

      <Text style={{color: "gray", marginBottom: 12}}>Date of birth</Text>
      <View style={{display: "flex", flexDirection: "row", marginBottom: 16}}>
        <View style={{flex: 3, marginEnd: 4}}>
          <BaseInput 
            keyboardType={"numeric"}
            placeholder={"Day"}
            value={birthDate.day.toString()}
            onTextChange={value => handleDateChange("day", value)}
          />
        </View>
        <View style={{flex: 3, marginHorizontal: 4}}>
          <BaseInput 
            keyboardType={"numeric"}
            placeholder={"Month"}
            value={birthDate.month.toString()}
            onTextChange={value => handleDateChange("month", value)}
          />
        </View>
        <View style={{flex: 3, marginStart: 4}}>
          <BaseInput 
            keyboardType={"numeric"}
            placeholder={"Year"}
            value={birthDate.year.toString()}
            onTextChange={value => handleDateChange("year", value)}
          />
        </View>
      </View>
      <BaseInput 
        placeholder="About me"
        value={about}
        onTextChange={setAbout}
        multiline={true}
        style={{marginBottom: 16}}
      />

      <Button text="Save changes" onPress={submit} />
    </View>
  )
}