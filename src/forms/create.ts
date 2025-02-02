export interface QuestionData {
    type: string;
    question: string;
    options?: string[];
}

export interface FormDetails {
    id: string;
    name: string;
    description: string;
    questionData: QuestionData[];
}

export class CreateForm {
    private questionCount: number = 0;
    private formData: FormDetails[] = [];
    private questionData: QuestionData[] = [];

    // Add a new question dynamically
    addNewQuestion(questionData?: QuestionData) {
        this.questionCount++;
        const formSection = this.createFormSection(questionData);
        const formContainer = document.getElementById('form-container');
        formContainer?.appendChild(formSection);

        this.addDeleteButtonListener(formSection, formContainer);
        this.addQuestionTypeChangeListener(formSection, questionData?.type || 'input', questionData);
    }

    // Create the initial form section (input field and select for question type)
    private createFormSection(questionData?: QuestionData): HTMLElement {
        const formSection = document.createElement('div');
        formSection.classList.add('form-section', 'input', `question${this.questionCount}`);

        const flexDiv = this.createFlexContainer(questionData);
        const deleteDiv = this.createDeleteButton();

        formSection.appendChild(flexDiv);
        formSection.appendChild(deleteDiv);

        return formSection;
    }

    // Create the flex container with an input field and select dropdown for question type
    private createFlexContainer(questionData?: QuestionData): HTMLElement {
        const flexDiv = document.createElement('div');
        flexDiv.classList.add('flex');

        const input = this.createInputField(questionData?.question || '');
        const selectContainer = this.createSelectContainer(questionData?.type || 'input');

        flexDiv.appendChild(input);
        flexDiv.appendChild(selectContainer);

        return flexDiv;
    }

    // Create the input field for question
    private createInputField(value: string): HTMLInputElement {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Enter Question';
        input.value = value;
        return input;
    }

    // Create the select dropdown to choose the question type
    private createSelectContainer(selectedType: string): HTMLElement {
        const selectContainer = document.createElement('div');
        selectContainer.classList.add('form-select-question-type');

        const select = this.createSelectElement(selectedType);
        selectContainer.appendChild(select);

        return selectContainer;
    }

