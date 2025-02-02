export class CreateForm {
    constructor() {
        this.questionCount = 0;
        this.formData = [];
        this.questionData = [];
    }
    // Add a new question dynamically
    addNewQuestion(questionData) {
        this.questionCount++;
        const formSection = this.createFormSection(questionData);
        const formContainer = document.getElementById('form-container');
        formContainer === null || formContainer === void 0 ? void 0 : formContainer.appendChild(formSection);
        this.addDeleteButtonListener(formSection, formContainer);
        this.addQuestionTypeChangeListener(formSection, (questionData === null || questionData === void 0 ? void 0 : questionData.type) || 'input', questionData);
    }
    // Create the initial form section (input field and select for question type)
    createFormSection(questionData) {
        const formSection = document.createElement('div');
        formSection.classList.add('form-section', 'input', `question${this.questionCount}`);
        const flexDiv = this.createFlexContainer(questionData);
        const deleteDiv = this.createDeleteButton();
        formSection.appendChild(flexDiv);
        formSection.appendChild(deleteDiv);
        return formSection;
    }
    // Create the flex container with an input field and select dropdown for question type
    createFlexContainer(questionData) {
        const flexDiv = document.createElement('div');
        flexDiv.classList.add('flex');
        const input = this.createInputField((questionData === null || questionData === void 0 ? void 0 : questionData.question) || '');
        const selectContainer = this.createSelectContainer((questionData === null || questionData === void 0 ? void 0 : questionData.type) || 'input');
        flexDiv.appendChild(input);
        flexDiv.appendChild(selectContainer);
        return flexDiv;
    }
    // Create the input field for question
    createInputField(value) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Enter Question';
        input.value = value;
        return input;
    }
    // Create the select dropdown to choose the question type
    createSelectContainer(selectedType) {
        const selectContainer = document.createElement('div');
        selectContainer.classList.add('form-select-question-type');
        const select = this.createSelectElement(selectedType);
        selectContainer.appendChild(select);
        return selectContainer;
    }
    // Create the select element with available question types
    createSelectElement(selectedType) {
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
    createDeleteButton() {
        const deleteDiv = document.createElement('div');
        deleteDiv.classList.add('flex', 'form-select-question-delete');
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'DELETE';
        deleteDiv.appendChild(deleteButton);
        return deleteDiv;
    }
    // Add the delete button functionality to remove questions dynamically
    addDeleteButtonListener(formSection, formContainer) {
        const deleteButton = formSection.querySelector('button');
        deleteButton === null || deleteButton === void 0 ? void 0 : deleteButton.addEventListener('click', () => {
            formContainer === null || formContainer === void 0 ? void 0 : formContainer.removeChild(formSection);
        });
    }
    // Handle change in question type and dynamically adjust the form
    addQuestionTypeChangeListener(formSection, currentQuestionType, questionData) {
        const select = formSection.querySelector('select');
        if (questionData === undefined) {
            select.addEventListener('change', (event) => {
                const selectedType = event.target.value;
                this.updateFormSectionType(formSection, selectedType, questionData);
                currentQuestionType = selectedType;
            });
        }
        else {
            this.updateFormSectionType(formSection, currentQuestionType, questionData);
        }
    }
    // Update the form section according to the selected question type
    updateFormSectionType(formSection, selectedType, questionData) {
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
    addFormOptions(formSection, questionData) {
        var _a, _b;
        const formOption = document.createElement('div');
        formOption.classList.add('form-option');
        if (((_a = questionData === null || questionData === void 0 ? void 0 : questionData.options) === null || _a === void 0 ? void 0 : _a.length) === 0 || (questionData === null || questionData === void 0 ? void 0 : questionData.options) === undefined) {
            const optionBlock = this.createOptionBlock(1);
            formOption.appendChild(optionBlock);
        }
        else {
            (_b = questionData === null || questionData === void 0 ? void 0 : questionData.options) === null || _b === void 0 ? void 0 : _b.forEach((option) => {
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
    createOptionBlock(index, option = "") {
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
    createAddMoreButton(formOption) {
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
    saveQuestionsToLocalStorage() {
        const formId = new URLSearchParams(window.location.search).get('id');
        const createForm = new CreateForm();
        const name = document.querySelector('.form-name-value').value;
        const description = document.querySelector('.form-description-value').value;
        const formSections = document.querySelectorAll('.form-section');
        this.questionData = [];
        formSections.forEach((formSection, index) => {
            const questionText = formSection.querySelector('input[type="text"]').value;
            const select = formSection.querySelector('select');
            const questionType = select.value;
            const questionData = {
                type: questionType,
                question: questionText || ''
            };
            // Collect options if the question is of type radio, checkbox, or dropdown
            if (['radio', 'checkbox', 'dropdown'].includes(questionType)) {
                const options = Array.from(formSection.querySelectorAll('.form-option-block input'))
                    .map(input => input.value);
                questionData.options = options;
            }
            this.questionData.push(questionData);
        });
        if (localStorage.getItem('formData')) {
            // Parse the stored data into an object
            this.formData = JSON.parse(localStorage.getItem('formData') || '[]');
        }
        let formData = {
            id: name.replaceAll(" ", "_").toLowerCase(),
            name,
            description,
            questionData: this.questionData
        };
        if (formId) {
            // Get the form index
            const formIndex = createForm.getFormIndex(formId);
            formData['id'] = formId;
            this.formData[formIndex] = Object.assign({}, formData);
        }
        else {
            this.formData.push(Object.assign({}, formData));
        }
        // Add the saved data to localStorage
        localStorage.setItem('formData', JSON.stringify(this.formData));
        // Redirect to index.html after saving the data
        window.location.href = 'index.html'; // This will navigate to index.html
    }
    // Load form data from localStorage based on the form ID
    loadFormData(formId) {
        const formData = JSON.parse(localStorage.getItem('formData') || '[]');
        return formData.find(form => form.id === formId);
    }
    // Get the form index
    getFormIndex(formId) {
        const formData = JSON.parse(localStorage.getItem('formData') || '[]');
        return formData.findIndex(form => form.id === formId);
    }
    // Cancel the form
    cancel() {
        // Redirect to index.html after cancelling
        window.location.href = 'index.html'; // This will navigate to index.html
    }
}
// Create an instance of CreateForm
const createForm = new CreateForm();
// Attach the instance to the global window object so it can be accessed in HTML
window.createForm = createForm;
// Initialize form on page load
window.onload = () => {
    const formId = new URLSearchParams(window.location.search).get('id');
    const createForm = new CreateForm();
    if (formId) {
        const form = createForm.loadFormData(formId);
        if (form) {
            // Populate form fields
            const titleValue = document.querySelector('.form-name-value');
            const descriptionValue = document.querySelector('.form-description-value');
            titleValue.value = form.name;
            descriptionValue.value = form.description;
            // Add questions to the form dynamically
            form.questionData.forEach(question => {
                createForm.addNewQuestion(question);
            });
        }
    }
    else {
        // Create a new form by default
        createForm.addNewQuestion();
    }
};
export default createForm;
