import React, { useEffect, useState } from "react"
import { Snackbar, Text } from "react-native-paper"




const SnackBar = ({ onPress, label, backgroundColor }) => {

  const [alertSyle, setAlertStyle] = useState({
    backgroundColor: "blue"
  })

  useEffect(() => {
    switch ((!!alert && alert.alertType) || "default") {
      case "info":
        setAlertStyle({
          backgroundColor: "blue"
        })
        break
      case "error":
        setAlertStyle({
          backgroundColor: "red"
        })
        break
      case "success":
        setAlertStyle({
          backgroundColor: "green"
        })
        break
      default:
        setAlertStyle({
          backgroundColor: "green"
        })
    }
  }, [alert])



  return (
    <>

      <Snackbar

        style={backgroundColor}
        visible
        onDismiss={onPress}
        action={{
          label: "Ok",
          onPress: onPress
        }}
      >
        <Text style={{ color: "white" }}>{label}</Text>
      </Snackbar>

    </>
  )
}

export default SnackBar
