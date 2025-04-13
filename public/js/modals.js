document.addEventListener('DOMContentLoaded', function() {
    // Initialize new initiative modal
    const newInitiativeModal = document.getElementById('newInitiativeModal');
    
    if (newInitiativeModal) {
        const closeButton = newInitiativeModal.querySelector('.close-button');
        const cancelButton = newInitiativeModal.querySelector('.cancel-button');
        const submitButton = newInitiativeModal.querySelector('.submit-button');
        const form = newInitiativeModal.querySelector('form');
        
        // Close modal
        closeButton.addEventListener('click', () => {
            document.getElementById('registrationModal').style.display = 'none';
        });
        
        cancelButton.addEventListener('click', function() {
            toggleModal('newInitiativeModal', false);
        });
        
        // Submit form
        submitButton.addEventListener('click', function() {
            if (validateInitiativeForm(form)) {
                form.submit();
            } else {
                alert('Please fill out all required fields.');
            }
        });
    }

    // Initialize meta modal
    const metaModal = document.getElementById('metaModal');
    const metaElements = document.querySelectorAll('.meta-row'); // Seleciona as metas

    if (metaModal && metaElements) {
        metaElements.forEach(meta => {
            meta.addEventListener('click', function() {
                toggleModal('metaModal', true); // Abre o modal
            });
        });

        const closeButton = metaModal.querySelector('.close-button');
        closeButton.addEventListener('click', function() {
            toggleModal('metaModal', false); // Fecha o modal
        });
    }
});

function toggleModal(modalId, show) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = show ? 'block' : 'none';
    }
}

function validateInitiativeForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    for (let field of requiredFields) {
        if (!field.value.trim()) {
            return false;
        }
    }
    return true;
}