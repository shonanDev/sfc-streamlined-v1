// Get the input field
var input = document.getElementById("myInput");

// Execute a function when the user presses a key on the keyboard
input.addEventListener("keydown", function(event) {
// If the user presses the "Enter" key on the keyboard
    console.log(event.key);
    if (event.key === "Enter") {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        document.getElementById("myBtn").click();
        console.log("submitted");
}
});

const button = document.getElementById('myBtn');

button.addEventListener('click', function handleClick() {
  console.log('myBtn: clicked');
});