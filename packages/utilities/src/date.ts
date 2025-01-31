

export function dateFrom24Hour(date: string) {
  // Split the input string into hours and minutes
  const [hours, minutes] = date.split(':').map(Number)
  
  // Set the hours and minutes on a new date object
  const now = new Date()
  now.setHours(hours, minutes, 0, 0)
  return now
}
