class InputValidationMessage {

    // register new User
    static MISSING_PSEUDO = "Le champ pseudo est requis";
    static PSEUDO_TO_SHORT = "Le pseudo doit faire plus de 3 caractères";
    static MISSING_EMAIL = "Le champ email est requis";
    static NOT_VALID_EMAIL = "L'email n'est pas valide";
    static MISSING_PASSWORD = "Le champ password est requis";
    static PASSWORD_TO_SHORT = "Le mot de passe doit faire plus de 8 caractères";
    




}

module.exports = InputValidationMessage;