
 // Gallery functionality
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', function() {
                const src = this.getAttribute('data-src');
                const type = this.getAttribute('data-type');
                const index = this.getAttribute('data-index');
                const mainImage = document.getElementById('mainImage');
                const mainVideo = document.getElementById('mainVideo');
                const mediaIndicator = document.getElementById('mediaIndicator');
                
                // Update active state
                document.querySelectorAll('.gallery-item').forEach(i => i.classList.remove('active', 'border-primary'));
                this.classList.add('active', 'border-primary');
                
                if (type === 'video') {
                    mainImage.classList.add('hidden');
                    mainVideo.classList.remove('hidden');
                    mainVideo.src = src;
                    mainVideo.play();
                    mediaIndicator.textContent = `Video ${index}/6`;
                } else {
                    mainVideo.classList.add('hidden');
                    mainImage.classList.remove('hidden');
                    mainImage.src = src;
                    mediaIndicator.textContent = `Photo ${index}/6`;
                }
            });
        });
    
        // Quantity and price functionality
        const quantityElement = document.getElementById('quantity');
        const decreaseButton = document.getElementById('decreaseQty');
        const increaseButton = document.getElementById('increaseQty');
        const unitPriceElement = document.getElementById('unitPrice');
        const totalPriceElement = document.getElementById('totalPrice');
        const orderButtonText = document.getElementById('orderButtonText');
        
        function updateTotalPrice() {
            const quantity = parseInt(quantityElement.textContent);
            let unitPrice;
            let totalPrice;
            
            // Dynamic pricing: 249 for 1 item, 200 for 2+ items
            if (quantity === 1) {
                unitPrice = 249;
                unitPriceElement.textContent = 'GH₵249';
            } else {
                unitPrice = 225;
                unitPriceElement.textContent = 'GH₵225';
            }
            
            totalPrice = unitPrice * quantity;
            totalPriceElement.textContent = `GH₵${totalPrice}`;
            orderButtonText.textContent = `ORDER NOW - GH₵${totalPrice}`;
        }
        
        decreaseButton.addEventListener('click', function() {
            let quantity = parseInt(quantityElement.textContent);
            if (quantity > 1) {
                quantity--;
                quantityElement.textContent = quantity;
                updateTotalPrice();
            }
        });
        
        increaseButton.addEventListener('click', function() {
            let quantity = parseInt(quantityElement.textContent);
            if (quantity < 10) {
                quantity++;
                quantityElement.textContent = quantity;
                updateTotalPrice();
            }
        });
    
        // Countdown timer
        function updateCountdown() {
            const countdownElement = document.getElementById('countdown');
            const now = new Date();
            const endTime = new Date();
            endTime.setHours(23, 59, 59, 999);
            
            const diff = endTime - now;
            
            if (diff <= 0) {
                countdownElement.textContent = '00:00:00';
                return;
            }
            
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            countdownElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        
        setInterval(updateCountdown, 1000);
        updateCountdown();

        // Form submission - WITH BETTER LOGGING
        const scriptURL = "https://script.google.com/macros/s/AKfycbwtgZ1eTfYW_9PQFYPKcw5DVZYoEBZffJuAtf9vbGUlLH1jr0lfVIoY126-8fBSjmsUm/exec";
        const form = document.querySelector("form");

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            
            // Show loading state A
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = 'Processing...';
            submitButton.disabled = true;
            
            // FormData will automatically collect all fields with name attributes
            var formData = new FormData(form);
            
            // Get quantity and total values
            const quantity = document.getElementById("quantity").textContent;
            const total = document.getElementById("totalPrice").textContent;
            
            // Add the quantity and total manually since they're not in the form
            formData.append("quantity", quantity);
            formData.append("total", total);
            
            // Log what we're sending
            console.log('=== SENDING DATA ===');
            console.log('Form data:');
            for (let [key, value] of formData.entries()) {
                console.log(key + ': ' + value);
            }
            console.log('Quantity:', quantity);
            console.log('Total:', total);
            
            fetch(scriptURL, { 
                method: "POST", 
                body: formData 
            })
            .then(response => {
                console.log('Response status:', response.status);
                return response.json();
            })
            .then(data => {
                console.log('=== RESPONSE FROM SERVER ===');
                console.log('Full response:', data);
                if (data.result === 'success') {
                    swal("Done", "Order submitted successfully! We will contact you shortly.", "success");
                    form.reset();
                    quantityElement.textContent = "1";
                    updateTotalPrice();
                } else {
                    throw new Error(data.error || 'Unknown error');
                }
            })
            .catch((error) => {
                console.error('=== ERROR ===');
                console.error('Error:', error);
                swal("Error", "Something went wrong. Please try again!", "error");
            })
            .finally(() => {
                // Restore button state
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            });
        });
    
        // Initialize total price on page load
        updateTotalPrice();
    </script>

<script>
    // Black Friday Modal Functionality
    document.addEventListener('DOMContentLoaded', function() {
        const modal = document.getElementById('blackFridayModal');
        const closeModal = document.getElementById('closeModal');
        const applyDeal = document.getElementById('applyDeal');
        const noThanks = document.getElementById('noThanks');
        const modalCountdown = document.getElementById('modalCountdown');
        
        // Show modal after 3 seconds
        setTimeout(() => {
            modal.classList.remove('hidden');
            startModalCountdown();
        }, 3000);
        
        // Close modal when X is clicked
        closeModal.addEventListener('click', function() {
            modal.classList.add('hidden');
        });
        
        // Close modal when "No thanks" is clicked
        noThanks.addEventListener('click', function() {
            modal.classList.add('hidden');
        });
        
        // Apply deal when CTA is clicked
        applyDeal.addEventListener('click', function() {
            // Update quantity to 2 - this will automatically trigger the 200 cedis pricing
            document.getElementById('quantity').textContent = '2';
            
            // Let the updateTotalPrice function handle the calculation
            updateTotalPrice();
            
            // Close modal
            modal.classList.add('hidden');
            
            // Show confirmation message
            swal("Deal Applied!", "You've successfully added 2 masks to your order at the special Black Friday price!", "success");
        });
        
        // Countdown timer for modal
        function startModalCountdown() {
            let timeLeft = 5 * 60; // 5 minutes in seconds
            
            const countdownInterval = setInterval(() => {
                if (timeLeft <= 0) {
                    clearInterval(countdownInterval);
                    modal.classList.add('hidden');
                    return;
                }
                
                const minutes = Math.floor(timeLeft / 60);
                const seconds = timeLeft % 60;
                
                modalCountdown.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                timeLeft--;
            }, 1000);
        }
        
        // Close modal if clicked outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    });
