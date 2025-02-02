class GoogleForms {
    constructor() {
        this.formData = [];
    }
    // Get the form index
    getFormIndex(formId) {
        const formData = JSON.parse(localStorage.getItem('formData') || '[]');
        return formData.findIndex(form => form.id === formId);
    }
    // DELETE form
    deleteForm(id) {
        const formId = googleForms.getFormIndex(id);
        // Delete one form item using splice method
        this.formData.splice(formId, 1);
        // Set the items back to the storage
        localStorage.setItem('formData', JSON.stringify(this.formData));
        // Redirect to index.html after saving the data
        window.location.href = 'index.html'; // This will navigate to index.html
    }
    // Redirect to User Response
    userResponse(id) {
        window.location.href = `userresponse.html?id=${id}`; // This will navigate to index.html
    }
    // Redirect to All User Response
    allUserResponse(id) {
        window.location.href = `alluserresponses.html?id=${id}`; // This will navigate to index.html
    }
    viewUpdateForm(id) {
        window.location.href = `create.html?id=${id}`; // This will navigate to create.html
    }
    loadForms() {
        this.formData = JSON.parse(localStorage.getItem('formData') || '[]');
        // Get the container where the forms will be displayed
        const formContainer = document.getElementById('form-container');
        if (this.formData === null || typeof this.formData !== 'object' || this.formData.length === 0) {
            const noDataElement = document.createElement("div");
            noDataElement.classList.add("noform");
            noDataElement.textContent = "No forms found"; // Correct text assignment
            formContainer.appendChild(noDataElement);
            return; // Stop further execution if no data
        }
        else {
            // list local storage items 
            // Loop through the form data and create dynamic list items
            const formElement = document.createElement('div');
            formElement.classList.add('form');
            this.formData.forEach((form) => {
                // Create the div element to represent each form
                const formBlock = document.createElement('div');
                formBlock.classList.add('form-section');
                // Create the anchor element (link) for the form
                const formLink = document.createElement('a');
                formLink.href = `create.html?id=${form.id}`; // Pass the form ID to create.html
                // Create the div that holds the form name
                const formName = document.createElement('span');
                formName.classList.add('form-name');
                formName.textContent = form.name;
                // Append the form name to the link
                formLink.appendChild(formName);
                // Create the div element to add all buttons
                const formBlockButton = document.createElement('div');
                formBlockButton.classList.add('form-allbutton');
                // Create the button that is used to show all user responses
                const userResponses = document.createElement('button');
                userResponses.classList.add('form-userresponses');
                userResponses.textContent = "ALL RESPONSES";
                // Create the button that is used to delete the form
                const deleteButton = document.createElement('button');
                deleteButton.classList.add('form-delete');
                deleteButton.textContent = "DELETE";
                // Create the button that is used to add user response
                const userResponse = document.createElement('button');
                userResponse.classList.add('form-userresponse');
                userResponse.textContent = "ADD USER RESPONSE";
                // Create the button that is used to add user response
                const viewUpdate = document.createElement('button');
                viewUpdate.classList.add('form-viewUpdate');
                viewUpdate.textContent = "VIEW OR UPDATE FORM";
                // Add the onclick event handler
                deleteButton.addEventListener('click', function (event) {
                    event.preventDefault();
                    // Your delete logic here
                    googleForms.deleteForm(form.id);
                });
                // Add the onclick event handler
                userResponse.addEventListener('click', function (event) {
                    event.preventDefault();
                    // Your delete logic here
                    googleForms.userResponse(form.id);
                });
                // Add the onclick event handler
                userResponses.addEventListener('click', function (event) {
                    event.preventDefault();
                    // Your delete logic here
                    googleForms.allUserResponse(form.id);
                });
                // Add the onclick event handler
                viewUpdate.addEventListener('click', function (event) {
                    event.preventDefault();
                    // Your delete logic here
                    googleForms.viewUpdateForm(form.id);
                });
                // Append the link to the form element
                formBlock.appendChild(formLink);
                // Append the buttons to the link
                formBlockButton.appendChild(userResponses);
                formBlockButton.appendChild(userResponse);
                formBlockButton.appendChild(viewUpdate);
                formBlockButton.appendChild(deleteButton);
                formBlock.appendChild(formBlockButton);
                formElement.appendChild(formBlock);
                // Append the form element to the container
                formContainer.appendChild(formElement);
            });
        }
    }
}
// Create an instance of GoogleForms
const googleForms = new GoogleForms();
// Attach the instance to the global window object so it can be accessed in HTML
window.googleForms = googleForms;
window.onload = () => {
    googleForms.loadForms();
};
export {};
