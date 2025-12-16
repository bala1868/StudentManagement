// ==================== IMAGE UPLOAD WITH DRAG & DROP ====================

// Convert image file to Base64 string
function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
        if (!file.type.match('image.*')) {
            reject(new Error('Please select a valid image file'));
            return;
        }

        const maxSize = 2 * 1024 * 1024; // 2MB
        if (file.size > maxSize) {
            reject(new Error('Image size should be less than 2MB'));
            return;
        }

        const reader = new FileReader();
        
        reader.onload = function(e) {
            resolve(e.target.result);
        };
        
        reader.onerror = function(error) {
            reject(error);
        };
        
        reader.readAsDataURL(file);
    });
}

// Handle image upload and preview
async function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    await processImageFile(file);
}

// Process image file (used by both upload and drag-drop)
async function processImageFile(file) {
    const previewContainer = document.getElementById('imagePreviewContainer');
    const previewImage = document.getElementById('imagePreview');
    const removeButton = document.getElementById('removeImageBtn');
    const photoUrlInput = document.getElementById('studentPhoto');
    const dropZone = document.querySelector('.file-drop-zone');
    
    try {
        previewContainer.style.display = 'block';
        previewContainer.classList.add('loading');
        previewImage.src = '';
        previewImage.alt = 'Loading...';
        
        const base64Image = await convertImageToBase64(file);
        
        previewImage.src = base64Image;
        previewImage.alt = 'Student Photo Preview';
        removeButton.style.display = 'inline-block';
        photoUrlInput.value = base64Image;
        
        previewContainer.classList.remove('loading');
        if (dropZone) dropZone.style.display = 'none';
        
        console.log('✅ Image uploaded successfully');
        
    } catch (error) {
        console.error('❌ Error uploading image:', error);
        alert(error.message || 'Failed to upload image. Please try again.');
        
        previewContainer.style.display = 'none';
        previewContainer.classList.remove('loading');
    }
}

// Remove uploaded image
function removeUploadedImage() {
    const fileInput = document.getElementById('studentPhotoFile');
    const previewContainer = document.getElementById('imagePreviewContainer');
    const previewImage = document.getElementById('imagePreview');
    const removeButton = document.getElementById('removeImageBtn');
    const photoUrlInput = document.getElementById('studentPhoto');
    const dropZone = document.querySelector('.file-drop-zone');
    
    fileInput.value = '';
    photoUrlInput.value = '';
    previewImage.src = '';
    removeButton.style.display = 'none';
    previewContainer.style.display = 'none';
    if (dropZone) dropZone.style.display = 'block';
    
    console.log('🗑️ Uploaded image removed');
}

// Initialize drag and drop
function initializeDragAndDrop() {
    const dropZone = document.querySelector('.file-drop-zone');
    const fileInput = document.getElementById('studentPhotoFile');
    
    if (!dropZone || !fileInput) return;
    
    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    // Highlight drop zone when dragging over
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.add('drag-over');
        }, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.remove('drag-over');
        }, false);
    });
    
    // Handle dropped files
    dropZone.addEventListener('drop', handleDrop, false);
    
    // Click to upload
    dropZone.addEventListener('click', () => {
        fileInput.click();
    });
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files.length > 0) {
            processImageFile(files[0]);
        }
    }
}

// Load existing image for editing
function loadExistingImage(imageUrl) {
    if (!imageUrl || imageUrl === 'https://i.pravatar.cc/150?img=1') {
        return;
    }
    
    const previewContainer = document.getElementById('imagePreviewContainer');
    const previewImage = document.getElementById('imagePreview');
    const removeButton = document.getElementById('removeImageBtn');
    const photoUrlInput = document.getElementById('studentPhoto');
    const dropZone = document.querySelector('.file-drop-zone');
    
    previewContainer.style.display = 'block';
    previewImage.src = imageUrl;
    previewImage.alt = 'Current Student Photo';
    removeButton.style.display = 'inline-block';
    photoUrlInput.value = imageUrl;
    if (dropZone) dropZone.style.display = 'none';
}

// Initialize on page load
function initializeImageUpload() {
    const fileInput = document.getElementById('studentPhotoFile');
    const removeButton = document.getElementById('removeImageBtn');
    
    if (fileInput) {
        fileInput.addEventListener('change', handleImageUpload);
    }
    
    if (removeButton) {
        removeButton.addEventListener('click', removeUploadedImage);
    }
    
    initializeDragAndDrop();
    
    console.log('📸 Image upload functionality initialized');
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeImageUpload();
});