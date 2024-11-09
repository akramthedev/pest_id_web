const formatDateForCreatedAt = (date) => {
    // Make sure the input is a valid Date object
    const parsedDate = new Date(date);
  
    // Check if the parsedDate is valid
    if (isNaN(parsedDate.getTime())) {
      return 'Invalid Date'; // Return a fallback value if date is invalid
    }
  
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(parsedDate.getDate()).padStart(2, '0');
    const hours = String(parsedDate.getHours()).padStart(2, '0');
    const minutes = String(parsedDate.getMinutes()).padStart(2, '0');
    const seconds = String(parsedDate.getSeconds()).padStart(2, '0');
    
    return `${day}/${month}/${year}`;
  };
  
  export default formatDateForCreatedAt;
  