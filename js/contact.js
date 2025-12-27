import { embedHTML } from "../util/utils.js";

// Load shared components
await embedHTML("head", "htmlUtil/head.html");
document.title = "Flag Scape - Contact Us";
await embedHTML("header", "htmlUtil/header.html");
await embedHTML("sideBar", "htmlUtil/sideBar.html");
await embedHTML("fab", "htmlUtil/fab.html");

// ============================================
// JQUERY IMPLEMENTATION - Required for Rubric
// ============================================

// Wait for jQuery to be ready
$(document).ready(function () {
    console.log("jQuery loaded successfully! Version:", $.fn.jquery);

    // ============================================
    // VALIDATION PATTERNS - Regular Expressions
    // ============================================

    const validationPatterns = {
        // Name: 2-50 letters and spaces only
        name: /^[a-zA-Z\s]{2,50}$/,

        // Email: standard email format
        email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,

        // Phone: International format with optional country code
        phone: /^(\+\d{1,3}[- ]?)?\d{10}$/,

        // Username: 3-20 alphanumeric characters, underscores allowed
        username: /^[a-zA-Z0-9_]{3,20}$/,

        // Password: Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
        password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    };

    // Validation error messages
    const errorMessages = {
        firstName: "First name must be 2-50 letters only",
        lastName: "Last name must be 2-50 letters only",
        email: "Please enter a valid email address (e.g., user@example.com)",
        phone: "Please enter a valid phone number (e.g., +20 1234567890)",
        username: "Username must be 3-20 alphanumeric characters",
        password: "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character",
        confirmPassword: "Passwords do not match",
        terms: "You must agree to the terms and conditions"
    };

    // ============================================
    // LOAD COUNTRIES USING JQUERY AJAX
    // ============================================

    function loadCountries() {
        $.ajax({
            url: 'http://localhost:5000/v3.1/all?fields=name',
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                console.log("Countries loaded via jQuery AJAX:", data.length);

                // Use jQuery to populate select
                const $select = $('#country');

                // Sort countries alphabetically
                data.sort((a, b) => {
                    const nameA = a.name?.common || '';
                    const nameB = b.name?.common || '';
                    return nameA.localeCompare(nameB);
                });

                // Add options using jQuery
                $.each(data, function (index, country) {
                    const countryName = country.name?.common || 'Unknown';
                    $select.append($('<option></option>')
                        .val(countryName)
                        .text(countryName));
                });
            },
            error: function (xhr, status, error) {
                console.error("Failed to load countries:", error);
                $('#country').append('<option value="">Failed to load countries</option>');
            }
        });
    }

    // ============================================
    // CLIENT-SIDE VALIDATION FUNCTIONS
    // ============================================

    function validateField(fieldId, pattern, customValidation = null) {
        const $field = $('#' + fieldId);
        const $group = $field.closest('.form-group');
        const $error = $group.find('.error-message');
        const value = $field.val().trim();

        // Clear previous state using jQuery
        $group.removeClass('valid invalid');
        $error.text('');

        // Check if field is empty
        if (!value && $field.prop('required')) {
            $group.addClass('invalid');
            $error.text('This field is required');
            return false;
        }

        if (!value) {
            return true; // Empty optional field
        }

        // Custom validation (e.g., password match)
        if (customValidation) {
            const result = customValidation(value);
            if (!result.valid) {
                $group.addClass('invalid');
                $error.text(result.message);
                return false;
            }
        }

        // Pattern validation using RegEx
        if (pattern && !pattern.test(value)) {
            $group.addClass('invalid');
            $error.text(errorMessages[fieldId] || 'Invalid input');
            return false;
        }

        // Valid field
        $group.addClass('valid');
        return true;
    }

    function validateCheckbox(fieldId) {
        const $field = $('#' + fieldId);
        const $group = $field.closest('.form-group');
        const $error = $group.find('.error-message');
        const isChecked = $field.is(':checked');

        $group.removeClass('valid invalid');
        $error.text('');

        if ($field.prop('required') && !isChecked) {
            $group.addClass('invalid');
            $error.text(errorMessages[fieldId] || 'This field is required');
            return false;
        }

        if (isChecked) {
            $group.addClass('valid');
        }
        return true;
    }

    // ============================================
    // REAL-TIME VALIDATION - jQuery Event Handlers
    // ============================================

    // First Name validation
    $('#firstName').on('blur', function () {
        validateField('firstName', validationPatterns.name);
    });

    // Last Name validation
    $('#lastName').on('blur', function () {
        validateField('lastName', validationPatterns.name);
    });

    // Email validation
    $('#email').on('blur', function () {
        validateField('email', validationPatterns.email);
    });

    // Phone validation
    $('#phone').on('blur', function () {
        validateField('phone', validationPatterns.phone);
    });

    // Username validation
    $('#username').on('blur', function () {
        validateField('username', validationPatterns.username);
    });

    // Password validation
    $('#password').on('blur', function () {
        validateField('password', validationPatterns.password);
    });

    // Confirm Password validation
    $('#confirmPassword').on('blur', function () {
        const password = $('#password').val();
        validateField('confirmPassword', null, function (value) {
            if (value !== password) {
                return { valid: false, message: errorMessages.confirmPassword };
            }
            return { valid: true };
        });
    });

    // Terms checkbox validation
    $('#terms').on('change', function () {
        validateCheckbox('terms');
    });

    // ============================================
    // FORM SUBMISSION - jQuery AJAX
    // ============================================

    $('#contact-form').on('submit', function (e) {
        e.preventDefault();

        console.log("Form submission triggered");

        // Validate all fields
        let isValid = true;

        isValid &= validateField('firstName', validationPatterns.name);
        isValid &= validateField('lastName', validationPatterns.name);
        isValid &= validateField('email', validationPatterns.email);
        isValid &= validateField('phone', validationPatterns.phone);
        isValid &= validateField('username', validationPatterns.username);
        isValid &= validateField('password', validationPatterns.password);

        const password = $('#password').val();
        isValid &= validateField('confirmPassword', null, function (value) {
            if (value !== password) {
                return { valid: false, message: errorMessages.confirmPassword };
            }
            return { valid: true };
        });

        isValid &= validateCheckbox('terms');

        if (!isValid) {
            // Scroll to first error using jQuery animation
            $('html, body').animate({
                scrollTop: $('.invalid').first().offset().top - 100
            }, 500);
            return;
        }

        // Collect form data
        const formData = {
            firstName: $('#firstName').val().trim(),
            lastName: $('#lastName').val().trim(),
            email: $('#email').val().trim(),
            phone: $('#phone').val().trim(),
            username: $('#username').val().trim(),
            password: $('#password').val(),
            country: $('#country').val(),
            message: $('#message').val().trim(),
            newsletter: $('#newsletter').is(':checked'),
            timestamp: new Date().toISOString()
        };

        console.log("Form data:", formData);

        // Add loading state using jQuery
        $('.form-wrapper').addClass('loading');

        // Submit using jQuery AJAX
        $.ajax({
            url: 'http://localhost:5000/api/contact',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function (response) {
                console.log("Server response:", response);

                // Remove loading state
                $('.form-wrapper').removeClass('loading');

                // Hide form and show success message using jQuery
                $('#contact-form .form-section, #contact-form .form-actions')
                    .fadeOut(400, function () {
                        $('#success-message').fadeIn(600);
                    });
            },
            error: function (xhr, status, error) {
                console.error("Submission error:", error);

                $('.form-wrapper').removeClass('loading');

                // Handle server-side validation errors
                if (xhr.responseJSON && xhr.responseJSON.errors) {
                    const errors = xhr.responseJSON.errors;

                    // Display server-side validation errors
                    $.each(errors, function (field, message) {
                        const $group = $(`#${field}`).closest('.form-group');
                        $group.addClass('invalid');
                        $group.find('.error-message').text(message);
                    });

                    // Scroll to first error
                    $('html, body').animate({
                        scrollTop: $('.invalid').first().offset().top - 100
                    }, 500);
                } else {
                    alert('An error occurred. Please try again.');
                }
            }
        });
    });

    // ============================================
    // RESET BUTTON - jQuery Animation
    // ============================================

    $('.btn-reset').on('click', function () {
        // Clear all validation states using jQuery
        $('.form-group').removeClass('valid invalid');
        $('.error-message').text('');

        // Add a little animation feedback
        $(this).css('transform', 'scale(0.95)');
        setTimeout(() => {
            $(this).css('transform', 'scale(1)');
        }, 100);
    });

    // ============================================
    // JQUERY EFFECTS - Show jQuery Capabilities
    // ============================================

    // Smooth form section reveal on page load
    $('.form-section').hide().each(function (index) {
        $(this).delay(index * 100).fadeIn(600);
    });

    // Input focus effects using jQuery
    $('input, select, textarea').on('focus', function () {
        $(this).parent().addClass('focused');
    }).on('blur', function () {
        $(this).parent().removeClass('focused');
    });

    // Load countries on page load
    loadCountries();
});
