export default function formatPhoneNumber(number) {
  // Convert the number to a string to handle it correctly
  const numStr = number.toString();

  // If the number already starts with a +, return it exactly as is
  if (numStr.startsWith("+")) {
    return numStr;
  }

  // Helper function to format the number with spaces
  const addSpaces = (formattedNumber) => {
    // Split the formatted number into groups of 3 digits and join with a space
    return formattedNumber.replace(/(\d{3})(?=\d)/g, '$1 ').trim();
  };

  // Check if number is American (+1)
  if (numStr.startsWith("1") && numStr.length === 10) {
    return addSpaces(`+1 ${numStr}`);
  }
  
  // Check if number is Russian (+7)
  if (numStr.startsWith("7") && numStr.length === 11) {
    return addSpaces(`+7 ${numStr.slice(1)}`);
  }

  // Check if number is Moroccan (+212)
  if (numStr.startsWith("0") && numStr.length === 10 && (numStr[1] === '6' || numStr[1] === '7' || numStr[1] === '5')) {
    return addSpaces(`+212 ${numStr.slice(1)}`);
  }

  // Check if number is French (+33)
  if (numStr.startsWith("0") && numStr.length === 10 && !['6', '7', '5'].includes(numStr[1])) {
    return addSpaces(`+33 ${numStr.slice(1)}`);
  }

  // Check if number is Spanish (+34)
  if ((numStr.startsWith("6") || numStr.startsWith("7")) && numStr.length === 9) {
    return addSpaces(`+34 ${numStr}`);
  }

  // Default if no match found
  return number;
}
