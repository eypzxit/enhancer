// public/app.js

const form = document.getElementById('enhanceForm');
const fileInput = document.getElementById('imageUpload');
const originalPreview = document.getElementById('originalPreview');
const enhancedImage = document.getElementById('enhancedImage');
const downloadLink = document.getElementById('downloadLink');
const statusMessage = document.getElementById('statusMessage');
const resultContainer = document.getElementById('resultContainer');
const enhanceButton = document.getElementById('enhanceButton');

// Function to handle form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (fileInput.files.length === 0) {
        alert('Please select an image to enhance.');
        return;
    }

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('imageFile', file);

    // Show processing message and disable button
    statusMessage.textContent = 'Processing... This may take a moment.';
    statusMessage.classList.remove('hidden');
    enhanceButton.disabled = true;
    resultContainer.classList.add('hidden');

    // Display original image preview
    originalPreview.src = URL.createObjectURL(file);
    originalPreview.classList.remove('hidden');

    try {
        // Post the image to your Express server's enhance endpoint
        const response = await fetch('/enhance', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Server responded with an error.');
        }

        // Get the enhanced image data as a Blob
        const imageBlob = await response.blob();
        const imageUrl = URL.createObjectURL(imageBlob);

        // Display the enhanced image
        enhancedImage.src = imageUrl;

        // Set up the download link
        downloadLink.href = imageUrl;
        downloadLink.classList.remove('hidden');

        statusMessage.textContent = '✅ Enhancement Complete!';
        resultContainer.classList.remove('hidden');

    } catch (error) {
        statusMessage.textContent = `❌ Error: ${error.message}`;
        console.error('Fetch error:', error);
    } finally {
        // Re-enable the button
        enhanceButton.disabled = false;
    }
})
