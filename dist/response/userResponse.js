class UserResponse {
    constructor() {
        this.formData = [];
    }
    loadForm() {
        const formId = new URLSearchParams(window.location.search).get('id');
        if (formId) {
            const form = userResponse.loadFormData(formId);
            if (form) {
                const formContainer = document.querySelector('#form-container');
                if (formContainer) {
                    formContainer.innerHTML = userResponse.generateForm(form);
                }
            }
        }
    }
    // Load form data from localStorage based on the form ID
    loadFormData(formId) {
        const formData = JSON.parse(localStorage.getItem('formData') || '[]');
        return formData.find(form => form.id === formId);
    }
    generateForm(formDetails) {
        let formHtml = `
            <h1 class="text-center">${formDetails.name}</h1>
            <p>${formDetails.description || ""}</p>
            <form id="${formDetails.id}" onsubmit="return userResponse.saveResponse(event)">
        `;
        // Generate questions based on the questionData
        formDetails.questionData.forEach(question => {
            const id = this.sanitizeId(question.question);
            formHtml += `<div class="question">`;
            formHtml += `<label for="${id}">${question.question}</label>`;
            formHtml += this.generateInputField(question, id); // Generate the input field based on type
            formHtml += `</div>`;
        });
        formHtml += `<button type="submit">Submit</button></form>`;
        return formHtml;
    }
    // Function to sanitize the question text and make it a valid ID
    sanitizeId(question) {
        return question.replaceAll(" ", "_").toLowerCase();
    }
    // Function to generate the corresponding input type based on the question's type
    generateInputField(question, id) {
        let fieldHtml = "";
        switch (question.type) {
            case "input":
                fieldHtml = this.generateTextInput(question, id);
                break;
            case "textarea":
                fieldHtml = this.generateTextArea(question, id);
                break;
            case "dropdown":
                if (question.options) {
                    fieldHtml = this.generateDropdown(question, id);
                }
                break;
            case "radio":
            case "checkbox":
                if (question.options) {
                    fieldHtml = this.generateOptions(question, id);
                }
                break;
            default:
                console.warn(`Unknown question type: ${question.type}`);
                break;
        }
        return fieldHtml;
    }
    // Function to generate a text input field
    generateTextInput(question, id) {
        return `<input type="text" name="${id}" id="${id}" question="${question.question}"/>`;
    }
    // Function to generate a textarea field
    generateTextArea(question, id) {
        return `<textarea name="${id}" id="${id}" question="${question.question}"></textarea>`;
    }
    // Function to generate a dropdown (select) field
    generateDropdown(question, id) {
        var _a;
        let dropdownHtml = `<select name="${id}" id="${id}" question="${question.question}">`;
        dropdownHtml += `<option value="">Select one</option>`;
        (_a = question === null || question === void 0 ? void 0 : question.options) === null || _a === void 0 ? void 0 : _a.forEach(option => {
            dropdownHtml += `<option value="${option}">${option}</option>`;
        });
        dropdownHtml += `</select>`;
        return dropdownHtml;
    }
    // Function to generate radio or checkbox options
    generateOptions(question, id) {
        var _a;
        let optionsHtml = "";
        (_a = question.options) === null || _a === void 0 ? void 0 : _a.forEach(option => {
            optionsHtml += `
                <div class="${question.type}-option option-block">
                    <input type="${question.type}" name="${id}" value="${option}" id="${id}-${option}"  question="${question.question}"/>
                    <label for="${id}-${option}">${option}</label>
                </div>
            `;
        });
        return optionsHtml;
    }
    // Save form responses to localStorage
    saveResponse(event) {
        event.preventDefault(); // Prevent form from submitting normally
        let responses = [];
        const form = event.target;
        const formData = {};
        // Collect form data
        new FormData(form).forEach((value, key) => {
            if (formData[key]) {
                formData[key] += `, ${value}`;
            }
            else {
                formData[key] = value;
            }
        });
        if (localStorage.getItem(form.id)) {
            // Parse the stored data into an object
            responses = JSON.parse(localStorage.getItem(form.id) || '[]');
        }
        responses.push(formData);
        // Save form data to localStorage
        localStorage.setItem(form.id, JSON.stringify(responses));
        // Optionally alert or log the data saved
        alert("Your response has been saved!");
        // Redirect to index.html after saving
        window.location.href = 'index.html'; // This will navigate to index.html
        return false; // Prevent form submission (for example, if you don't want to reload the page)
    }
    // Cancel the form
    cancel() {
        // Redirect to index.html after cancelling
        window.location.href = 'index.html'; // This will navigate to index.html
    }
}
// Create an instance of Userresponse
const userResponse = new UserResponse();
// Attach the instance to the global window object so it can be accessed in HTML
window.userResponse = userResponse;
window.onload = () => {
    userResponse.loadForm();
};
export default userResponse;
