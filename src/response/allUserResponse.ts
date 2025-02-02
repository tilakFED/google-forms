import { FormDetails, QuestionData } from "../forms/create";

class AllUserResponse {
    formData: FormDetails[] = [];
    constructor() {
    }

    loadResponses(): void {
        const formId = new URLSearchParams(window.location.search).get('id') as string;
        const savedResponses = JSON.parse(localStorage.getItem(formId) || '[]');

        if (!savedResponses) {
            console.log("No responses found.");
            return;
        }

        const responses = savedResponses;
        const container = document.querySelector('#responses-table-container');

        if (!container) {
            console.log("Container for displaying responses not found.");
            return;
        }

        // Collect all unique keys (questions) from all responses
        const allKeys = new Set<string>();

        responses.forEach((response: {}) => {
            Object.keys(response).forEach(key => {
                allKeys.add(key);
            });
        });

        // Clear previous content if any
        container.innerHTML = '';

        // Iterate over the responses to display them in a formatted div
        responses.forEach((response: { [s: string]: unknown; } | ArrayLike<unknown>, index: number) => {
            let card = `<div class="response-card">`;
            card += `<div class="response-count">${index + 1}</div>`;
            // Loop through the keys (questions) and values (answers) and display them
            for (let [question, answer] of Object.entries(response)) {
                card += `
                    <div class="response-item">
                        <strong>${allUserResponse.formatQuestion(question)}</strong> 
                        <div class="response-answer">${answer}</div>
                    </div>
                `;
            }

            card += `</div>`;
            container.innerHTML += card;  // Add each user card to the container
        });
    }

    // Helper method to format the question text (optional, if needed for clean display)
    private formatQuestion(question: string): string {
        return question
            .replace(/_/g, ' ')      // Replace underscores with spaces
            .replace(/([A-Z])/g, ' $1') // Add space before uppercase letters
            .replace(/^\w/, (char) => char.toUpperCase()); // Capitalize first letter
    }

    // Cancel the form
    cancel(): void {
        // Redirect to index.html after cancelling
        window.location.href = 'index.html'; // This will navigate to index.html
    }
}

// Create an instance of All Userresponse
const allUserResponse = new AllUserResponse();

// Attach the instance to the global window object so it can be accessed in HTML
(window as any).allUserResponse = allUserResponse;

window.onload = () => {
    allUserResponse.loadResponses();
};

export default allUserResponse;