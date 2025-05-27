export const validateUsername = (username) => {
    if (!username) return "Username is required";
    if (username.length < 3) return "Username must be at least 3 characters";
    if (username.length > 20) return "Username must be less than 20 characters";
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) return "Username can only contain letters, numbers, and underscores";
    return "";
};

export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
};

export const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return "";
};

export const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword) return "Confirm password is required";
    if (confirmPassword !== password) return "Confirm password should be the same as password";
    return "";
};

export const validateField = (field, value, formData = {}) => {
    switch (field) {
        case "username":
            return validateUsername(value);
        case "email":
            return validateEmail(value);
        case "password":
            return validatePassword(value);
        case "confirmPassword":
            return validateConfirmPassword(formData.password, value);
        default:
            return "";
    }
};

export const validateForm = (formData) => {
    const errors = {};
    if ('username' in formData) errors.username = validateUsername(formData.username);
    if ('email' in formData) errors.email = validateEmail(formData.email);
    if ('password' in formData) errors.password = validatePassword(formData.password);
    if ('confirmPassword' in formData) errors.confirmPassword = validateConfirmPassword(formData.password, formData.confirmPassword);
    return errors;
};

export const hasErrors = (errors) => {
    return Object.values(errors).some(error => error !== "");
};