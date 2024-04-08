export const PASSWORD_MIN_LENGTH = 4;
export const PASSWORD_REGEX = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*?[#?!@$%^&*-]).+$/
);

/* ERROR MESSAGE */
export const PASSWORD_REGEX_ERROR_MSG =
  "A password must have lowercase, UPPERCASE, a number and special characters.";
export const PASSWORD_CONFIRM_FAIL_MSG = "Both passwords should be the same!";
