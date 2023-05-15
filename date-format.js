function timeFormat(timeStamp) {
  const date = timeStamp.toDate()

  const hours = date.getHours()
  const minutes = date.getMinutes()
  const time = hours < 12 ? "AM" : "PM"

  const hours12 = hours > 12 ? hours - 12 : hours
  const minutes2digit = minutes < 10 ? "0" + minutes : minutes

  return hours12 + ":" + minutes2digit + " " + time
}

function dateFormat(timeStamp) {
  const date = timeStamp.toDate().toLocaleDateString()

  let yesterdayDate = new Date()
  yesterdayDate.setDate(yesterdayDate.getDate() - 1)
  
  const yesterday = yesterdayDate.toLocaleDateString()
  const today = new Date().toLocaleDateString()

  if(date === today) return "Today"
  if(date === yesterday) return "Yesterday"
  return date
}

function dateTimeFormat(timeStamp) {
  const date = dateFormat(timeStamp)

  if(date === "Today") return timeFormat(timeStamp)
  return date
}

function getAge(timeStamp) {
  const age = new Date().getFullYear() - timeStamp.toDate().getFullYear()

  return age
}

function howLongAgo(timeStamp) {
  const date = timeStamp.toDate()
  const now = new Date()

  const seconds = Math.round((now - date) / 1000)
  const minutes = Math.round(seconds / 60)
  const hours = Math.round(minutes / 60)
  const days = Math.round(hours / 24)

  if(days > 0) return days + " days ago"
  if(hours > 0) return hours + " hours ago"
  if(minutes > 0) return minutes + " minutes ago"
  return "online"
}

export { timeFormat, dateFormat, dateTimeFormat, getAge, howLongAgo }