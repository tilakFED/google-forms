import { FormDetails, QuestionData } from "../forms/create";

class UserResponse {
    formData: FormDetails[] = [];
    constructor() {
    }

    loadForm(): void {
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
    loadFormData(formId: string): FormDetails | undefined {
        const formData: FormDetails[] = JSON.parse(localStorage.getItem('formData') || '[]');
        return formData.find(form => form.id === formId);
    }

    generateForm(formDetails: FormDetails): string {
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
    private sanitizeId(question: string): string {
        return question.replaceAll(" ", "_").toLowerCase();
    }

    // Function to generate the corresponding input type based on the question's type
    private generateInputField(question: QuestionData, id: string): string {
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
    private generateTextInput(question: QuestionData, id: string): string {
        return `<input type="text" name="${id}" id="${id}" question="${question.question}"/>`;
    }

    // Function to generate a textarea field
    private generateTextArea(question: QuestionData, id: string): string {
        return `<textarea name="${id}" id="${id}" question="${question.question}"></textarea>`;
    }

    // Function to generate a dropdown (select) field
    private generateDropdown(question: QuestionData, id: string): string {
        let dropdownHtml = `<select name="${id}" id="${id}" question="${question.question}">`;
        dropdownHtml += `<option value="">Select one</option>`;
        question?.options?.forEach(option => {
            dropdownHtml += `<option value="${option}">${option}</option>`;
        });
        dropdownHtml += `</select>`;
        return dropdownHtml;
    }

    // Function to generate radio or checkbox options
    private generateOptions(question: QuestionData, id: string): string {
        let optionsHtml = "";
        question.options?.forEach(option => {
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
    saveResponse(event: Event): boolean {
        event.preventDefault(); // Prevent form from submitting normally
        let responses: any[] = [];

        const form = event.target as HTMLFormElement;
        const formData: Record<string, string> = {};

        // Collect form data
        new FormData(form).forEach((value, key) => {
            if (formData[key]) {
                formData[key] += `, ${value}`;
            } else {
                formData[key] = value as string;
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
    cancel(): void {
        // Redirect to index.html after cancelling
        window.location.href = 'index.html'; // This will navigate to index.html
    }
}

// Create an instance of Userresponse
const userResponse = new UserResponse();

// Attach the instance to the global window object so it can be accessed in HTML
(window as any).userResponse = userResponse;

window.onload = () => {
    userResponse.loadForm();
};

export default userResponse;