    // Create the select element with available question types
    private createSelectElement(selectedType: string): HTMLSelectElement {
        const select = document.createElement('select');
        const options = [
            { value: 'input', text: 'Short Answer' },
            { value: 'textarea', text: 'Long Answer' },
            { value: 'radio', text: 'Multiple Choice' },
            { value: 'checkbox', text: 'Checkbox' },
            { value: 'dropdown', text: 'Dropdown' }
        ];

        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.text;
            if (option.value === selectedType) {
                optionElement.selected = true;
            }
            select.appendChild(optionElement);
        });

        return select;
    }

    // Create a delete button for each question section
    private createDeleteButton(): HTMLElement {
        const deleteDiv = document.createElement('div');
        deleteDiv.classList.add('flex', 'form-select-question-delete');

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'DELETE';
        deleteDiv.appendChild(deleteButton);

        return deleteDiv;
    }

    // Add the delete button functionality to remove questions dynamically
    private addDeleteButtonListener(formSection: HTMLElement, formContainer: HTMLElement | null): void {
        const deleteButton = formSection.querySelector('button');
        deleteButton?.addEventListener('click', () => {
            formContainer?.removeChild(formSection);
        });
    }

    // Handle change in question type and dynamically adjust the form
    private addQuestionTypeChangeListener(formSection: HTMLElement, currentQuestionType: string, questionData?: QuestionData): void {
        const select = formSection.querySelector('select') as HTMLSelectElement;
        if (questionData === undefined) {
            select.addEventListener('change', (event) => {
                const selectedType = (event.target as HTMLSelectElement).value;
                this.updateFormSectionType(formSection, selectedType, questionData);
                currentQuestionType = selectedType;
            });
        } else {
            this.updateFormSectionType(formSection, currentQuestionType, questionData);
        }
    }

    // Update the form section according to the selected question type
    private updateFormSectionType(formSection: HTMLElement, selectedType: string, questionData?: QuestionData): void {
        const typeClasses = ['input', 'textarea', 'radio', 'checkbox', 'dropdown'];
        typeClasses.forEach(typeClass => formSection.classList.remove(typeClass));
        formSection.classList.add(selectedType);

        // If the question type is radio, checkbox, or dropdown, add options
        const existingFormOption = formSection.querySelector('.form-option');
        if (existingFormOption) {
            formSection.removeChild(existingFormOption);
        }

        if (['radio', 'checkbox', 'dropdown'].includes(selectedType)) {
            this.addFormOptions(formSection, questionData);
        }
    }

    // Add options for radio, checkbox, or dropdown type questions
    private addFormOptions(formSection: HTMLElement, questionData?: QuestionData): void {
        const formOption = document.createElement('div');
        formOption.classList.add('form-option');
        if (questionData?.options?.length === 0 || questionData?.options === undefined) {
            const optionBlock = this.createOptionBlock(1);
            formOption.appendChild(optionBlock);
        } else {
            questionData?.options?.forEach((option) => {
                const optionBlock = this.createOptionBlock(1, option);
                formOption.appendChild(optionBlock);
            });
        }

        // Create the "Add one more" button
        const addMoreButton = this.createAddMoreButton(formOption);
        formOption.appendChild(addMoreButton);

        formSection.insertBefore(formOption, formSection.querySelector('.form-select-question-delete'));
    }

    // Create an option block (input field and remove button for each option)
    private createOptionBlock(index: number, option = ""): HTMLElement {
        const optionBlock = document.createElement('div');
        optionBlock.classList.add('flex', 'form-option-block');

        const optionInput = document.createElement('input');
        optionInput.type = 'text';
        optionInput.value = option;
        optionInput.placeholder = `Option ${index}`;

        const removeButton = document.createElement('button');
        removeButton.classList.add('round-button', 'small');
        removeButton.textContent = 'X';

        optionBlock.appendChild(optionInput);
        optionBlock.appendChild(removeButton);

        // Attach remove button functionality to remove the option
        removeButton.addEventListener('click', () => {
            optionBlock.remove();
        });

        return optionBlock;
    }

    // Create the "Add one more" button and add the functionality to add new option blocks
    private createAddMoreButton(formOption: HTMLElement): HTMLElement {
        const addMoreButtonContainer = document.createElement('div');
        addMoreButtonContainer.classList.add('form-option-more');

        const addButton = document.createElement('button');
        addButton.textContent = 'Add one more';

        addButton.addEventListener('click', () => {
            const optionIndex = formOption.querySelectorAll('.form-option-block').length + 1;
            const newOptionBlock = this.createOptionBlock(optionIndex);
            formOption.insertBefore(newOptionBlock, addMoreButtonContainer);
        });

        addMoreButtonContainer.appendChild(addButton);
        return addMoreButtonContainer;
    }


    // Save the current form data to localStorage in JSON format
    saveQuestionsToLocalStorage(): void {

        const formId = new URLSearchParams(window.location.search).get('id');
        const createForm = new CreateForm();

        const name = (document.querySelector('.form-name-value') as HTMLInputElement).value;
        const description = (document.querySelector('.form-description-value') as HTMLTextAreaElement).value;

        const formSections = document.querySelectorAll('.form-section');
        this.questionData = [];

        formSections.forEach((formSection, index) => {
            const questionText = (formSection.querySelector('input[type="text"]') as HTMLInputElement).value;
            const select = formSection.querySelector('select') as HTMLSelectElement;
            const questionType = select.value;

            const questionData: QuestionData = {
                type: questionType,
                question: questionText || ''
            };

            // Collect options if the question is of type radio, checkbox, or dropdown
            if (['radio', 'checkbox', 'dropdown'].includes(questionType)) {
                const options = Array.from(formSection.querySelectorAll('.form-option-block input'))
                    .map(input => (input as HTMLInputElement).value);
                questionData.options = options;
            }

            this.questionData.push(questionData);
        });

        if (localStorage.getItem('formData')) {
            // Parse the stored data into an object
            this.formData = JSON.parse(localStorage.getItem('formData') || '[]');
        }

        let formData: FormDetails = {
            id: name.replaceAll(" ", "_").toLowerCase(),
            name,
            description,
            questionData: this.questionData
        };

        if (formId) {
            // Get the form index
            const formIndex = createForm.getFormIndex(formId);
            formData['id'] = formId;
            this.formData[formIndex] = { ...formData }
        } else {
            this.formData.push({ ...formData });
        }

        // Add the saved data to localStorage
        localStorage.setItem('formData', JSON.stringify(this.formData));

        // Redirect to index.html after saving the data
        window.location.href = 'index.html'; // This will navigate to index.html
    }

    // Load form data from localStorage based on the form ID
    loadFormData(formId: string): FormDetails | undefined {
        const formData: FormDetails[] = JSON.parse(localStorage.getItem('formData') || '[]');
        return formData.find(form => form.id === formId);
    }

    // Get the form index
    getFormIndex(formId: string): number {
        const formData: FormDetails[] = JSON.parse(localStorage.getItem('formData') || '[]');
        return formData.findIndex(form => form.id === formId);
    }

    // Cancel the form
    cancel(): void {
        // Redirect to index.html after cancelling
        window.location.href = 'index.html'; // This will navigate to index.html
    }
}

// Create an instance of CreateForm
const createForm = new CreateForm();

// Attach the instance to the global window object so it can be accessed in HTML
(window as any).createForm = createForm;

// Initialize form on page load
window.onload = () => {
    const formId = new URLSearchParams(window.location.search).get('id');
    const createForm = new CreateForm();

    if (formId) {
        const form = createForm.loadFormData(formId);
        if (form) {
            // Populate form fields
            const titleValue = document.querySelector('.form-name-value') as HTMLInputElement;
            const descriptionValue = document.querySelector('.form-description-value') as HTMLTextAreaElement;

            titleValue.value = form.name;
            descriptionValue.value = form.description;

            // Add questions to the form dynamically
            form.questionData.forEach(question => {
                createForm.addNewQuestion(question);
            });
        }
    } else {
        // Create a new form by default
        createForm.addNewQuestion();
    }
};

export default createForm;
